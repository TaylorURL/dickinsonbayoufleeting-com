import { useEffect, useMemo, useState } from "react";
import { HOME_SECTIONS } from "../../app/constants/homeSections";

// Collapses the observer root to a 1px line at viewport centre. Only the
// section whose body crosses that line reports as intersecting, so picking the
// active one is unambiguous.
const rootMargin = "-50% 0px -50% 0px";

// The tick is laid out at its longest and scaled down, so it extends on the
// compositor rather than reflowing the rail on every hover.
const RULE =
  "block h-px w-icon-sm flex-none origin-right bg-current transition-transform duration-settle ease-settle motion-reduce:transition-none";

const FADE =
  "opacity-0 transition-opacity duration-settle ease-settle group-hover/link:opacity-100 group-focus-visible/link:opacity-100 motion-reduce:transition-none";

// One IntersectionObserver against a 1px line at viewport centre decides the
// active section - no scroll listener, and no ambiguity about which section
// wins when several are on screen.
//
// Contrast rides the active section's [data-surface] through the normal theme
// cascade, so the rail stays legible crossing dark and paper bands.
//
// Hidden on narrow viewports: the navbar already covers navigation there and
// the rail would sit on top of content.
//
// `generation` is the shell's count of routes that have reached the page. The
// rail reads the document for its sections, and the route it belongs to arrives
// after the shell around it, so a rail that looked once at mount finds nothing
// and stays empty for the whole visit.
function ScrollSpy({ generation = 0 }) {
  const [activeId, setActiveId] = useState(HOME_SECTIONS[0].id);
  const [surface, setSurface] = useState("dark");

  const sections = useMemo(
    () =>
      HOME_SECTIONS.filter(
        (s) => typeof document === "undefined" || document.getElementById(s.id),
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [generation],
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
          setActiveId(entry.target.id);
          const tone = entry.target
            .closest("[data-surface]")
            ?.getAttribute("data-surface");
          setSurface(tone === "light" ? "light" : "dark");
        }
      },
      { rootMargin, threshold: 0 },
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [generation]);

  if (!sections.length) return null;

  return (
    <nav
      data-surface={surface}
      aria-label="On This Page"
      className="pointer-events-none fixed right-[clamp(20px,2.4vw,36px)] top-1/2 z-rail hidden -translate-y-1/2 bg-transparent font-body transition-colors duration-settle ease-settle rail:block"
    >
      <ol className="pointer-events-auto m-0 flex list-none flex-col gap-3 p-0">
        {sections.map((section, idx) => {
          const isActive = section.id === activeId;
          return (
            <li key={section.id} className="flex justify-end gap-0">
              <a
                href={`#${section.id}`}
                aria-current={isActive ? "true" : undefined}
                className={`group/link relative inline-flex flex-row-reverse items-center gap-2 py-1 no-underline transition-[color,background-color,border-color,transform,opacity] duration-settle ease-settle hover:text-primary focus-visible:text-primary focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-highlight ${
                  isActive ? "text-primary" : "text-faint"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`${RULE} ${
                    isActive
                      ? "scale-x-[1.85] text-highlight"
                      : "scale-x-[0.55] group-hover/link:scale-x-[0.8] group-focus-visible/link:scale-x-[0.8]"
                  }`}
                />
                <span
                  className={`text-micro font-semibold tabular-nums transition-colors duration-settle ease-settle ${
                    isActive ? "text-highlight" : "text-muted"
                  }`}
                >
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <span
                  className={`whitespace-nowrap text-micro font-medium text-current ${
                    isActive ? "opacity-100" : FADE
                  }`}
                >
                  {section.label}
                </span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default ScrollSpy;
