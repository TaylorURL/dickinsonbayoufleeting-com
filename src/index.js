import React from "react";
import ReactDOM from "react-dom/client";
import "./app/styles/fonts.css";
import "./app/styles/tailwind.css";
import App from "./app/App";

// The browser chrome takes the same ground the page does. A meta tag cannot
// read a custom property, so the value is written from the token once the
// stylesheet is in rather than typed a second time into the document, where it
// would be a colour no theme voted for the moment the palette moved. Until this
// runs, color-scheme carries the chrome.
function paintBrowserChrome() {
  const ground = getComputedStyle(document.documentElement)
    .getPropertyValue("--color-app-bg")
    .trim();
  if (!ground) return;
  let meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement("meta");
    meta.name = "theme-color";
    document.head.appendChild(meta);
  }
  meta.content = ground;
}

paintBrowserChrome();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
