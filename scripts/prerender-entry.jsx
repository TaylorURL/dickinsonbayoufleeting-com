/**
 * What the prerender renders. Bundled for Node by scripts/prerender.js and
 * called once per route.
 *
 * It mounts the same App the browser mounts and hands it the path, because a
 * render with no address bar has no other way of knowing which page it is. So
 * whatever a route draws here is what the browser would have drawn for that
 * URL, which is the only reason React is able to adopt it instead of drawing it
 * again.
 *
 * prerenderToNodeStream waits for a route's own chunk to resolve before it
 * emits, which is why the markup is the page rather than the frame that stands
 * in for it.
 */
import { prerenderToNodeStream } from "react-dom/static";
import App from "../src/app/App";

// The route table rides along on the same bundle. The head each route carries
// is written in the application's own source, and this is the only way a Node
// script can read it without a second copy of the table living in the build.
export { ROUTES, NOT_FOUND_META } from "../src/app/router/routes";

// A boundary larger than this budget is streamed apart: the frame goes in the
// shell and the page follows it in a hidden div for a script at the end of the
// document to swap in. That is worth doing down a live connection and worth
// nothing in a file, where the whole document arrives at once and the swap only
// delays the first paint. The budget is lifted past any page rather than set to
// a number a page could grow past.
const NEVER_STREAM_SEPARATELY = Number.MAX_SAFE_INTEGER;

function read(stream) {
  return new Promise((resolve, reject) => {
    let html = "";
    stream.on("data", (chunk) => {
      html += chunk;
    });
    stream.on("end", () => resolve(html));
    stream.on("error", reject);
  });
}

/**
 * @param {string} route The path to render, as the browser would ask for it.
 * @returns {Promise<string>} The markup that belongs inside that route's #root.
 */
export async function renderRoute(route) {
  const errors = [];
  const { prelude } = await prerenderToNodeStream(<App path={route} />, {
    progressiveChunkSize: NEVER_STREAM_SEPARATELY,
    onError(error) {
      errors.push(error);
    },
  });
  const html = await read(prelude);
  if (errors.length) throw errors[0];
  return html;
}
