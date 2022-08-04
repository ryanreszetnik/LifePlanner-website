import React, { Fragment, useState } from "react";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

import MenuItem from "./MenuItem";
import { Divider } from "@mui/material";

export default function RecentlyCompleted({ open }: any) {
  const [recentlyCompleted, setRecentlyCompleted] = useState([""]);
  if (recentlyCompleted.length === 0) {
    return <Fragment />;
  }
  return (
    <Fragment>
      <Divider />
      <MenuItem open={open} text="Recently Completed" notificationNum={0}>
        <CheckCircleOutlineIcon />
      </MenuItem>
      {open && <div>Hi</div>}
    </Fragment>
  );
}
