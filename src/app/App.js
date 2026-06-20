import { useCallback, useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import InquiryModal from "../components/InquiryModal";
import HomeView from "../views/HomeView";
import ServicesView from "../views/ServicesView";
import AboutView from "../views/AboutView";
import ContactView from "../views/ContactView";
import { RouterProvider, useRouter, normalisePath } from "./router/Router";
import "./styles/App.css";
import "./styles/Buttons.css";

/* Sample point sits a few pixels below the rendered nav so the surface
 * reading reflects the section the nav is overlapping — never the nav
 * itself. The rendered height is taken live (not parsed from a clamp()
 * CSS token) so the probe stays correct across breakpoints. */
const NAV_SURFACE_PROBE_OFFSET = 6;

function readSurfaceUnderNav() {
  if (typeof document === "undefined") return "dark";
  const nav = document.querySelector(".nav");
  const navBottom = nav ? nav.getBoundingClientRect().bottom : 72;
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

function PageOutlet() {
  const { path } = useRouter();
  switch (normalisePath(path)) {
    case "/":
      return <HomeView />;
    case "/services":
      return <ServicesView />;
    case "/about":
      return <AboutView />;
    case "/contact":
      return <ContactView />;
    default:
      return <HomeView />;
  }
}

function AppShell() {
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [navSurface, setNavSurface] = useState("dark");
  const [overHero, setOverHero] = useState(true);
  const { path } = useRouter();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "dark");
  }, []);

  useEffect(() => {
    const handler = () => setInquiryOpen(true);
    window.addEventListener("inquiry:open", handler);
    return () => window.removeEventListener("inquiry:open", handler);
  }, []);

  const recomputeSurface = useCallback(() => {
    /* The dark hero only lives on the home route. Anywhere else, the
     * nav is never "over the hero" so it adopts whatever surface is
     * directly beneath it. */
    const hero = document.getElementById("overview");
    const nav = document.querySelector(".nav");
    const heroBottom = hero ? hero.getBoundingClientRect().bottom : 0;
    const navBottom = nav ? nav.getBoundingClientRect().bottom : 72;
    setOverHero(!!hero && heroBottom > navBottom + NAV_SURFACE_PROBE_OFFSET);
    setNavSurface(readSurfaceUnderNav());
  }, []);

  useEffect(() => {
    recomputeSurface();
    const onScroll = () => recomputeSurface();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", recomputeSurface);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", recomputeSurface);
    };
  }, [recomputeSurface]);

  /* Recompute surface when the route changes — the new page might mount
   * a different surface band directly under the nav. */
  useEffect(() => {
    /* Wait two animation frames to give layout a chance to settle. */
    let raf = requestAnimationFrame(() =>
      requestAnimationFrame(recomputeSurface),
    );
    return () => cancelAnimationFrame(raf);
  }, [path, recomputeSurface]);

  return (
    <div className="App">
      <NavBar surface={navSurface} overHero={overHero} />
      <PageOutlet />
      <Footer />
      <InquiryModal
        open={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
        onSubmit={() => {}}
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
