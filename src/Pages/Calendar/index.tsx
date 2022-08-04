import React from "react";
import Calendar from "./Calendar/index";

export default function Home() {
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Calendar />
    </div>
  );
}
