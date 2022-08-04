import React, { Fragment, useEffect, useRef, useState } from "react";
import moment from "moment";
import { Popover, Typography, useForkRef } from "@mui/material";
import NewTask from "../../../Components/NewTask";
import TaskPreview from "./TaskPreview";
import { useDrop } from "react-dnd";
import ScheduledPreview from "./ScheduledPreview";
import NewScheduled from "../../../Components/NewScheduled";
// import TaskContainer from "../../../Components/DragAndDrop/TaskContainer";

export default function Day({
  date,
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
  const setDate = (time, date) => {
    const dateMoment = moment(date);
    return moment(date).set({
      year: dateMoment.get("year"),
      month: dateMoment.get("month"),
      day: dateMoment.get("day"),
    });
  };
  const onDrop = (e) => {
    const dayDuration = moment(e.end_time)
      .startOf("day")
      .diff(moment(e.start_time).startOf("day"), "days");
    const newStartTime =
      moment(date).format("MM/DD/YYYY ") +
      moment(e.start_time).format("hh:mm a");
    const newEndTime =
      moment(date).add(dayDuration, "days").format("MM/DD/YYYY ") +
      moment(e.end_time).format("hh:mm a");
    if (e.isScheduled) {
      console.log(e);
      createScheduled({
        id: e.id,
        task: e.taskId,
        completed_time: e.completed_time,
        name: e.name,
        start_time: newStartTime,
        end_time: newEndTime,
      });
      return;
    }

    const newTask = {
      ...e,
      course: e.course?.id,
      start_time: newStartTime,
      end_time: newEndTime,
    };
    saveTask(newTask);
    // console.log("drop", e, newTask);
  };
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ["task", "scheduled"],
    drop: onDrop,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });
  const isActive = isOver && canDrop;
  const [selectedTask, setSelectedTask] = useState(null);
  const todayTasks = tasks
    .filter((t) =>
      moment(t.start_time).isSameOrBefore(t.end_time)
        ? moment(t.start_time).startOf("day").isSameOrBefore(date) &&
          moment(t.end_time).endOf("day").isSameOrAfter(date)
        : moment(t.start_time).endOf("day").isSameOrAfter(date) &&
          moment(t.end_time).startOf("day").isSameOrBefore(date)
    )
    .sort((a, b) => a.index - b.index);
  const dayRef = useRef();
  const isInPast = moment().isAfter(moment(date));
  const isToday = moment().isSame(moment(date), "date");
  const getColor = () => {
    if (isActive) {
      return "lightgreen";
    }
    const isOdd = moment(date).month() % 2 == 1;
    if (isToday) {
      return "#d9e7ff";
    } else if (isInPast) {
      return isOdd ? "#333" : "#777";
    } else {
      return isOdd ? "#ccc" : "#eee";
    }
    return "#333";
  };
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedTask(null);
    popupClosed();
  };
  const handleMouseDown = (e) => {
    // console.log("mouse down", e);
    if (e.target === e.currentTarget) {
      mouseDown(date);
    }
    e.stopPropagation();
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const openNewTask = () => {
    setAnchorEl(dayRef.current);
  };
  return (
    <Fragment>
      <div
        ref={drop}
        onMouseDown={handleMouseDown}
        onMouseUp={() => openNewTask(date)}
        onMouseOver={() => mouseOver(date)}
        style={{
          flexGrow: 1,
          width: `${100 / 7}%`,
          backgroundColor: getColor(),
          // border: "1px solid white",
          outline: "1px solid white",
          display: "flex",
          flexFlow: "column",
          paddingBottom: "10px",
        }}
        // onClick={openNewTask}
      >
        <div
          onMouseDown={handleMouseDown}
          ref={dayRef}
          style={{ width: "100%", height: "100%" }}
        >
          <div onMouseDown={handleMouseDown} style={{ userSelect: "none" }}>
            {moment(date).format("D")}
          </div>
          {todayTasks.length > 0 &&
            [...new Array(todayTasks[todayTasks.length - 1].index + 1)].map(
              (_, i) => {
                const t = todayTasks.find((t) => t.index === i);
                const left =
                  t && moment(t.start_time).isSame(moment(date), "day");
                const right =
                  t && moment(t.end_time).isSame(moment(date), "day");
                // console.log(Object.keys(t), t.isScheduled);
                if (t?.isScheduled) {
                  return (
                    <ScheduledPreview
                      scheduled={t}
                      left={left}
                      right={right}
                      onFinish={finishScheduled}
                      onClick={(e) => {
                        setSelectedTask(t);
                        setAnchorEl(e.currentTarget);
                        e.stopPropagation();
                      }}
                    />
                  );
                }
                return (
                  <TaskPreview
                    cancelNewTask={popupClosed}
                    onClick={(e) => {
                      setSelectedTask(t);
                      setAnchorEl(e.currentTarget);
                      e.stopPropagation();
                    }}
                    createScheduled={createScheduled}
                    finishTask={finishTask}
                    forceText={moment(date).day() === 0}
                    forceEllipse={moment(date).day() === 6 && !right}
                    blank={!t}
                    task={t}
                    left={left}
                    right={right}
                    center={!left && !right}
                    key={t ? t.id : `empty${i}`}
                  />
                );
              }
            )}
          {/* <TaskContainer
        tasks={tasks}
        id={moment(date).format("L")}
        canCreate={true}
        label={moment(date).date()}
        labelColor={!isInPast || isToday ? "black" : "white"}
      /> */}
        </div>
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
        {selectedTask?.isScheduled ? (
          <NewScheduled
            initialScheduled={selectedTask}
            onFinish={(s) => {
              handleClose();
              finishScheduled(s);
            }}
            saveScheduled={(t) => {
              handleClose();
              createScheduled(t);
            }}
          />
        ) : (
          <NewTask
            initialTask={selectedTask}
            date={date}
            startDate={startDate}
            saveTask={(t) => {
              handleClose();
              saveTask(t);
            }}
            deleteTask={(id) => {
              handleClose();
              deleteTask(id);
            }}
          />
        )}
      </Popover>
    </Fragment>
  );
}
