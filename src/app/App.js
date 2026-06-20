import { useCallback, useEffect, useState } from "react";
import HomeView from "../views/HomeView";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import InquiryModal from "../components/InquiryModal";
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

  /* elementsFromPoint lets us skip the nav itself (it's z-index: 50
   * and would otherwise be returned first if the probe ever clipped
   * into it) and walk down to whatever section is actually behind it. */
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
