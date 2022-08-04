import React, { Fragment } from "react";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

import MenuItem from "./MenuItem";

export default function Eventually({ open }: any) {
  return (
    <Fragment>
      <MenuItem open={open} text="Eventually" notificationNum={4}>
        <HelpOutlineIcon />
      </MenuItem>
      {open && <div>Hi</div>}
    </Fragment>
  );
}
