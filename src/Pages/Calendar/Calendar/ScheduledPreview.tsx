import { Box, IconButton, Popover, Popper } from "@mui/material";
import moment from "moment";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { getEmptyImage } from "react-dnd-html5-backend";
import { useDrag } from "react-dnd";
import { v4 as uuidv4 } from "uuid";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import AddTaskIcon from "@mui/icons-material/AddTask";
import { es } from "date-fns/locale";
export default function ScheduledPreview({
  scheduled,
  left = false,
  middle = false,
  right = false,
  forceEllipse = false,
  forceText = false,
  onClick = () => {},
  onFinish = () => {},
}: any) {
  const [{ opacity, dragging }, drag, preview] = useDrag(
    () => ({
      type: "scheduled",
      item: scheduled,
      collect: (monitor) => ({
        opacity: monitor.isDragging() ? 0.4 : 1,
        dragging:
          monitor.isDragging() ||
          (scheduled?.id && monitor.getItem()?.id === scheduled?.id),
        // currentDragId: monitor.getItem().id,
      }),
    }),
    [scheduled]
  );
  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, []);

  const popoverAnchor = useRef(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  // const [hoverMainDiv, setHoverMainDiv] = useState(false);
  // const [hoverPopover, setHoverPopover] = useState(false);
  const showTime =
    scheduled &&
    !(
      moment(scheduled.start_time).format("h:mm a") === "12:00 am" &&
      moment(scheduled.end_time).format("h:mm a") === "11:59 pm"
    );
  const getBorderColor = () => {
    switch (scheduled.type) {
      case "EVENT":
        return "#457b3b";
      case "ASSIGNMENT":
        return "#3873cb";
      case "EXAM":
        return "red";
      case "QUIZ":
        return "#9031aa";
      case "NOTE":
        return "beige";
    }
  };
  const getBackgroundColor = () => {
    // if (draggingElement) return "red";
    if (scheduled.course?.color) return scheduled.course.color;
    return "beige";
  };
  const getTextColor = () => {
    if (scheduled.course?.color) return "white";
    return "black";
  };
  const getDateTextColor = () => {
    if (scheduled.course?.color) return "#eee";
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
        key={scheduled ? scheduled.id : uuidv4()}
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
          style={{
            cursor: "pointer",
            backgroundColor: getBackgroundColor(),
            color: getTextColor(),
            flexGrow: 1,
            height: "100%",
            paddingBottom: left && right ? 0 : "5px",
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
          }}
        >
          <div style={{ display: "flex" }}>
            {(left || forceText) && (
              <Fragment>
                <div
                  style={{
                    padding: "3px 8px",
                    flexGrow: 1,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      // height: "100%",
                      padding: 0,
                      margin: 0,
                    }}
                  >
                    <div>{scheduled.name}</div>
                    {!(left && right) && (
                      <div
                        style={{
                          fontSize: "12px",
                          paddingLeft: "2px",
                          marginTop: "auto",
                          marginBottom: "auto",
                        }}
                      >{`(${scheduled.taskName})`}</div>
                    )}
                  </div>
                  {left && right && (
                    <div
                      style={{
                        fontSize: "12px",
                        paddingLeft: "2px",
                        marginTop: "auto",
                        marginBottom: "auto",
                      }}
                    >{`(${scheduled.taskName})`}</div>
                  )}
                  {left && right && showTime && (
                    <div
                      style={{ fontSize: "12px", color: getDateTextColor() }}
                    >
                      {`${moment(scheduled.start_time).format(
                        "h:mm a "
                      )}-${moment(scheduled.end_time).format(" h:mm a")}`}
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
                      {moment(scheduled.end_time).format(" h:mm a")}
                    </div>
                  )}
                </div>

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
                    {moment(scheduled.start_time).format("h:mm a")}
                  </div>
                )}
              </Fragment>
            )}
            {right && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                }}
                onMouseUp={(e) => {
                  e.stopPropagation();
                }}
                style={{
                  width: "fit-content",
                  backgroundColor: getBorderColor(),
                  borderRadius: "0 5px 5px 0",
                  marginLeft: "auto",
                }}
              >
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    onFinish(scheduled.id);
                  }}
                >
                  <CheckCircleOutlineIcon
                    color={scheduled.type === "EVENT" ? "action" : "success"}
                  />
                </IconButton>
              </div>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
}
