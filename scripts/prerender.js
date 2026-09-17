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
 * The head is stamped with the same route's head, for the same reason the body
 * is. The application rewrites it on hydration, so a crawler that runs scripts
 * was always served the right title; one that does not - and robots.txt goes
 * out of its way to welcome several - was being served six pages that all
 * claimed to be the home page, with the home page's canonical on every one.
 *
 * Unknown paths keep the empty shell. They are answered with a 404 and the app
 * decides what to draw from the address, which is a page nobody measures and a
 * render this could only get wrong. Its head is stamped all the same, because
 * a miss that claims the home page's URL is a miss Google can index.
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

const ESCAPES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" };
const attr = (value) => String(value).replace(/[&<>"]/g, (c) => ESCAPES[c]);

// The head is rewritten by matching the tag that carries the key rather than
// by position, so the minifier is free to order attributes however it likes
// and a tag that moves in the source document still gets found.
function tagFor(selector, attribute) {
  return new RegExp(`<${selector}\\b[^>]*\\b${attribute}[^>]*>`, "i");
}

// The replacements are handed back from a function rather than as a string
// because a dollar sign in a title or a description is a substitution pattern
// to String.replace, and one of these carries a rate.
function replaceTag(html, pattern, tag) {
  if (tag == null) return html.replace(pattern, "");
  if (pattern.test(html)) return html.replace(pattern, () => tag);
  return html.replace("</head>", () => `${tag}</head>`);
}

function setMeta(html, kind, key, value) {
  const tag =
    value == null ? null : `<meta content="${attr(value)}" ${kind}="${key}"/>`;
  return replaceTag(html, tagFor("meta", `${kind}="${key}"`), tag);
}

function setCanonical(html, href) {
  const tag =
    href == null ? null : `<link href="${attr(href)}" rel="canonical"/>`;
  return replaceTag(html, tagFor("link", 'rel="canonical"'), tag);
}

// Title, description, canonical and the share tags, from the route's own head.
// The share tags take the title and the description rather than a pair of
// their own: nothing on this site says anything different to a share card than
// it says to a search result.
function stampHead(html, meta) {
  const title = `<title>${attr(meta.title)}</title>`;
  let out = html.replace(/<title>[\s\S]*?<\/title>/i, () => title);
  out = setMeta(out, "name", "description", meta.description);
  out = setMeta(out, "property", "og:title", meta.title);
  out = setMeta(out, "property", "og:description", meta.description);
  out = setMeta(out, "property", "og:url", meta.canonical);
  out = setMeta(out, "name", "twitter:title", meta.title);
  out = setMeta(out, "name", "twitter:description", meta.description);
  if (meta.robots) out = setMeta(out, "name", "robots", meta.robots);
  return setCanonical(out, meta.canonical);
}

async function main() {
  if (!fs.existsSync(INDEX)) fail("no build/index.html to render into");
  const shell = fs.readFileSync(INDEX, "utf8");
  if (!shell.includes(ROOT_DIV)) fail(`build/index.html has no ${ROOT_DIV}`);

  const outfile = path.join(BUILD, ".prerender-bundle.js");
  await bundle(outfile);

  let rendered = 0;
  try {
    const { renderRoute, ROUTES, NOT_FOUND_META } = require(outfile);
    // The public pages, taken from the table the application routes off. Each
    // one's first screen is decided by the source alone: no request, no
    // session, no state carried in from the page before it.
    for (const route of ROUTES) {
      const markup = await renderRoute(route.path);
      // A boundary that emitted its frame leaves the page in a hidden div for a
      // script at the end of the document to reveal. What the visitor paints in
      // that case is the frame, and the page cannot be a largest-paint
      // candidate until the whole document has been read.
      if (markup.includes('<template id="B:') || markup.includes("<!--$?-->")) {
        fail(
          `${route.path} rendered with an unresolved boundary, not its page`,
        );
      }
      // The shell draws the footer whether or not a route has arrived, so its
      // absence is the proof that the render emitted before the route's own
      // chunk resolved. Shipping that would put a loading frame in the document
      // for good.
      if (!markup.includes("<footer")) {
        fail(
          `${route.path} rendered without its page - the route chunk never came`,
        );
      }
      const root = `<div id="root">${markup}</div>`;
      const html = stampHead(
        shell.replace(ROOT_DIV, () => root),
        route.meta,
      );
      const file = documentFor(route.path);
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, html);
      rendered += 1;
      console.log(
        `prerendered ${route.path} into ${path.relative(BUILD, file)} (${bodyWords(html)} words)`,
      );
    }
    fs.writeFileSync(
      path.join(BUILD, NOT_FOUND_FILE),
      stampHead(shell, NOT_FOUND_META),
    );
  } finally {
    fs.rmSync(outfile, { force: true });
    fs.rmSync(`${outfile}.map`, { force: true });
  }

  console.log(
    `prerendered ${rendered} route(s); unknown paths keep the shell in ${NOT_FOUND_FILE}`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
