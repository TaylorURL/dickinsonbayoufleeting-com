#!/usr/bin/env node
/**
 * Writes the first screen into the document, one file per route.
 *
 * A build that renders in the browser ships a document with an empty root, so
 * nothing is on the glass until the bundle has been fetched, parsed, run and
 * rendered. That whole chain sits in front of the largest paint, and on a phone
 * it is over a second of a page with nothing in it - the bar, the hero and the
 * call bar at the foot of the screen all wait on the same file. This runs the
 * same components at build time and puts their markup in the file the visitor
 * is served, so the page is drawn from the first response and React adopts it.
 *
 * Every public route gets a document of its own, because a document carrying
 * one route's markup served at another route's URL would paint the wrong page
 * and then swap it. vercel.json points each path at its own file.
 *
 * Unknown paths keep the empty shell. They are answered with a 404 and the app
 * decides what to draw from the address, which is a page nobody measures and a
 * render this could only get wrong.
 *
 * Node cannot run the source as it stands: the route chunks are import() calls
 * webpack compiles into browser-only chunk loads. So esbuild bundles a Node
 * copy first, sharing React with react-dom/static so the two see one set of
 * hooks between them.
 */
const fs = require("fs");
const path = require("path");
const esbuild = require("esbuild");

const ROOT = path.join(__dirname, "..");
const BUILD = path.join(ROOT, "build");
const INDEX = path.join(BUILD, "index.html");
const ROOT_DIV = '<div id="root"></div>';

// The public pages. Each one's first screen is decided by the source alone: no
// request, no session, no state carried in from the page before it.
const RENDERED = ["/", "/services", "/about", "/contact", "/privacy", "/terms"];

// What an unmatched path is answered with, and the file vercel.json names for
// the 404 rewrite.
const NOT_FOUND_FILE = "404.html";

function fail(why) {
  console.error(`prerender: ${why}`);
  process.exit(1);
}

async function bundle(outfile) {
  await esbuild.build({
    entryPoints: [path.join(__dirname, "prerender-entry.jsx")],
    outfile,
    bundle: true,
    platform: "node",
    format: "cjs",
    target: "node22",
    jsx: "automatic",
    logLevel: "silent",
    // React resolves from node_modules so this bundle and react-dom/static
    // share one copy of it. Two would not see each other's hooks.
    external: ["react", "react/jsx-runtime", "react-dom", "react-dom/*"],
    loader: {
      ".js": "jsx",
      ".jsx": "jsx",
      // The stylesheet is built and linked in the document already; this render
      // only needs the markup.
      ".css": "empty",
      ".woff": "empty",
      ".woff2": "empty",
    },
    define: { "process.env.NODE_ENV": '"production"' },
  });
}

function documentFor(route) {
  if (route === "/") return INDEX;
  return path.join(BUILD, route.replace(/^\//, ""), "index.html");
}

/** What a reader would find in the body, which is the whole point of the file. */
function bodyWords(html) {
  const body = html.slice(html.indexOf("<body"));
  const text = body
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;/g, " ");
  return text.split(/\s+/).filter(Boolean).length;
}

async function main() {
  if (!fs.existsSync(INDEX)) fail("no build/index.html to render into");
  const shell = fs.readFileSync(INDEX, "utf8");
  if (!shell.includes(ROOT_DIV)) fail(`build/index.html has no ${ROOT_DIV}`);

  const outfile = path.join(BUILD, ".prerender-bundle.js");
  await bundle(outfile);

  try {
    const { renderRoute } = require(outfile);
    for (const route of RENDERED) {
      const markup = await renderRoute(route);
      // A boundary that emitted its frame leaves the page in a hidden div for a
      // script at the end of the document to reveal. What the visitor paints in
      // that case is the frame, and the page cannot be a largest-paint
      // candidate until the whole document has been read.
      if (markup.includes('<template id="B:') || markup.includes("<!--$?-->")) {
        fail(`${route} rendered with an unresolved boundary, not its page`);
      }
      // The shell draws the footer whether or not a route has arrived, so its
      // absence is the proof that the render emitted before the route's own
      // chunk resolved. Shipping that would put a loading frame in the document
      // for good.
      if (!markup.includes("<footer")) {
        fail(`${route} rendered without its page - the route chunk never came`);
      }
      const html = shell.replace(ROOT_DIV, `<div id="root">${markup}</div>`);
      const file = documentFor(route);
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, html);
      console.log(
        `prerendered ${route} into ${path.relative(BUILD, file)} (${bodyWords(html)} words)`,
      );
    }
  } finally {
    fs.rmSync(outfile, { force: true });
    fs.rmSync(`${outfile}.map`, { force: true });
  }

  fs.writeFileSync(path.join(BUILD, NOT_FOUND_FILE), shell);
  console.log(
    `prerendered ${RENDERED.length} route(s); unknown paths keep the shell in ${NOT_FOUND_FILE}`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
