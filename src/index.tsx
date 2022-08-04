import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Authentication from "./Auth";
import "./index.css";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TaskDraggingPreview } from "./Pages/Calendar/Calendar/TaskDraggingPreview";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <Authentication>
    <DndProvider backend={HTML5Backend}>
      <TaskDraggingPreview />
      <App />
    </DndProvider>
  </Authentication>
);
