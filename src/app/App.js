import { useCallback, useEffect, useState } from "react";
import HomeView from "../views/HomeView";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import InquiryModal from "../components/InquiryModal";
import "./styles/App.css";
import "./styles/Buttons.css";

/* Sample point sits a couple of pixels below the nav so the surface
 * reading reflects whatever section the nav is actually overlapping. */
const NAV_SURFACE_PROBE_OFFSET = 4;

function readSurfaceUnderNav() {
  if (typeof document === "undefined") return "dark";
  const navHeight =
    parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue("--nav-height"),
    ) || 72;
  const probeY = navHeight + NAV_SURFACE_PROBE_OFFSET;
  const probeX = Math.min(window.innerWidth / 2, window.innerWidth - 1);
  const el = document.elementFromPoint(probeX, probeY);
  if (!el) return "dark";
  const host = el.closest("[data-surface]");
  return host?.getAttribute("data-surface") === "light" ? "light" : "dark";
}

function App() {
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [navSurface, setNavSurface] = useState("dark");

  /* The full-bleed hero owns the top of the page — the nav floats over
   * a dark cinematic plate until the user scrolls past it. */
  const [overHero, setOverHero] = useState(true);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "dark");
  }, []);

  useEffect(() => {
    const handler = () => setInquiryOpen(true);
    window.addEventListener("inquiry:open", handler);
    return () => window.removeEventListener("inquiry:open", handler);
  }, []);

  const recomputeSurface = useCallback(() => {
    const hero = document.getElementById("overview");
    const heroBottom = hero ? hero.getBoundingClientRect().bottom : 0;
    const navHeight =
      parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--nav-height",
        ),
      ) || 72;
    setOverHero(heroBottom > navHeight + NAV_SURFACE_PROBE_OFFSET);
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

  return (
    <div className="App">
      <NavBar surface={navSurface} overHero={overHero} />
      <HomeView />
      <Footer />
      <InquiryModal
        open={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
        onSubmit={() => {}}
      />
    </div>
  );
}

export default App;
