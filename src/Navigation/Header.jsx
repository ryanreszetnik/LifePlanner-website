import React from "react";
import Tab from "./Tab";
import "./header.css";
import { Button } from "@mui/material";
// import { Auth } from "aws-amplify";
import { useLocation } from "react-router-dom";

const pages = [
  { name: "Home", link: "/" },
  { name: "Calendar", link: "/calendar" },
  { name: "Schedule", link: "/schedule" },
  { name: "Preferences", link: "/preferences" },
  { name: "Privacy Policy", link: "/privacy" },
];

export default function Header() {
  const { pathname } = useLocation();
  const signOut = async () => {
    // await Auth.signOut();
  };
  return (
    <div
      // style={{
      //   width: "100%",
      //   backgroundColor: "#333",
      //   height: "30px",
      //   display: "flex",
      // }}
      className="header"
    >
      {pages.map((p) => (
        <Tab
          name={p.name}
          link={p.link}
          key={p.name}
          isSelected={pathname === p.link}
        />
      ))}
      <div
        style={{
          flexGrow: 1,
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <div
          style={{
            width: "max-content",
          }}
        >
          <Button onClick={signOut} variant="contained">
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}
