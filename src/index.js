import React from "react";
import ReactDOM from "react-dom/client";
import "./app/styles/Theme.css";
import "./app/styles/index.css";
import App from "./app/App";
import { SundayAnalyticsProvider } from "./lib/sunday-analyzer";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <SundayAnalyticsProvider siteKey="sa_cbc757334609852911890bb51a781530">
    <App />
  </SundayAnalyticsProvider>
);
