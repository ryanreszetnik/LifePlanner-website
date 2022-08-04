import { useEffect, useState } from "react";
import { Router } from "react-router";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
// import {
//   ADD_TASK,
//   DELETE_TASK,
//   LOAD_COURSES,
//   LOAD_LINKS,
//   LOAD_TIMESLOTS,
//   SET_CALENDAR_EVENTS,
//   SET_COURSES,
//   SET_TASKS,
//   UNDO_DELETE_TASK,
//   UNDO_DELETE_SCHEDULED,
//   DELETE_SCHEDULED,
//   LOAD_NEW_SCHEDULED,
// } from "./Constants/reducerEvents";

import Home from "./Pages/Home";
import Calendar from "./Pages/Calendar";
import Preferences from "./Pages/Preferences";
import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import { ListItem } from "@mui/material";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
import TodayIcon from "@mui/icons-material/Today";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Header from "./Navigation/Header";

import moment from "moment";
import TaskPreview from "./Pages/Calendar/Calendar/TaskPreview";
// import DayCalendar from "./Components/DayCalendar";
import { Delete, UndoOutlined } from "@mui/icons-material";
import Schedule from "./Pages/Schedule";
import MenuToday from "./LeftMenu/MenuToday";
import Overdue from "./LeftMenu/Overdue";
import Eventually from "./LeftMenu/Eventually";
import RecentlyCompleted from "./LeftMenu/RecentlyCompleted";

const drawerWidth = 300;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function App() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);

  const toggleDrawer = () => {
    setOpen((o) => !o);
  };

  return (
    <BrowserRouter>
      <Box
        sx={{
          display: "flex",
          height: "100%",
        }}
      >
        <AppBar
          position="fixed"
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              edge="start"
              sx={{
                marginRight: 5,
              }}
            >
              <MenuIcon />
            </IconButton>
            <Header />
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          open={open}
          sx={{
            flexShrink: 0,
          }}
        >
          <Toolbar />
          <List>
            <Overdue open={open} />

            <Eventually open={open} />
            <Divider />
            <MenuToday open={open} />
            <RecentlyCompleted open={open} />
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            display: "flex",
            flexFlow: "column",
          }}
        >
          <div
            style={{
              paddingTop: "40px",
              flexGrow: 1,
              display: "flex",
              flexFlow: "column",
            }}
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="calendar" element={<Calendar />} />
              <Route path="schedule" element={<Schedule />} />
              <Route path="preferences" element={<Preferences />} />
            </Routes>
          </div>
        </Box>
      </Box>
    </BrowserRouter>
  );
}
