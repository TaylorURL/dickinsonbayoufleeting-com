import { useEffect, useMemo, useState } from "react";
import "./styles/ScrollSpy.css";
import { HOME_SECTIONS } from "../app/constants/homeSections";

/* Right-rail section indicator for the home page.
 *
 * Two concerns intentionally kept separate:
 *   1. Active section — a single IntersectionObserver watches each
 *      section against a 1px line at the vertical centre of the
 *      viewport; the section currently overlapping that line is the
 *      active one. No scroll listener.
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

  const sections = useMemo(
    () =>
      HOME_SECTIONS.filter(
        (s) => typeof document === "undefined" || document.getElementById(s.id),
      ),
    [],
  );

  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      return undefined;
    }

    const targets = HOME_SECTIONS.map((s) =>
      document.getElementById(s.id),
    ).filter(Boolean);
    if (!targets.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const id = entry.target.id;
          setActiveId(id);
          const tone = entry.target
            .closest("[data-surface]")
            ?.getAttribute("data-surface");
          setSurface(tone === "light" ? "light" : "dark");
        }
      },
      {
        /* Collapse the root to a 1px line at viewport centre. Only the
         * section whose body crosses that line is reported intersecting,
         * so picking the active one is unambiguous. */
        rootMargin: "-50% 0px -50% 0px",
        threshold: 0,
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
    <nav className="scrollSpy" data-surface={surface} aria-label="On this page">
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
