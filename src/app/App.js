import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import SplitRail from "@taylorurl/split-rail";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import InquiryModal from "../components/InquiryModal";
import ScrollSpy from "../components/ScrollSpy";
import RouteFallback from "../components/RouteFallback";
import RouteBoundary, {
  clearChunkReloadFlag,
} from "../components/RouteBoundary";
import { RouterProvider, useRouter, normalisePath } from "./router/Router";
import { MAIN_ID } from "./constants/landmarks";
import { submitInquiry } from "./constants/inquiryForm";
import { useClickRipple } from "./hooks/useClickRipple";
import "./styles/App.css";
import "./styles/Buttons.css";

// A visitor to any one route downloads that route and no other. The shell —
// bar, footer and inquiry panel — is in the entry because every route shows it.
const HomeView = lazy(() => import("../views/HomeView"));
const ServicesView = lazy(() => import("../views/ServicesView"));
const AboutView = lazy(() => import("../views/AboutView"));
const ContactView = lazy(() => import("../views/ContactView"));
const PrivacyView = lazy(() => import("../views/PrivacyView"));
const TermsView = lazy(() => import("../views/TermsView"));
const NotFound = lazy(() => import("../pages/NotFound"));

// Sample point sits a few pixels below the rendered nav so the surface
// reading reflects the section the nav is overlapping — never the nav
// itself. The rendered height is taken live (not parsed from a clamp()
// CSS token) so the probe stays correct across breakpoints.
const NAV_SURFACE_PROBE_OFFSET = 6;

// Used only before the bar has been laid out, which is the one moment its
// measured height is not available.
const NAV_HEIGHT_FALLBACK = 72;

function readSurfaceUnderNav() {
  if (typeof document === "undefined") return "dark";
  const nav = document.querySelector(".nav");
  const navBottom = nav
    ? nav.getBoundingClientRect().bottom
    : NAV_HEIGHT_FALLBACK;
  const probeY = Math.max(0, navBottom + NAV_SURFACE_PROBE_OFFSET);
  const probeX = Math.min(window.innerWidth / 2, window.innerWidth - 1);

  const stack = document.elementsFromPoint?.(probeX, probeY) ?? [
    document.elementFromPoint(probeX, probeY),
  ];
  for (const el of stack) {
    if (!el) continue;
    if (nav && (el === nav || nav.contains(el))) continue;
    const host = el.closest("[data-surface]");
    if (!host) continue;
    return host.getAttribute("data-surface") === "light" ? "light" : "dark";
  }
  return "dark";
}

function viewFor(path) {
  switch (path) {
    case "/":
      return HomeView;
    case "/services":
      return ServicesView;
    case "/about":
      return AboutView;
    case "/contact":
      return ContactView;
    case "/privacy":
      return PrivacyView;
    case "/terms":
      return TermsView;
    default:
      return NotFound;
  }
}

// Mounts alongside the resolved view rather than beside the placeholder, so
// firing it is the shell's signal that the route's markup is on the page. The
// shell needs that: a route whose chunk is still in flight has no bands for
// the bar to read and no main element for focus to land on.
//
// Asking the document whether the page has landed does not work, because a
// boundary that suspends a second time keeps the outgoing route mounted and
// hidden. The old main is still findable at that moment, and focusing a
// hidden element drops focus on the body.
function RouteLanded({ path, onLanded }) {
  useEffect(() => {
    onLanded(path);
  }, [path, onLanded]);
  return null;
}

function PageOutlet({ onLanded }) {
  const { path } = useRouter();
  const View = viewFor(normalisePath(path));
  return (
    <RouteBoundary path={path}>
      <Suspense fallback={<RouteFallback />}>
        <View />
        <RouteLanded path={path} onLanded={onLanded} />
      </Suspense>
    </RouteBoundary>
  );
}

