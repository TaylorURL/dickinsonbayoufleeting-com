import { useEffect, useMemo, useRef, useState } from "react";
import "./styles/ScrollSpy.css";
import { HOME_SECTIONS } from "../app/constants/homeSections";

/* Right-rail section indicator for the home page.
 *
 * Two concerns intentionally kept separate:
 *   1. Active section — IntersectionObserver picks the section whose
 *      midpoint sits closest to the viewport centre. One observer, no
 *      scroll listener.
 *   2. Adaptive contrast — the active section's [data-surface] value
 *      ("dark" | "light") drives the rail's tokens via the same theme
 *      cascade the page already uses, so the rail flips legibility as
 *      the user scrolls between dark and paper bands.
 *
 * Hidden on narrow viewports — the rail would crowd content on phones
 * and tablets, and the navbar still provides primary navigation. */
function ScrollSpy() {
  const [activeId, setActiveId] = useState(HOME_SECTIONS[0].id);
  const [surface, setSurface] = useState("dark");
  const ratiosRef = useRef(new Map());

  const sections = useMemo(
    () => HOME_SECTIONS.filter((s) => typeof document === "undefined" || document.getElementById(s.id)),
    [],
  );

  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      return undefined;
    }

    const targets = HOME_SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean);
    if (!targets.length) return undefined;

    const ratios = ratiosRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.set(entry.target.id, entry.intersectionRatio);
        }
        let bestId = null;
        let bestRatio = 0;
        for (const [id, ratio] of ratios.entries()) {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        }
        if (bestId && bestRatio > 0) {
          setActiveId(bestId);
          const host = document.getElementById(bestId);
          const tone = host?.closest("[data-surface]")?.getAttribute("data-surface");
          setSurface(tone === "light" ? "light" : "dark");
        }
      },
      {
        /* Centre band of the viewport — the rail floats here. Whichever
         * section overlaps it most is the one the rail is "in". */
        rootMargin: "-40% 0px -40% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleJump = (id) => (e) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (!sections.length) return null;

  return (
    <nav
      className="scrollSpy"
      data-surface={surface}
      aria-label="On this page"
    >
      <ol className="scrollSpy__list">
        {sections.map((section, idx) => {
          const isActive = section.id === activeId;
          return (
            <li
              key={section.id}
              className={`scrollSpy__item${isActive ? " scrollSpy__item--active" : ""}`}
            >
              <a
                href={`#${section.id}`}
                onClick={handleJump(section.id)}
                className="scrollSpy__link"
                aria-current={isActive ? "true" : undefined}
              >
                <span className="scrollSpy__tick" aria-hidden="true" />
                <span className="scrollSpy__index mono">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <span className="scrollSpy__label mono">{section.label}</span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default ScrollSpy;
