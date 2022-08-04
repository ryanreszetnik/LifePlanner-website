import moment from "moment";
import React, { createRef, useEffect, useRef, useState } from "react";
import CourseTasks from "./CourseTasks";
import "./Table.css";

export default function CourseTable({ courses, saveTask, deleteTask }) {
  const courseHeader = (course) => {
    return (
      <div
        style={{
          width: `${100 / courses.length}%`,
          minWidth: "125px",
          // border: "1px solid black",
        }}
        key={course.id}
      >
        <div
          style={{
            margin: "auto",
            textAlign: "center",
            backgroundColor: course.color,
            width: "fit-content",
            padding: "5px 10px ",
            borderRadius: "2px",
            marginBottom: "5px",
            color: "white",
            fontFamily: "arial",
            fontSize: "22px",
          }}
        >
          {course.name}
        </div>
      </div>
    );
  };
  return (
    <div style={{ flexGrow: 1, display: "flex", flexFlow: "column" }}>
      <div style={{ display: "flex" }}>
        {courses.map((course) => courseHeader(course))}
      </div>
      <div
        style={{
          flexGrow: 1,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: -15,
            overflowY: "scroll",
            display: "flex",
            // flexFlow: "row",
          }}
        >
          {courses.map((course, i) => (
            <div
              style={{
                width: `${100 / courses.length}%`,
                backgroundColor: "#eee",
                marginLeft: "4px",
                marginRight: "4px",
                borderRadius: "10px",
                height: "fit-content",
                minHeight: "100%",
              }}
            >
              <CourseTasks
                courseId={course.id}
                tasks={course.tasks}
                saveTask={saveTask}
                deleteTask={deleteTask}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
