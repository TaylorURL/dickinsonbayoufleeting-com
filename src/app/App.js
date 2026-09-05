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
import SiteSearch from "../components/SiteSearch";
import ScrollSpy from "../components/ScrollSpy";
import RouteFallback from "../components/RouteFallback";
import RouteBoundary, {
  clearChunkReloadFlag,
} from "../components/RouteBoundary";
import HomeView from "../views/HomeView";
import { RouterProvider, useRouter, normalisePath } from "./router/Router";
import { findRoute } from "./router/routes";
import { MAIN_ID } from "./constants/landmarks";
import { submitInquiry } from "./constants/inquiryForm";
import { PHONE_NUMBER } from "./constants/phoneNumber";
import { PhoneIcon } from "../components/Icons";
import { useClickRipple } from "./hooks/useClickRipple";
import { useSearchShortcut } from "./hooks/useSearchShortcut";

// A visitor to any one route downloads that route and no other. The shell —
// bar, footer and inquiry panel — is in the entry because every route shows it.
//
// Home is the exception, and it is in the entry too. A split route is not on
// the page until a second file has been asked for, fetched and run, and the
// browser cannot even ask until the entry has been read, so the one route
// almost everybody arrives on paid a whole round trip to show a placeholder
// before it showed itself. It is the smallest of the six, and carrying it
// costs the other five a few kilobytes they download once.
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
  const nav = document.querySelector("[data-nav]");
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
  const hasActions = Boolean(findRoute(normalisePath(path)).actions);

  // Whether the reader has asked for a page yet, which decides how the page
  // under this comes in.
  //
  // The entrance holds a route at nothing for six delay steps before bringing
  // it up. That hold is the length of a cached chunk's arrival and it is what
  // stops a fast route flashing its placeholder on the way past. The route the
  // document was stamped for has no chunk coming: its markup is in the file
  // the reader was served, so the hold is spent on a page that is already
  // drawn, and everything in it - the plate, the headline, the lede - is
  // withheld from the screen while a round trip that never happens is waited
  // out. It comes up on the same fade over the same length instead, starting
  // as soon as the stylesheet has been read.
  //
  // The build renders every route from the path the browser opens on, so the
  // served markup and the first client render agree here and hydration has
  // nothing to reconcile.
  const openedOn = useRef(path);
  const navigated = useRef(false);
  if (path !== openedOn.current) navigated.current = true;
  const entrance = navigated.current ? "animate-arrive" : "animate-arrive-now";

  return (
    <RouteBoundary path={path}>
      <Suspense fallback={<RouteFallback actions={hasActions} />}>
        {/* The page that replaces the placeholder arrives on the same entrance
            the placeholder itself came in on, keyed to the route so it plays
            once per landing rather than once per session. A route that simply
            appears is the one moment the whole site is otherwise animated
            through. */}
        <div key={path} className={`${entrance} motion-reduce:animate-none`}>
          <View />
        </div>
        <RouteLanded path={path} onLanded={onLanded} />
      </Suspense>
    </RouteBoundary>
  );
}

function AppShell() {
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [navSurface, setNavSurface] = useState("dark");
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
  useSearchShortcut(() => setSearchOpen(true));

  // The browser chrome takes its colour from the theme rather than from a
  // literal in the document head, so the two cannot drift apart.
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", "dark");
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
      const nav = document.querySelector("[data-nav]");
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

  // The shell exists to hang the bar, the outlet and the footer off. It sets
  // no type, no colour and no alignment - every band decides those for itself.
  //
  // The skip link is off screen until it is tabbed to, which is the only time
  // it is wanted. It lands over the bar rather than under it, because the bar
  // is what it exists to get past.
  return (
    <div className="isolate">
      <a
        href={`#${MAIN_ID}`}
        className="fixed left-3 top-3 z-modal inline-flex min-h-control-sm -translate-y-[calc(100%+theme(spacing.6))] items-center rounded-sm bg-highlight px-5 font-body text-sm font-medium text-on-highlight no-underline transition-[transform,opacity] duration-quick ease-settle hover:bg-highlight-hover focus-visible:translate-y-0 focus-visible:shadow-focus focus-visible:outline-none motion-reduce:transition-none"
      >
        Skip to Main Content
      </a>
      <NavBar surface={navSurface} onSearch={() => setSearchOpen(true)} />
      <PageOutlet onLanded={onRouteLanded} />
      {isHome ? <ScrollSpy generation={landings} /> : null}
      <Footer>
        <SplitRail />
      </Footer>

      {/* The phone is the thing this trade reaches for, and on a handset the bar is at
          the far end of a thumb's reach. The one filled action on a small
          screen sits on the bottom edge instead, clear of the device inset. The
          shell reserves its height below the footer, so it never covers the end
          of the page. */}
      <a
        href={`tel:1${PHONE_NUMBER.replace(/[^0-9]/g, "")}`}
        className="fixed inset-x-0 bottom-0 z-rail inline-flex min-h-control select-none items-center justify-center gap-3 bg-highlight px-5 pb-[env(safe-area-inset-bottom)] font-body text-sm font-medium text-on-highlight no-underline transition-colors duration-quick ease-settle hover:bg-highlight-hover focus-visible:shadow-focus focus-visible:outline-none active:bg-highlight-hover md:hidden"
      >
        <PhoneIcon size={14} className="flex-none" />
        <span className="tabular-nums">Call the Yard · {PHONE_NUMBER}</span>
      </a>
      <SiteSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
      <InquiryModal
        open={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
        onSubmit={submitInquiry}
      />
    </div>
  );
}

// The build stamps each route into a document of its own and hands the path in,
// because there is no address bar at that point. The browser passes nothing and
// the router reads the location itself.
function App({ path }) {
  return (
    <RouterProvider path={path}>
      <AppShell />
    </RouterProvider>
  );
}

export default App;
