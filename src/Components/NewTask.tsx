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

export default function NewTask({
  initialTask = null,
  date,
  startDate,
  saveTask,
  deleteTask,
}: any) {
  const [courses, setCourses] = useState([{ name: "NONE", id: -1 }]);
  const API = useContext(APIContext);
  const loadCourses = async () => {
    setCourses([{ name: "NONE", id: -1 }, ...(await API?.getCourses())]);
  };
  useEffect(() => {
    loadCourses();
  }, []);
  const [task, setTask] = useState(getDefaultTask());
  const hasTwoDates = (date !== startDate && startDate != null) || initialTask;
  const updateTask = (field: any, value: any) => {
    setTask((t: any) => ({ ...t, [field]: value }));
  };
  const classes = useStyles();
  useEffect(() => {
    if (initialTask) {
      const isFullDay =
        initialTask.start_time &&
        initialTask.end_time &&
        moment(initialTask.start_time).format("hh:mm a") === "12:00 am" &&
        moment(initialTask.end_time).format("hh:mm a") === "11:59 pm";
      setTask({
        id: initialTask.id,
        isScheduled: !!initialTask.isScheduled,
        name: initialTask.name,
        completed_time: initialTask.completed_time,
        start_time:
          initialTask.start_time === null || isFullDay
            ? null
            : moment(initialTask.start_time).format("hh:mm a"),
        end_time:
          initialTask.end_time === null || isFullDay
            ? null
            : moment(initialTask.end_time).format("hh:mm a"),
        start_date:
          initialTask.start_time === null
            ? "NOTSET"
            : moment(initialTask.start_time).toISOString(),
        end_date:
          initialTask.end_time === null
            ? "NOTSET"
            : moment(initialTask.end_time).toISOString(),
        description: initialTask.description,
        type: initialTask.type,
        courseId: initialTask.course ? initialTask.course.id : -1,
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
  }, [date, startDate, initialTask]);
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
  interface CreateTaskDTO {
    id?: number;
    name: string;
    start_time?: string;
    end_time?: string;
    type: string;
    description: string;
    course: number;
    completed_time?: string;
  }

  const submit = () => {
    if (task.name.length === 0) return;
    const newTask: CreateTaskDTO = {
      ...(task.id ? { id: task.id } : {}),
      name: task.name,
      start_time: getTime(task.start_time, task.start_date, true),
      end_time: getTime(task.end_time, task.end_date, false),
      description: task.description,
      type: task.type,
      course: task.courseId === -1 ? null : task.courseId,
      completed_time: task.completed_time,
    };
    console.log("submit", newTask);
    saveTask(newTask);
  };
  return (
    <div style={{ padding: "10px" }}>
      <Input
        error={task.name.length === 0}
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
      <div style={{ paddingTop: "2px" }}>
        <ButtonGroup>
          <IconButton
            disabled={task.isScheduled}
            size="small"
            style={task.type === "NOTE" ? { backgroundColor: "#ddd" } : {}}
            onClick={() => updateTask("type", "NOTE")}
          >
            <StickyNote2Icon color="inherit" />
          </IconButton>
          <IconButton
            disabled={task.isScheduled}
            size="small"
            style={task.type === "EVENT" ? { backgroundColor: "#ddd" } : {}}
            onClick={() => updateTask("type", "EVENT")}
          >
            <EventIcon color="success" />
          </IconButton>
          <IconButton
            disabled={task.isScheduled}
            size="small"
            style={task.type === "QUIZ" ? { backgroundColor: "#ddd" } : {}}
            onClick={() => updateTask("type", "QUIZ")}
          >
            <QuizSharpIcon color="secondary" />
          </IconButton>
          <IconButton
            disabled={task.isScheduled}
            size="small"
            style={task.type === "EXAM" ? { backgroundColor: "#ddd" } : {}}
            onClick={() => updateTask("type", "EXAM")}
          >
            <NoteAltIcon color="error" />
          </IconButton>
          <IconButton
            disabled={task.isScheduled}
            size="small"
            style={
              task.type === "ASSIGNMENT" ? { backgroundColor: "#ddd" } : {}
            }
            onClick={() => updateTask("type", "ASSIGNMENT")}
          >
            <AssignmentSharpIcon color="primary" />
          </IconButton>
        </ButtonGroup>
      </div>
      <Input
        fullWidth
        value={task.description}
        onChange={(e) => updateTask("description", e.target.value)}
        multiline
        type="text"
        placeholder="Notes"
      />
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
        <FormControl>
          <InputLabel id="demo-simple-select-label">Course</InputLabel>
          <Select
            id="demo-simple-select"
            value={task.courseId}
            label="Course"
            onChange={(ev) => updateTask("courseId", ev.target.value)}
          >
            {courses.map((course) => (
              <MenuItem key={course.id} value={course.id}>
                {course.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <div
          style={{
            flexGrow: 1,
            position: "relative",
          }}
        >
          {initialTask && (
            <Button
              variant="contained"
              color="error"
              onClick={() => deleteTask(initialTask.id)}
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
