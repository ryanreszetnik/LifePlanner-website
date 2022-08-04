import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import { APIContext } from "../../Auth";
import CourseTable from "./CourseTable";
export default function Today() {
  const [courses, setCourses] = useState([]);
  const API = useContext(APIContext);
  const loadCourses = async () => {
    const newCourses = await API.loadHome();
    console.log("loaded", newCourses);
    setCourses(newCourses);
  };

  useEffect(() => {
    loadCourses();
  }, []);
  const saveTask = async (task) => {
    console.log(await API.saveTask(task));
    setCourses(await API.loadHome());
  };
  const deleteTask = async (id) => {
    console.log(await API.deleteTask(id));
    setCourses(await API.loadHome());
  };
  return (
    <div
      style={{ fontSize: 30, flexGrow: 1, display: "flex", flexFlow: "column" }}
    >
      <div>{moment().format("dddd MMM Do")}</div>
      <CourseTable
        courses={courses}
        saveTask={saveTask}
        deleteTask={deleteTask}
      />
    </div>
  );
}
