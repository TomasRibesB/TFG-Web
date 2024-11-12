import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import { TFGWeb } from "./TFGWeb";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <TFGWeb />
    </BrowserRouter>
  </StrictMode>
);