function AppShell() {
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [navSurface, setNavSurface] = useState("dark");
  const [overHero, setOverHero] = useState(true);
  // Bumped each time a route's markup reaches the page. Everything that has to
  // measure the page reads this rather than the path, because the path changes
  // when the reader clicks and the markup arrives when its chunk does.
  const [landings, setLandings] = useState(0);
  const { path } = useRouter();

  // A route change replaces everything under the bar. Without moving the mark
  // the reader on a screen reader or a keyboard is left wherever the last link
  // was, on a page that no longer contains it. Arriving is not a change, so
  // the path the page opened on is recorded as already handled.
  const focusedPath = useRef(path);

  const onRouteLanded = useCallback((landedPath) => {
    // A route that loads is the proof the tab is on the current build again.
    clearChunkReloadFlag();
    setLandings((n) => n + 1);
    if (focusedPath.current === landedPath) return;
    focusedPath.current = landedPath;
    const main = document.getElementById(MAIN_ID);
    if (main) main.focus({ preventScroll: true });
  }, []);

  useClickRipple();

  // The browser chrome takes its colour from the theme rather than from a
  // literal in the document head, so the two cannot drift apart.
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", "dark");
    // Scroll reveals hide their block until an observer flips it back. Only
    // arm that where an observer exists, so a page rendered without scrolling
    // shows its words rather than an empty band.
    if ("IntersectionObserver" in window)
      root.setAttribute("data-reveal", "on");
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute(
        "content",
        getComputedStyle(root).getPropertyValue("--color-app-bg").trim(),
      );
    }
  }, []);

  useEffect(() => {
    const handler = () => setInquiryOpen(true);
    window.addEventListener("inquiry:open", handler);
    return () => window.removeEventListener("inquiry:open", handler);
  }, []);

  const recomputeSurface = useCallback(() => {
    // The dark hero only lives on the home route. Anywhere else, the
    // nav is never "over the hero" so it adopts whatever surface is
    // directly beneath it.
    const hero = document.getElementById("overview");
    const nav = document.querySelector(".nav");
    const heroBottom = hero ? hero.getBoundingClientRect().bottom : 0;
    const navBottom = nav
      ? nav.getBoundingClientRect().bottom
      : NAV_HEIGHT_FALLBACK;
    setOverHero(!!hero && heroBottom > navBottom + NAV_SURFACE_PROBE_OFFSET);
    setNavSurface(readSurfaceUnderNav());
  }, []);

  // Which band the nav is over changes only when a band edge crosses the probe
  // line, so that is what gets watched: a one-pixel observer window pinned to
  // the nav's lower edge, with every surface section reporting into it. The
  // effect is keyed on the landing because a new page mounts new bands.
  useEffect(() => {
    recomputeSurface();
    if (typeof IntersectionObserver === "undefined") return undefined;

    let observer = null;
    const attach = () => {
      observer?.disconnect();
      const nav = document.querySelector(".nav");
      const line =
        (nav ? nav.getBoundingClientRect().bottom : NAV_HEIGHT_FALLBACK) +
        NAV_SURFACE_PROBE_OFFSET;
      const below = Math.max(0, window.innerHeight - line - 1);
      const init = { threshold: 0 };
      init.rootMargin = [-line, 0, -below, 0]
        .map((edge) => Math.round(edge) + "px")
        .join(" ");
      observer = new IntersectionObserver(() => recomputeSurface(), init);
      document
        .querySelectorAll("[data-surface], #overview")
        .forEach((band) => observer.observe(band));
      recomputeSurface();
    };

    attach();
    window.addEventListener("resize", attach);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", attach);
    };
  }, [landings, recomputeSurface]);

  const isHome = normalisePath(path) === "/";

  return (
    <div className="App">
      <a className="skipLink" href={`#${MAIN_ID}`}>
        Skip to Main Content
      </a>
      <NavBar surface={navSurface} overHero={overHero} />
      <PageOutlet onLanded={onRouteLanded} />
      {isHome ? <ScrollSpy generation={landings} /> : null}
      <Footer>
        <SplitRail />
      </Footer>
      <InquiryModal
        open={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
        onSubmit={submitInquiry}
      />
    </div>
  );
}

function App() {
  return (
    <RouterProvider>
      <AppShell />
    </RouterProvider>
  );
}

export default App;
