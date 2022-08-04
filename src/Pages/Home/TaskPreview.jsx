import { Popover } from "@mui/material";
import moment from "moment";
import React, { Fragment, useRef } from "react";
import NewTask from "../../Components/NewTask";

export default function TaskPreview({
  task,
  showTime = true,
  saveTask,
  deleteTask,
}) {
  const dayRef = useRef();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const openNewTask = () => {
    setAnchorEl(dayRef.current);
  };
  const oneDay = moment(task.start_time).isSame(task.end_time, "day");
  const allDay =
    moment(task.start_time).format("hh:mm a") === "12:00 am" &&
    moment(task.end_time).format("hh:mm a") === "11:59 pm";
  const getTimeString = (start, end) => {
    if (oneDay) {
      return (
        moment(start).calendar({
          sameDay: `[Today] ${showTime && !allDay ? "h:mm a - " : ""}`,
          nextDay: `[Tomorrow] ${showTime && !allDay ? "h:mm a - " : ""}`,
          nextWeek: `dddd ${showTime && !allDay ? "h:mm a - " : ""}`,
          lastDay: `[Yesterday] ${showTime && !allDay ? "h:mm a - " : ""}`,
          lastWeek: `[Last] dddd ${showTime && !allDay ? "h:mm a - " : ""}`,
          sameElse: `MMM Do ${showTime && !allDay ? "h:mm a - " : ""}`,
        }) + (showTime && !allDay ? moment(end).format("h:mm a") : "")
      );
    } else {
      return (
        moment(start).calendar({
          sameDay: `[Today] ${showTime && !allDay ? "h:mm a" : ""} - `,
          nextDay: `[Tomorrow] ${showTime && !allDay ? "h:mm a" : ""} - `,
          nextWeek: `ddd ${showTime && !allDay ? "h:mm a" : ""} - `,
          lastDay: `[Yesterday] ${showTime && !allDay ? "h:mm a" : ""} - `,
          lastWeek: `[Last] ddd ${showTime && !allDay ? "h:mm a" : ""} - `,
          sameElse: `MMM Do ${showTime && !allDay ? "h:mm a" : ""} - `,
        }) +
        moment(end).calendar({
          sameDay: `[Today] ${showTime && !allDay ? "h:mm a" : ""}`,
          nextDay: `[Tomorrow] ${showTime && !allDay ? "h:mm a" : ""}`,
          nextWeek: `ddd ${showTime && !allDay ? "h:mm a" : ""}`,
          lastDay: `[Yesterday] ${showTime && !allDay ? "h:mm a" : ""}`,
          lastWeek: `[Last] ddd ${showTime && !allDay ? "h:mm a" : ""}`,
          sameElse: `MMM Do ${showTime && !allDay ? "h:mm a" : ""}`,
        })
      );
    }
  };

  return (
    <Fragment>
      <div
        onClick={openNewTask}
        ref={dayRef}
        style={{
          fontSize: "20px",
          backgroundColor: "beige",
          width: "fit-content",
          marginLeft: "auto",
          marginRight: "auto",
          marginBottom: "4px",
          padding: "3px",
          paddingLeft: "10px",
          paddingRight: "10px",
          boxShadow: "-1px 4px 15px 3px rgba(0,0,0,0.48)",
          borderRadius: "3px",
          cursor: "pointer",
        }}
      >
        <div style={{ textAlign: "center" }}>{task.name}</div>
        {task.start_time && task.end_time && (
          <div style={{ fontSize: "12px", textAlign: "center" }}>
            {getTimeString(task.start_time, task.end_time)}
          </div>
        )}
      </div>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <NewTask
          initialTask={task}
          date={null}
          startDate={null}
          saveTask={(t) => {
            handleClose();
            saveTask(t);
          }}
          deleteTask={(id) => {
            handleClose();
            deleteTask(id);
          }}
        />
      </Popover>
    </Fragment>
  );
}
