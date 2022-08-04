import { Box, IconButton, Popover, Popper } from "@mui/material";
import moment from "moment";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { getEmptyImage } from "react-dnd-html5-backend";
import { useDrag } from "react-dnd";
import { v4 as uuidv4 } from "uuid";
import AddTaskIcon from "@mui/icons-material/AddTask";
export default function TaskPreview({
  task,
  blank = false,
  left = false,
  middle = false,
  right = false,
  forceEllipse = false,
  forceText = false,
  onClick = () => {},
  finishTask = () => {},
  draggingElement = false,
  cancelNewTask = () => {},
  createScheduled = () => {},
}: any) {
  const schedule = () => {
    createScheduled({
      name: "",
      start_time: task.start_time,
      end_time: task.end_time,
      task: task.id,
    });
  };

  const [{ opacity, dragging }, drag, preview] = useDrag(
    () => ({
      type: "task",
      item: task,
      collect: (monitor) => ({
        opacity: monitor.isDragging() ? 0.4 : 1,
        dragging:
          monitor.isDragging() ||
          (task?.id && monitor.getItem()?.id === task?.id),
        // currentDragId: monitor.getItem().id,
      }),
    }),
    [task]
  );
  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, []);
  const popoverAnchor = useRef(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  // const [hoverMainDiv, setHoverMainDiv] = useState(false);
  // const [hoverPopover, setHoverPopover] = useState(false);
  const showTime =
    task &&
    !(
      moment(task.start_time).format("h:mm a") === "12:00 am" &&
      moment(task.end_time).format("h:mm a") === "11:59 pm"
    );
  const getBorderColor = () => {
    switch (task.type) {
      case "EVENT":
        return "#457b3b";
      case "ASSIGNMENT":
        return "#3873cb";
      case "EXAM":
        return "red";
      case "QUIZ":
        return "#9031aa";
      case "NOTE":
        return task.color;
    }
  };
  const getBackgroundColor = () => {
    if (task.id === "temp") return "#fff";
    if (draggingElement) return "red";
    if (task.course?.color) return task.course.color;
    return "beige";
  };
  const getTextColor = () => {
    if (task.course?.color) return "white";
    return "black";
  };
  const getDateTextColor = () => {
    if (task.course?.color) return "#eee";
    return "#444";
  };
  const getStyles = (): any => {
    if (left && right) {
      return {
        borderRadius: "5px",
        marginLeft: "5px",
        marginRight: "5px",
      };
    } else if (left) {
      return {
        borderRadius: "5px 0 0 5px",
        marginLeft: "5px",
        zIndex: 2,
        whiteSpace: "nowrap",
        textOverflow: "none",
        overflow: "shown",
      };
    } else if (right) {
      return {
        borderRadius: "0 5px 5px 0",
        marginRight: "15px",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        overflow: "hidden",
      };
    } else if (middle) {
      return { borderRadius: "0" };
    }
  };
  const getWordStyle = (): any => {
    return {
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
      overflow: "hidden",
    };
  };
  return (
    <Fragment>
      <div
        ref={drag}
        key={task ? task.id : uuidv4()}
        role="BoxPreview"
        onClick={onClick}
        onMouseOver={(e) => {
          if (e.buttons === 1) return;

          setPopoverOpen(true);
        }}
        onMouseLeave={() => setPopoverOpen(false)}
        // onMouseDown={(e) => !blank && e.stopPropagation()}
        style={{
          width: "100%",
          display: "flex",
          height: left && right ? "" : "20px",
          marginTop: "5px",
          marginBottom: "5px",
          paddingBottom: left && right ? 0 : "5px",
          position: "relative",
          opacity: dragging ? 0.4 : 1,
        }}
      >
        <div
          ref={popoverAnchor}
          style={
            blank
              ? { height: "100%" }
              : {
                  padding: "3px 8px",
                  cursor: "pointer",
                  backgroundColor: getBackgroundColor(),
                  color: getTextColor(),
                  flexGrow: 1,
                  height: "100%",
                  userSelect: "none",
                  ...getStyles(),
                  ...(forceText
                    ? {
                        whiteSpace: "nowrap",
                        textOverflow: "none",
                        overflow: "shown",
                        zIndex: 2,
                      }
                    : {}),
                  ...(forceEllipse ? getWordStyle() : {}),
                  borderRight: right
                    ? task.type === "NOTE"
                      ? "none"
                      : `10px solid ${getBorderColor()}`
                    : "none",
                }
          }
        >
          {(left || forceText) && !blank && (
            <div style={{ display: "flex" }}>
              <div>{task.name}</div>
              {showTime && !(left && right) && (
                <div
                  style={{
                    fontSize: "12px",
                    color: getDateTextColor(),
                    // marginLeft: "3px",
                    marginTop: "auto",
                    marginBottom: "auto",
                    verticalAlign: "middle",
                  }}
                >
                  {moment(task.start_time).format("h:mm a")}
                </div>
              )}
            </div>
          )}
          {left && right && showTime && (
            <div style={{ fontSize: "12px", color: getDateTextColor() }}>
              {`${moment(task.start_time).format("h:mm a ")}-${moment(
                task.end_time
              ).format(" h:mm a")}`}
            </div>
          )}
          {right && !left && showTime && (
            <div
              style={{
                textAlign: "right",
                fontSize: "12px",
                color: getDateTextColor(),
                height: "100%",
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                alignContent: "center",
              }}
            >
              {moment(task.end_time).format(" h:mm a")}
            </div>
          )}
        </div>
      </div>

      <Popper
        style={{ zIndex: 500 }}
        onMouseDown={(e) => e.stopPropagation()}
        onMouseUp={(e) => e.stopPropagation()}
        onMouseEnter={() => setPopoverOpen(true)}
        onMouseLeave={() => setPopoverOpen(false)}
        open={popoverOpen && task?.id !== "temp" && !dragging}
        anchorEl={popoverAnchor.current}
      >
        <Box
          sx={{
            p: "2px",
            bgcolor: "background.paper",
            borderRadius: "3px",
          }}
        >
          <IconButton onClick={schedule}>
            <AddTaskIcon />
          </IconButton>
          <IconButton
            onClick={(e) => {
              finishTask(task.id);
            }}
          >
            <CheckCircleOutlineOutlinedIcon color="success" />
          </IconButton>
        </Box>
      </Popper>
    </Fragment>
  );
}
