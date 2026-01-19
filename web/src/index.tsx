import React from "react";
import { createRoot } from "react-dom/client";
import App from "./app";
import { HashRouter } from "react-router-dom";

const container = document.getElementById("app");
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);