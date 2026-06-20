import { useEffect, useRef } from "react";

const DEFAULT_OPTIONS = {
  threshold: 0.18,
  rootMargin: "0px 0px -10% 0px",
  once: true,
};

/**
 * Adds the `is-revealed` class to an element the first time it scrolls
 * into view. Pairs with the `.reveal-on-scroll` CSS class — when an
 * element has it, it sits hidden until the class flips, then fades and
 * rises into place. Honours prefers-reduced-motion by setting it on
 * mount without animation.
 *
 * @param {object} [options]
 * @returns {React.MutableRefObject<HTMLElement | null>}
 */
export function useReveal(options) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (reduced || !("IntersectionObserver" in window)) {
      el.classList.add("is-revealed");
      return;
    }

    const merged = { ...DEFAULT_OPTIONS, ...options };
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            if (merged.once) observer.unobserve(entry.target);
          } else if (!merged.once) {
            entry.target.classList.remove("is-revealed");
          }
        }
      },
      { threshold: merged.threshold, rootMargin: merged.rootMargin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [options]);

  return ref;
}
