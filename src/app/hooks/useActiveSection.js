import { useEffect, useState } from "react";

const DEFAULT_OBSERVER_OPTIONS = {
  root: null,
  threshold: [0.15, 0.3, 0.6],
  rootMargin: "-10% 0px -55% 0px",
};

/**
 * Tracks which of the given section ids is currently in view.
 *
 * While sections intersect the viewport, the most-visible one wins. When none
 * intersect (e.g. between sections), it falls back to whichever section sits
 * closest to the 25% viewport line.
 *
 * @param {string[]} ids - Section element ids to observe, in document order.
 * @param {IntersectionObserverInit} [observerOptions] - Overrides the defaults.
 * @returns {[string, (id: string) => void]} The active id and a manual setter.
 */
export function useActiveSection(ids, observerOptions) {
  const [active, setActive] = useState(ids[0] || "");

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    if (!("IntersectionObserver" in window) || elements.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      const mostVisible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (mostVisible) {
        setActive(mostVisible.target.id);
        return;
      }

      const closest = elements.reduce(
        (best, el) => {
          const delta = Math.abs(
            el.getBoundingClientRect().top - window.innerHeight * 0.25,
          );
          return delta < best.delta ? { id: el.id, delta } : best;
        },
        { id: elements[0].id, delta: Infinity },
      );
      setActive(closest.id);
    }, observerOptions || DEFAULT_OBSERVER_OPTIONS);

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids, observerOptions]);

  return [active, setActive];
}
