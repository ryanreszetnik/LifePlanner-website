import {
  Button,
  ButtonGroup,
  FormControl,
  IconButton,
  Input,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import QuizSharpIcon from "@mui/icons-material/QuizSharp";
import AssignmentSharpIcon from "@mui/icons-material/AssignmentSharp";
import NoteAltIcon from "@mui/icons-material/NoteAlt";
import EventIcon from "@mui/icons-material/Event";
import TimePicker from "./TimePicker";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import StickyNote2Icon from "@mui/icons-material/StickyNote2";
import moment from "moment";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { DatePicker, LocalizationProvider } from "@mui/lab";
import makeStyles from "@material-ui/styles/makeStyles";
import { APIContext } from "../Auth";
// MuiOutlinedInput-input MuiInputBase-input MuiInputBase-inputAdornedEnd css-nxo287-MuiInputBase-input-MuiOutlinedInput-input
const useStyles = makeStyles({
  root: {
    "& .MuiInputBase-root": {
      padding: 0,
      "& .MuiButtonBase-root": {
        padding: 0,
        paddingLeft: 10,
      },
      "& .MuiInputBase-input": {
        padding: 15,
        paddingLeft: 0,
      },
    },
  },
});

const getDefaultTask = () => {
  const newTask: any = {
    name: "",
    completed_time: null,
    start_time: null,
    end_time: null,
    description: "",
    type: "NOTE",
    courseId: -1,
    start_date: "NOTSET",
    end_date: "NOTSET",
  };
  // console.log("getting new task", newTask);
  return newTask;
};

export default function NewScheduled({
  initialScheduled = null,
  date,
  startDate,
  saveScheduled,
  onFinish,
}: any) {
  const [task, setTask] = useState(getDefaultTask());
  const hasTwoDates =
    (date !== startDate && startDate != null) || initialScheduled;
  const updateTask = (field: any, value: any) => {
    setTask((t: any) => ({ ...t, [field]: value }));
  };
  const classes = useStyles();
  useEffect(() => {
    if (initialScheduled) {
      const isFullDay =
        initialScheduled.start_time &&
        initialScheduled.end_time &&
        moment(initialScheduled.start_time).format("hh:mm a") === "12:00 am" &&
        moment(initialScheduled.end_time).format("hh:mm a") === "11:59 pm";
      setTask({
        id: initialScheduled.id,
        isScheduled: !!initialScheduled.isScheduled,
        name: initialScheduled.name,
        taskId: initialScheduled.taskId,
        completed_time: initialScheduled.completed_time,
        start_time:
          initialScheduled.start_time === null || isFullDay
            ? null
            : moment(initialScheduled.start_time).format("hh:mm a"),
        end_time:
          initialScheduled.end_time === null || isFullDay
            ? null
            : moment(initialScheduled.end_time).format("hh:mm a"),
        start_date:
          initialScheduled.start_time === null
            ? "NOTSET"
            : moment(initialScheduled.start_time).toISOString(),
        end_date:
          initialScheduled.end_time === null
            ? "NOTSET"
            : moment(initialScheduled.end_time).toISOString(),
        description: initialScheduled.description,
        type: initialScheduled.type,
        course: initialScheduled.course,
      });
    } else if (date && startDate) {
      if (moment(startDate).isBefore(moment(date))) {
        updateTask("end_date", date);
        updateTask("start_date", startDate);
      } else {
        updateTask("end_date", startDate);
        updateTask("start_date", date);
      }
    } else if (date) {
      updateTask("end_date", date);
    } else if (startDate) {
      updateTask("start_date", startDate);
    }
  }, [date, startDate, initialScheduled]);
  const updateStartTime = (value: any) => {
    setTask((t: any) => ({
      ...t,
      start_time: value,
      end_time:
        value !== null
          ? moment(value, ["h:mm a"]).add(1, "h").format("h:mm a")
          : null,
    }));
  };
  const getTime = (time: string, date: string, isStart: boolean): any => {
    if (date === null) {
      console.log("date is null");
      return null;
    }
    if (time == null) {
      if (isStart)
        return moment(date).startOf("day").format("MM/DD/YYYY HH:mm:ss");
      return moment(date).endOf("day").format("MM/DD/YYYY HH:mm:ss");
    }
    const output = moment(date).format("MM/DD/YYYY ") + time;
    console.log("time:", time, output);
    return output;
  };
  interface CreateScheduledDTO {
    name: string;
    start_time: string;
    end_time: string;
    completed_time?: string;
    task: number;
  }

  const submit = () => {
    if (task.name.length === 0) return;
    const newTask: CreateScheduledDTO = {
      ...(task.id ? { id: task.id } : {}),
      name: task.name,
      start_time: getTime(task.start_time, task.start_date, true),
      end_time: getTime(task.end_time, task.end_date, false),
      task: task.taskId,
      completed_time: task.completed_time,
    };
    console.log("submit", newTask);
    saveScheduled(newTask);
  };
  return (
    <div style={{ padding: "10px" }}>
      <Input
        fullWidth
        type="text"
        value={task.name}
        onChange={(e) => updateTask("name", e.target.value)}
        autoFocus
        placeholder="Title"
        onKeyPress={(ev) => {
          if (ev.key === "Enter") {
            // Do code here
            submit();
            ev.preventDefault();
          }
        }}
      />
      <div style={{ paddingTop: "5px", display: "flex" }}>
        {task.type === "NOTE" && <StickyNote2Icon color="inherit" />}
        {task.type === "EVENT" && <EventIcon color="success" />}
        {task.type === "QUIZ" && <QuizSharpIcon color="secondary" />}
        {task.type === "ASSIGNMENT" && <AssignmentSharpIcon color="primary" />}
        {task.type === "EXAM" && <NoteAltIcon color="error" />}
        {task.course && (
          <div
            style={{
              width: "fit-content",
              padding: "5px 10px ",
              borderRadius: "2px",
              backgroundColor: task.course.color,
            }}
          >
            {task.course.name}
          </div>
        )}
      </div>
      <div style={{ paddingTop: "8px", display: "flex" }}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            className={classes.root}
            label={hasTwoDates ? "Start Date" : "Date"}
            inputFormat="MMM dd yyyy"
            mask=""
            value={
              task.start_date === "NOTSET" ? null : new Date(task.start_date)
            }
            onChange={(e) => {
              if (e != null) {
                updateTask("start_date", e.toISOString());
                if (!hasTwoDates) {
                  updateTask("end_date", e.toISOString());
                }
              } else {
                updateTask("start_date", "NOTSET");
              }
            }}
            renderInput={(params) => (
              <TextField
                InputLabelProps={{ shrink: true }}
                {...params}
                inputProps={{
                  ...params.inputProps,
                  style: {
                    width: "95px",
                    paddingTop: "5px",
                    paddingBottom: "5px",
                  },
                }}
              />
            )}
          />
          {hasTwoDates && (
            <div style={{ paddingTop: "4px", fontSize: "20px" }}>{"—"}</div>
          )}

          {hasTwoDates && (
            <DatePicker
              className={classes.root}
              label="End Date"
              inputFormat="MMM dd yyyy"
              mask=""
              value={
                task.end_date === "NOTSET" ? null : new Date(task.end_date)
              }
              onChange={(e) => {
                if (e != null) {
                  updateTask("end_date", e.toISOString());
                } else {
                  updateTask("end_date", "NOTSET");
                }
              }}
              renderInput={(params) => (
                <TextField
                  InputLabelProps={{ shrink: true }}
                  {...params}
                  inputProps={{
                    ...params.inputProps,
                    style: {
                      width: "95px",
                      paddingTop: "5px",
                      paddingBottom: "5px",
                    },
                  }}
                />
              )}
            />
          )}
        </LocalizationProvider>
      </div>
      <div
        style={{
          display: "flex",
          paddingTop: "4px",
        }}
      >
        <TimePicker
          initialValue={task.start_time}
          onChange={(val: any) => updateStartTime(val)}
        />
        <div style={hasTwoDates ? { width: "96px" } : {}}>
          {hasTwoDates ? "" : "-"}
        </div>
        <TimePicker
          initialValue={task.end_time}
          onChange={(val: any) => updateTask("end_time", val)}
        />
      </div>
      <div style={{ paddingTop: "10px", display: "flex" }}>
        <div
          style={{
            flexGrow: 1,
            position: "relative",
          }}
        >
          {initialScheduled && (
            <Button
              variant="contained"
              color="error"
              onClick={() => onFinish(initialScheduled.id)}
            >
              Delete
            </Button>
          )}
          <Button variant="contained" color="success" onClick={submit}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
