import React from "react";
import TodayIcon from "@mui/icons-material/Today";
import { ListItem, ListItemIcon, ListItemText } from "@mui/material";

export default function MenuItem({
  open,
  text,
  notificationNum,
  ...props
}: any) {
  return (
    <ListItem
      sx={{
        minHeight: 48,
        justifyContent: open ? "initial" : "center",
        px: 2.5,
      }}
    >
      <ListItemIcon
        sx={{
          minWidth: 0,
          mr: open ? 3 : "auto",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {props.children}
        {!open && notificationNum > 0 && (
          <div
            style={{
              position: "absolute",
              top: -10,
              right: -10,
              backgroundColor: "#f55",
              borderRadius: "50%",
              borderColor: "white",
              borderWidth: "1px",
              borderStyle: "solid",
              width: 15,
              height: 15,
              textAlign: "center",
              fontSize: 12,
            }}
          >
            {notificationNum}
          </div>
        )}
      </ListItemIcon>
      <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
    </ListItem>
  );
}
