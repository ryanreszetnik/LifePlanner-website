import { Button, Input, Popover } from "@mui/material";
import React, { useContext, useEffect, useRef, useState } from "react";
import { APIContext } from "../../Auth";
import { HexColorPicker } from "react-colorful";

import CoursePreference from "./CoursePreference";

export default function CoursePreferences() {
  const [courses, setCourses] = useState([]);
  const API = useContext(APIContext);
  const buttonRef = useRef();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [newCourse, setNewCourse] = useState({ name: "", color: "#000000" });

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const openEdit = () => {
    setAnchorEl(buttonRef.current);
  };

  const loadCourses = async () => {
    setCourses(await API.getCourses());
  };
  useEffect(() => {
    loadCourses();
  }, []);
  const saveCourse = async (course) => {
    console.log(await API.updateCourse(course));
    setCourses(await API.getCourses());
  };
  const deleteCourse = async (id) => {
    const data = await API.headDeleteCourse(id);
    console.log(data);
    // console.log(await API.deleteCourse(id));
    alert(`Are you sure you want to`);
    setCourses(await API.getCourses());
  };
  const saveNewCourse = async () => {
    handleClose();
    await API.createCourse(newCourse);
    setNewCourse({ name: "", color: "#000000" });
    setCourses(await API.getCourses());
  };
  return (
    <div>
      <div>Courses</div>
      <div style={{ display: "flex" }}>
        {courses.map((course) => (
          <CoursePreference
            key={course.id}
            course={course}
            saveCourse={saveCourse}
            deleteCourse={deleteCourse}
          />
        ))}
      </div>
      <Button onClick={openEdit} ref={buttonRef}>
        Add Course
      </Button>
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
        <div style={{ display: "flex" }}>
          <Input
            style={{
              backgroundColor: newCourse.color,
              color: "white",
            }}
            fullWidth
            autoFocus
            value={newCourse.name}
            onChange={(e) =>
              setNewCourse((co) => ({ ...co, name: e.target.value }))
            }
          />
        </div>
        <HexColorPicker
          color={newCourse.color}
          onChange={(c) => setNewCourse((co) => ({ ...co, color: c }))}
        />
        <div>
          <Button
            variant="contained"
            color="success"
            onClick={saveNewCourse}
            style={{ width: "100%" }}
          >
            Save
          </Button>
        </div>
      </Popover>
    </div>
  );
}
