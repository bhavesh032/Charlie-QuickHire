import React from "react";
import ReactDOM from "react-dom/client";  // ✅ Correct way to import ReactDOM in React 18
import App from "./App";
import "./index.css";  // Ensure this file exists

const root = ReactDOM.createRoot(document.getElementById("root"));  
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
