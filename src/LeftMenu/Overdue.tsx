import React, { Fragment, useState } from "react";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
import MenuItem from "./MenuItem";
import { Divider } from "@mui/material";

export default function Overdue({ open }: any) {
  const [overdue, setOverdue] = useState([""]);

  if (overdue.length === 0) {
    return <Fragment />;
  }
  return (
    <Fragment>
      <MenuItem open={open} text="Overdue" notificationNum={overdue.length}>
        <AccessAlarmIcon />
      </MenuItem>
      {open && <div>Hi</div>}
      <Divider />
    </Fragment>
  );
}
