import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

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
