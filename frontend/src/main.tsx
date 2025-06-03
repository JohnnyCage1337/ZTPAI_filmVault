import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import  Profile  from "./App"; // ← klamry!

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Profile />
  </StrictMode>
);
