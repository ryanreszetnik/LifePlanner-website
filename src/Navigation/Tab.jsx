import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Tab({ name, link, isSelected }) {
  const navigate = useNavigate();
  return (
    <div
      className={`tab-container ${isSelected ? "selected" : ""}`}
      onClick={() => navigate(link)}
    >
      <p className="tabLabel">{name}</p>
    </div>
  );
}
