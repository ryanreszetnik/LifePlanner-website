import moment from "moment";

export const indexTasks = (tasks) => {
  const tas = tasks.sort((a, b) => {
    return moment(a.start_time).isSame(moment(b.start_time), "day")
      ? moment(a.end_time).isSame(moment(b.end_time), "day")
        ? moment(a.start_time).isAfter(moment(b.start_time))
          ? 1
          : -1
        : moment(a.end_time).isAfter(moment(b.end_time))
        ? -1
        : 1
      : moment(a.start_time).isBefore(moment(b.start_time))
      ? -1
      : 1;
  });
  let endDatesForPos = [];
  for (let i = 0; i < tas.length; i++) {
    let found = false;
    if (!moment(tas[i].start_time).isSame(moment(tas[i].end_time), "day")) {
      for (let p = 0; p < endDatesForPos.length; p++) {
        if (
          moment(endDatesForPos[p]).isBefore(
            moment(tas[i].start_time).startOf("day").toISOString()
          )
        ) {
          endDatesForPos[p] = moment(tas[i].end_time)
            .startOf("day")
            .toISOString();
          tas[i].index = p;
          found = true;
          break;
        }
      }
    } else {
      for (let p = endDatesForPos.length - 1; p >= 0; p--) {
        if (
          moment(tas[i].start_time)
            .startOf("day")
            .isAfter(moment(endDatesForPos[p]).endOf("day"))
        ) {
          endDatesForPos.pop();
        } else {
          break;
        }
      }
    }
    if (found) continue;

    tas[i].index = endDatesForPos.length;
    endDatesForPos.push(moment(tas[i].end_time).startOf("day").toISOString());
  }
  return tas;
};

export const flattenTasksAndScheduled = (tasks) => {
  return [
    ...tasks,
    ...tasks
      .map((task) =>
        task.scheduled.map((s) => ({
          ...s,
          isScheduled: true,
          course: task.course,
          type: task.type,
          taskId: task.id,
          taskName: task.name,
        }))
      )
      .flat(),
  ];
};
