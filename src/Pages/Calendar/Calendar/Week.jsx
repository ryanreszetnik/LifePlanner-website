import React from "react";
import Day from "./Day";
import moment from "moment";

export default function Week({
  offset,
  height,
  mouseDown,
  popupClosed,
  startDate,
  mouseOver,
  tasks,
  saveTask,
  deleteTask,
  finishTask,
  createScheduled,
  finishScheduled,
}) {
  return (
    <div
      style={{
        minHeight: `${height}px`,
        flexGrow: 1,
        width: "100%",
        display: "flex",
        position: "relative",
      }}
    >
      {[...new Array(7)].map((_, i) => (
        <Day
          createScheduled={createScheduled}
          finishTask={finishTask}
          saveTask={saveTask}
          tasks={tasks}
          key={i + "" + offset}
          mouseDown={mouseDown}
          popupClosed={popupClosed}
          startDate={startDate}
          mouseOver={mouseOver}
          deleteTask={deleteTask}
          finishScheduled={finishScheduled}
          date={moment()
            .startOf("week")
            .add(offset, "weeks")
            .add(i, "days")
            .toISOString()}
        />
      ))}
    </div>
  );
}
