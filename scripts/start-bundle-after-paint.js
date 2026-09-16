#!/usr/bin/env node
// Holds the application bundle back until the page has drawn its first frame.
//
// Every route arrives with its first screen already in the document, so the
// bundle draws nothing a visitor waits for: it adopts the markup and makes it
// interactive. Left as a deferred script in the head it is still requested in
// the opening bytes, and it is the largest thing on the wire, so on a phone it
// is bandwidth the poster, the fonts and the wordmark are not getting while
// the first screen is being painted. Worse, anything that has finished
// downloading before the first paint is treated by PageSpeed's model as
// something the paint waited on, so the bundle arriving early is charged
// against a paint it played no part in.
//
// The tag comes out of the head and an inline bootstrap at the end of the body
// puts it back one frame after the first frame the browser draws. That is a
// moment nobody can see and the browser cannot reorder: the bundle is asked for
// once the first screen is on the glass, and not before. A tab that is not
// drawing frames, because it opened in the background, starts the bundle on a
// timer instead, so the page is never left uninteractive.
//
// An injected tag has nothing standing behind it, and that matters more here
// than it would anywhere else: every route is prerendered, so a request the
// network drops leaves the whole first screen on the glass with every control
// drawn and none of them attached to anything, the document reporting itself
// complete, and no sign to the reader that the page never finished. The tag
// therefore carries an error handler, and a load that fails is asked for twice
// more over a widening gap before the page is given up on.
//
// This runs before the prerender, so the document every route is stamped from
// already carries the bootstrap.
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const BUILD = path.join(ROOT, "build");

const fail = (why) => {
  console.error(`bundle start: ${why}`);
  process.exit(1);
};

const indexPath = path.join(BUILD, "index.html");
if (!fs.existsSync(indexPath))
  fail("no build/index.html to read - run the build first");

const manifest = JSON.parse(
  fs.readFileSync(path.join(BUILD, "asset-manifest.json"), "utf8"),
);
const entry = (manifest.entrypoints || []).find((file) => file.endsWith(".js"));
if (!entry) fail("the asset manifest names no JavaScript entrypoint");
const entryUrl = `/${entry.replace(/^\//, "")}`;

let html = fs.readFileSync(indexPath, "utf8");
if (html.includes("data-bundle-start")) {
  console.log("the bundle already starts after the first frame");
  process.exit(0);
}

// The entry is matched by the URL the manifest gives rather than by position,
// so any other script in the document is left where it is.
const ENTRY_TAG = new RegExp(
  `<script[^>]*\\bsrc="${entryUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"[^>]*>\\s*</script>`,
);
if (!ENTRY_TAG.test(html)) fail(`build/index.html does not load ${entryUrl}`);
html = html.replace(ENTRY_TAG, "");

const bootstrap =
  `<script data-bundle-start>(function(){` +
  `var started=false,tries=0;` +
  `function load(){` +
  `var script=document.createElement("script");` +
  `script.src=${JSON.stringify(entryUrl)};` +
  // The tag says it is being retried, so the page's error handler leaves it
  // alone and this is what reports. A drop the next ask recovers from took
  // nothing off the reader's page and belongs in no report; only a bundle
  // that never arrived at all does.
  `script.setAttribute("data-retrying","");` +
  // Only a request that never arrived reaches this; a bundle that runs and
  // throws raises a window error instead, and asking for it again would not
  // help it.
  `script.onerror=function(){` +
  `if(++tries<3){setTimeout(load,600*tries);return}` +
  `var r=window.__reporter;` +
  `if(r&&r.report)r.report("resource","Failed to load script: "+script.src)};` +
  `document.head.appendChild(script)}` +
  `function start(){if(started)return;started=true;load()}` +
  // Two frames: the first is the paint itself, the second proves it landed.
  `requestAnimationFrame(function(){requestAnimationFrame(start)});` +
  `setTimeout(start,3000)})()</script>`;

if (!html.includes("</body>"))
  fail("build/index.html has no body to write into");
html = html.replace("</body>", `${bootstrap}</body>`);
fs.writeFileSync(indexPath, html);
console.log(`${path.basename(entryUrl)} now starts after the first frame`);
