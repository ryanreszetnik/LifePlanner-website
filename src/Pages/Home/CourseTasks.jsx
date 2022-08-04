import moment from "moment";
import React from "react";
import TaskPreview from "./TaskPreview";

export default function CourseTasks({ courseId, tasks, saveTask, deleteTask }) {
  const sortedTasks = tasks.sort((a, b) =>
    !a.start_time
      ? -1
      : !b.start_time
      ? 1
      : moment(a.start_time).isBefore(b.start_time)
      ? -1
      : 1
  );
  const nowTime = moment();
  const noDates = sortedTasks.filter(
    (task) => !task.start_time || !task.end_time
  );
  const old = sortedTasks.filter((task) =>
    moment(task.end_time).isBefore(moment())
  );
  const ongoing = sortedTasks.filter(
    (task) =>
      moment(task.start_time).isBefore(moment()) &&
      moment(task.end_time).isAfter(moment())
  );
  const upcoming = sortedTasks.filter(
    (task) =>
      moment(task.start_time).isAfter(moment()) &&
      moment(task.start_time).isBefore(moment().add(1, "week"))
  );
  const future = sortedTasks.filter(
    (task) =>
      moment(task.start_time).isAfter(moment()) &&
      moment(task.start_time).isAfter(moment().add(1, "week"))
  );

  return (
    <div
      style={{
        minHeight: "100%",
      }}
    >
      {noDates.length > 0 && <div className="category-title">No Date </div>}
      {noDates.map((task) => (
        <TaskPreview
          task={{ ...task, courseId }}
          saveTask={saveTask}
          deleteTask={deleteTask}
        />
      ))}
      {old.length > 0 && <div className="category-title"> Overdue</div>}
      {old.map((task) => (
        <TaskPreview
          task={{ ...task, courseId }}
          saveTask={saveTask}
          deleteTask={deleteTask}
        />
      ))}
      {ongoing.length > 0 && <div className="category-title"> Ongoing</div>}
      {ongoing.map((task) => (
        <TaskPreview
          task={{ ...task, courseId }}
          showTime
          saveTask={saveTask}
          deleteTask={deleteTask}
        />
      ))}
      {upcoming.length > 0 && <div className="category-title">Next Week</div>}
      {upcoming.map((task) => (
        <TaskPreview
          task={{ ...task, courseId }}
          showTime
          saveTask={saveTask}
          deleteTask={deleteTask}
        />
      ))}
      {future.length > 0 && <div className="category-title">Upcoming</div>}
      {future.map((task) => (
        <TaskPreview
          task={{ ...task, courseId }}
          showTime
          saveTask={saveTask}
          deleteTask={deleteTask}
        />
      ))}
    </div>
  );
}
