import React, { Fragment, useEffect, useRef, useState } from "react";
import { HexColorPicker } from "react-colorful";
import { Button, Input, Popover } from "@mui/material";

export default function CoursePreference({ course, saveCourse, deleteCourse }) {
  const courseRef = useRef();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [newCourse, setNewCourse] = useState(course);

  const updateCourse = (field, value) => {
    setNewCourse({ ...newCourse, [field]: value });
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const openEdit = () => {
    setAnchorEl(courseRef.current);
  };
  const save = () => {
    handleClose();
    saveCourse(newCourse);
  };
  const handleDelete = () => {
    handleClose();
    deleteCourse(course.id);
  };
  useEffect(() => {
    if (open) {
      setNewCourse(course);
    }
  }, [open]);
  return (
    <Fragment>
      <div
        ref={courseRef}
        onClick={openEdit}
        style={{
          backgroundColor: course.color,
          color: "white",
          margin: "10px",
          textAlign: "center",
          width: "fit-content",
          padding: "5px 10px ",
          borderRadius: "2px",
          marginBottom: "5px",
          fontFamily: "arial",
          fontSize: "22px",
          cursor: "pointer",
        }}
      >
        <div>{course.name}</div>
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
        <div style={{ display: "flex" }}>
          <Input
            style={{
              backgroundColor: newCourse.color,
              color: "white",
            }}
            fullWidth
            autoFocus
            value={newCourse.name}
            onChange={(e) => updateCourse("name", e.target.value)}
          />
        </div>
        <HexColorPicker
          color={newCourse.color}
          onChange={(c) => updateCourse("color", c)}
        />
        <div>
          <Button
            variant="contained"
            color="error"
            onClick={handleDelete}
            style={{ width: "50%" }}
          >
            Delete
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={save}
            style={{ width: "50%" }}
          >
            Save
          </Button>
        </div>
      </Popover>
    </Fragment>
  );
}
