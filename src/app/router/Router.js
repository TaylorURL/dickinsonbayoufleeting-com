import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const RouterContext = createContext(null);

function readLocation() {
  if (typeof window === "undefined") {
    return { path: "/", hash: "" };
  }
  return { path: window.location.pathname, hash: window.location.hash };
}

export function RouterProvider({ children }) {
  const [{ path, hash }, setLocation] = useState(readLocation);

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
      /* Re-clicking the current location should still scroll to top or
       * to the anchor if one was supplied. */
      if (url.hash) {
        const el = document.getElementById(url.hash.slice(1));
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      } else if (scroll) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }

    const method = replace ? "replaceState" : "pushState";
    window.history[method]({}, "", url.pathname + url.search + url.hash);
    setLocation({ path: url.pathname, hash: url.hash });
    window.dispatchEvent(new Event("routerchange"));

    if (url.hash) {
      requestAnimationFrame(() => {
        const el = document.getElementById(url.hash.slice(1));
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    } else if (scroll && !samePath) {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, []);

  const value = useMemo(() => ({ path, hash, navigate }), [path, hash, navigate]);
  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function useRouter() {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error("useRouter must be used within RouterProvider");
  return ctx;
}

/* Normalise paths for comparison: strip trailing slash except root. */
export function normalisePath(p) {
  if (!p) return "/";
  if (p.length > 1 && p.endsWith("/")) return p.slice(0, -1);
  return p;
}
