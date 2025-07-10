import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import {BrowserRouter } from "react-router-dom";
import Entry from "./Entry.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Entry/>
    </BrowserRouter>
  </StrictMode>
);
