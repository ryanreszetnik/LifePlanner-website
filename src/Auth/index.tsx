import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import moment from "moment";
import { flattenTasksAndScheduled, indexTasks } from "../Utils/task.utils";
import SignIn from "./SignIn";

interface ApiContextInterface {
  loadCalendar: Function;
  loadHome: Function;
  saveTask: Function;
  getCourses: Function;
  createCourse: Function;
  deleteCourse: Function;
  updateCourse: Function;
  headDeleteCourse: Function;
  createScheduled: Function;
  finishScheduled: Function;
  login: Function;
  state: {
    today: any[];
    overdue: any[];
    eventually: any[];
    recentlyCompleted: any[];
  };
}
interface createScheduledDTO {
  name: string;
  start_time: string;
  end_time: string;
  completed_time?: string;
  task: number;
}

const backendUrl = process.env.REACT_APP_BACKEND_URL;

export const APIContext = createContext<ApiContextInterface | null>(null);

export default function Authentication({ ...props }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [jid, setJid] = useState(localStorage.getItem("jid"));
  const [token, setToken] = useState(null);

  const [today, setToday] = useState([]);
  const [overdue, setOverdue] = useState([]);
  const [recentlyCompleted, setRecentlyCompleted] = useState([]);
  const [eventually, setEventually] = useState([]);

  const API = {
    async get(path: string, params: any = {}) {
      return await axios.get(`${backendUrl}${path}`, {
        params,
        headers: {
          Authorization: token ? `Bearer ${token}` : jid ? jid : "",
        },
      });
    },
    async post(path: string, data: any = {}, options: any = {}) {
      return await axios.post(`${backendUrl}${path}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    async delete(path: string) {
      return await axios.delete(`${backendUrl}${path}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    async put(path: string, data: any = {}, options: any = {}) {
      return await axios.put(`${backendUrl}${path}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
  };

  const login = async (email: string, password: string) => {
    const resp = await API.post("/auth/login", { email, password });
    localStorage.setItem("jid", resp.data.refreshToken);
    setJid(resp.data.refreshToken);
  };
  const refreshToken = async () => {
    if (!token) {
      const res = (
        await axios.get(`${backendUrl}/auth/refresh`, {
          headers: { Authorization: `${jid}` },
        })
      ).data;
      if (res.ok) {
        setToken(res.accessToken);
        localStorage.setItem("jid", res.refreshToken);
        setIsAuthenticated(true);
        return;
      }
      // await login("bob@bob.com", "password");
    }
  };
  const endpoints = {
    login,
    async loadCalendar() {
      const data = (await API.get("/task")).data;
      const tasks = indexTasks(flattenTasksAndScheduled(data));
      setToday(
        tasks.filter(
          (task: any) =>
            task.start_time &&
            task.end_time &&
            moment(task.start_time).isBefore(moment().endOf("day")) &&
            moment(task.end_time).isAfter(moment().startOf("day"))
        )
      );
      return tasks;
    },
    async loadHome() {
      console.log("loadHome");
      return (await API.get("/course/withTasks")).data;
    },
    async saveTask(task: any) {
      return (await API.post("/task", task)).data;
    },
    async getCourses() {
      return (await API.get("/course")).data;
    },
    async deleteTask(id: number) {
      return (await API.delete(`/task?id=${id}`)).data;
    },
    async updateCourse(course: any) {
      return (await API.put("/course", course)).data;
    },
    async deleteCourse(id: number) {
      return (await API.delete(`/course?id=${id}`)).data;
    },
    async createCourse(course: any) {
      return (await API.post("/course", course)).data;
    },
    async headDeleteCourse(id: number) {
      return (await API.get(`/course/stats?id=${id}`)).data;
    },
    async createScheduled(scheduled: createScheduledDTO) {
      return (await API.post("/scheduled", scheduled)).data;
    },
    async finishScheduled(id: number) {
      return API.delete(`/scheduled?id=${id}`);
    },
    state: {
      today,
      overdue,
      recentlyCompleted,
      eventually,
    },
  };

  useEffect(() => {
    refreshToken();
  }, []);
  return (
    <APIContext.Provider value={endpoints}>
      {isAuthenticated ? props.children : <SignIn />}
    </APIContext.Provider>
  );
}
