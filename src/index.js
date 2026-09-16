import ReactDOM from "react-dom/client";
import "./app/styles/fonts.css";
import "./app/styles/tailwind.css";
import App from "./app/App";
import { initGoogleTracking } from "./app/tracking/google";

// Ahead of the render, because the click identifier an ad arrives with is read
// from the address bar and the router rewrites it on the first navigation.
initGoogleTracking();

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

const container = document.getElementById("root");

// The build writes each route's first screen into the document it serves, so
// the page is on the glass before this file has been fetched. React adopts that
// markup rather than drawing it a second time. The development server sends the
// empty shell, so both paths have to work.
if (container.firstElementChild) {
  ReactDOM.hydrateRoot(container, <App />);
} else {
  ReactDOM.createRoot(container).render(<App />);
}
