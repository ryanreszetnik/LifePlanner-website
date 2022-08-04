import React, { Fragment, useContext, useState } from "react";
import TodayIcon from "@mui/icons-material/Today";
import MenuItem from "./MenuItem";
import { APIContext } from "../Auth";
import TaskPreview from "../Pages/Calendar/Calendar/TaskPreview";
import ScheduledPreview from "../Pages/Calendar/Calendar/ScheduledPreview";

export default function MenuToday({ open }) {
  const todayTasks = useContext(APIContext)?.state.today || [];
  return (
    <Fragment>
      <MenuItem open={open} text="Today" notificationNum={todayTasks.length}>
        <TodayIcon />
      </MenuItem>
      {open &&
        (todayTasks?.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              paddingBottom: "15px",
              fontSize: "14px",
              fontWeight: "bold",
            }}
          >
            No Tasks Today
          </div>
        ) : (
          <div>
            {todayTasks.map((task) => {
              if (task?.isScheduled) {
                return (
                  <ScheduledPreview
                    scheduled={task}
                    left={true}
                    right={true}
                    onFinish={() => {
                      console.log("finish");
                    }}
                    onClick={(e) => {
                      console.log(e);
                      e.stopPropagation();
                    }}
                  />
                );
              }
              return <TaskPreview task={task} left right />;
            })}
          </div>
        ))}
    </Fragment>
  );
}
