import { Box, Button, Popper } from "@mui/material";
import React, {
  Fragment,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
// import { useSelector } from "react-redux";
import Week from "./Week";
import "./scheduler.css";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";
import { APIContext } from "../../../Auth";
import { TaskDraggingPreview } from "./TaskDraggingPreview";
import { indexTasks } from "../../../Utils/task.utils";

const weekHeight = 150;
const days = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];

export default function Scheduler() {
  const [tasks, setTasks] = useState([]);
  const scrollRef = useRef();
  const [offset, setOffset] = useState(-1);
  const anchorRef = useRef(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const isDragging = false; //useSelector((state) => state.general.currentlyDragging);
  const [lockedPos, setLockedPos] = useState(weekHeight * 0.75);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [currentDateOffset, setCurrentDateOffset] = useState(1);

  const [numAbove, setNumAbove] = useState(0);

  const popperOpen = Boolean(anchorEl) && numAbove > 0;
  const id = popperOpen ? "simple-popper-id" : undefined;
  useEffect(() => {
    const date = moment()
      .endOf("week")
      .add(currentDateOffset - 1, "weeks");
    const count = tasks.reduce(
      (acc, cur) => (moment(cur.end_time).isBefore(date) ? ++acc : acc),
      0
    );
    setNumAbove(count);
  }, [currentDateOffset, tasks]);
  useEffect(() => {
    console.log("ref set", anchorRef.current);
    setAnchorEl(anchorRef.current);
  }, [anchorRef.current]);
  const API = useContext(APIContext);
  const loadtasks = async () => {
    const newTasks = await API.loadCalendar();
    // setTasks();
    console.log("loaded", newTasks);
    setTasks(newTasks);
  };

  useEffect(() => {
    loadtasks();
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      console.log("moving");
      setTasks(
        indexTasks([
          ...tasks.filter((t) => t.id !== "temp"),
          {
            id: "temp",
            start_time: moment(startDate).isSameOrBefore(endDate)
              ? moment(startDate).startOf("day").toISOString()
              : moment(endDate).startOf("day").toISOString(),
            end_time: moment(startDate).isSameOrBefore(endDate)
              ? moment(endDate).endOf("day").toISOString()
              : moment(startDate).endOf("day").toISOString(),
            name: "New Task",
          },
        ])
      );
    } else {
      setTasks((ta) => indexTasks(ta.filter((t) => t.id !== "temp")));
    }
  }, [startDate, endDate]);

  const startDragSelect = (date) => {
    console.log("start drag select", date);
    setStartDate(date);
    setEndDate(date);
  };
  const mouseOver = (date) => {
    if (startDate) {
      setEndDate(date);
    }
  };
  const endDragSelect = () => {
    setStartDate(null);
    setEndDate(null);
  };
  const saveTask = async (task) => {
    console.log(await API.saveTask(task));
    loadtasks();
  };
  const finishTask = async (id) => {
    deleteTask(id);
  };
  const deleteTask = async (id) => {
    console.log(await API.deleteTask(id));
    loadtasks();
  };
  const createScheduled = async (scheduledTask) => {
    console.log(await API.createScheduled(scheduledTask));
    loadtasks();
  };
  const finishScheduled = async (id) => {
    console.log(await API.finishScheduled(id));
    loadtasks();
  };
  const scrollToRef = useRef(0);

  useLayoutEffect(() => {
    scrollRef.current.scrollTo(0, scrollToRef.current);
  }, [offset]);

  const onScroll = () => {
    // if (lockedPos) {
    //   scrollRef.current.scrollTo(0, lockedPos);
    //   return;
    // }
    const currentPos = scrollRef.current.scrollTop;

    setCurrentDateOffset(
      Math.floor(
        currentPos / scrollRef.current.children[0].clientHeight + offset + 0.5
      )
    );
    setLockedPos(currentPos);
    // console.log(scrollRef.current.scrollTop, scrollRef.current.clientHeight);
    if (currentPos < weekHeight) {
      //add week above
      scrollToRef.current =
        currentPos + scrollRef.current.children[0].clientHeight;

      setOffset(offset - 1);
    }
    if (currentPos > 7 * weekHeight - scrollRef.current.clientHeight) {
      scrollToRef.current =
        currentPos - scrollRef.current.children[0].clientHeight;

      setOffset(offset + 1);
    }
  };
  useEffect(() => {
    scrollRef.current.scrollTo(0, weekHeight * 0.75);
  }, []);

  return (
    <Fragment>
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexFlow: "column",
        }}
      >
        <div style={{ height: "70px" }} ref={anchorRef}>
          <div style={{ display: "flex" }}>
            <Button
              onClick={(e) => {
                setOffset(-1);
                scrollToRef.current = weekHeight * 0.75;
              }}
            >
              Today
            </Button>

            <div style={{ fontSize: "30px" }}>
              {moment()
                .startOf("week")
                .add(currentDateOffset, "weeks")
                .add(3, "days")
                .format("MMMM YYYY")}
            </div>
          </div>
          <div style={{ display: "flex", width: "100%" }}>
            {days.map((d, i) => (
              <div
                style={{
                  width: `${100 / 7}%`,
                  textAlign: "center",
                  fontSize: "22px",
                }}
              >
                {d}
              </div>
            ))}
          </div>
        </div>
        <div
          style={{
            width: "100%",
            position: "relative",
            flexGrow: 1,
            overflow: "hidden",
          }}
        >
          <div
            className="infinite-scroll"
            ref={scrollRef}
            onScroll={onScroll}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              top: isDragging ? -lockedPos : 0,
              ...(isDragging ? {} : { overflowY: "scroll" }),
            }}
          >
            {[...new Array(8)].map((_, i) => (
              <Week
                tasks={tasks}
                mouseOver={mouseOver}
                startDate={startDate}
                offset={i + offset}
                height={weekHeight}
                mouseDown={startDragSelect}
                popupClosed={endDragSelect}
                saveTask={saveTask}
                deleteTask={deleteTask}
                finishTask={finishTask}
                createScheduled={createScheduled}
                finishScheduled={finishScheduled}
              />
            ))}
          </div>
        </div>
      </div>

      <Popper
        id={id}
        open={popperOpen}
        anchorEl={anchorEl}
        placement="bottom"
        style={{ zIndex: 100000 }}
      >
        <Box
          sx={{
            p: "2px",
            pl: "10px",
            pr: "10px",
            bgcolor: "background.paper",
            borderBottomLeftRadius: "10px",
            borderBottomRightRadius: "10px",
            borderTop: "1px solid #ddd",
          }}
        >
          {numAbove} Above
        </Box>
      </Popper>
    </Fragment>
  );
}
