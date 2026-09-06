import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const RouterContext = createContext(null);

function readLocation() {
  if (typeof window === "undefined") {
    return { path: "/", hash: "" };
  }
  return { path: window.location.pathname, hash: window.location.hash };
}

// How long an anchor is waited for before the reader is left at the top of the
// page instead. A route arrives as its own chunk, so the section a link names
// does not exist for the first few frames after the address changes.
const ANCHOR_WAIT_MS = 2000;

function stillness() {
  return !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

// Scroll to the section a link named, once that section is in the document.
//
// A route that came from another route mounts a chunk at a time, and the anchor
// is not there on the next frame. Looking once and giving up is what left a
// reader partway down the page they had just left: nothing scrolled, and then
// the arriving page grew under them and the browser held their old offset. So
// the top of the new page is taken first, which is both the right place to be
// while the chunk loads and a position the browser will not anchor away from,
// and the section is taken when it appears.
// Where the document has to sit for a section to be at the top of the viewport,
// under the header the anchor offset reserves. The offset is worked out rather
// than left to scrollIntoView, because a section that has not been rendered yet
// (content-visibility: auto) does not always scroll when it is asked to, and a
// number can be checked afterwards where a call cannot.
function anchorTarget(el) {
  const margin = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
  const furthest = Math.max(
    0,
    document.documentElement.scrollHeight - window.innerHeight,
  );
  const wanted = el.getBoundingClientRect().top + window.scrollY - margin;
  return Math.min(Math.max(0, wanted), furthest);
}

function scrollToAnchor(id, fromAnotherRoute) {
  // Already on the page the anchor is on: the section is mounted and the page
  // has stopped growing, so the reader gets the animation they would expect
  // from a link that only moves them down the page they are reading.
  if (!fromAnotherRoute) {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({
        top: anchorTarget(el),
        left: 0,
        behavior: stillness() ? "instant" : "smooth",
      });
    }
    return;
  }

  // Coming from another route the top of the new page is taken first. It is
  // where the reader belongs while the chunk loads, and it is a position the
  // browser will not anchor away from when the page grows.
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });

  // Then the section, once there is one. A route arrives a chunk at a time, so
  // the anchor is not in the document for the first few frames, and the page
  // keeps growing after it is, which moves the offset. Both are answered by
  // measuring again every frame and stopping once the document is where the
  // measurement says it should be and has stayed there.
  const deadline = performance.now() + ANCHOR_WAIT_MS;
  let holds = 0;
  const look = () => {
    const el = document.getElementById(id);
    if (el) {
      const target = anchorTarget(el);
      if (Math.abs(window.scrollY - target) > 1) {
        window.scrollTo({ top: target, left: 0, behavior: "instant" });
        holds = 0;
      } else if (++holds >= 2) {
        return;
      }
    }
    if (performance.now() < deadline) requestAnimationFrame(look);
  };
  requestAnimationFrame(look);
}

// The build renders every route into a document of its own, and the render has
// no address bar to read the path out of, so the path is handed in. In the
// browser nothing passes it and the location is read as it always was, which is
// the same path the document was stamped for.
export function RouterProvider({ children, path: initialPath }) {
  const [{ path, hash }, setLocation] = useState(() =>
    initialPath ? { path: initialPath, hash: "" } : readLocation(),
  );

  useEffect(() => {
    const onPop = () => setLocation(readLocation());
    window.addEventListener("popstate", onPop);
    window.addEventListener("routerchange", onPop);
    return () => {
      window.removeEventListener("popstate", onPop);
      window.removeEventListener("routerchange", onPop);
    };
  }, []);

  const navigate = useCallback((to, options = {}) => {
    const { replace = false, scroll = true } = options;
    const url = new URL(to, window.location.origin);
    const samePath = url.pathname === window.location.pathname;
    const sameHash = url.hash === window.location.hash;

    if (samePath && sameHash) {
      // Re-clicking the current location should still scroll to top or
      // to the anchor if one was supplied.
      if (url.hash) {
        const el = document.getElementById(url.hash.slice(1));
        if (el) {
          el.scrollIntoView({
            behavior: stillness() ? "instant" : "smooth",
            block: "start",
          });
        }
      } else if (scroll) {
        window.scrollTo({
          top: 0,
          behavior: stillness() ? "instant" : "smooth",
        });
      }
      return;
    }

    const method = replace ? "replaceState" : "pushState";
    window.history[method]({}, "", url.pathname + url.search + url.hash);
    setLocation({ path: url.pathname, hash: url.hash });
    window.dispatchEvent(new Event("routerchange"));

    if (url.hash) {
      scrollToAnchor(url.hash.slice(1), !samePath);
    } else if (scroll) {
      // Dropping the anchor is a move too: a reader on /contact#location who
      // asks for /contact is asking for the top of it.
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, []);

  const value = useMemo(
    () => ({ path, hash, navigate }),
    [path, hash, navigate],
  );
  return (
    <RouterContext.Provider value={value}>{children}</RouterContext.Provider>
  );
}

export function useRouter() {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error("useRouter must be used within RouterProvider");
  return ctx;
}

// Trailing slashes are stripped so "/about" and "/about/" compare equal.
export function normalisePath(p) {
  if (!p) return "/";
  if (p.length > 1 && p.endsWith("/")) return p.slice(0, -1);
  return p;
}
