import { useEffect, useRef } from "react";

// Holds the reveal back until a block is a little way into the viewport, so
// it arrives as the reader reaches it rather than at the moment its first
// pixel appears.
const DEFAULT_ROOT_MARGIN = "0px 0px -10% 0px";
const DEFAULT_OPTIONS = { threshold: 0.18, once: true };

// Adds `is-revealed` to an element the first time it reaches the viewport.
// The element carries `.reveal-on-scroll` or `.reveal-stagger`, which hold it
// hidden until the class lands and then bring it up; under
// prefers-reduced-motion the class is set on mount and nothing animates.
//
// options takes threshold and rootMargin as an IntersectionObserver does, plus
// once, which is true by default: a block that has arrived stays arrived. The
// returned ref goes on the element to reveal.
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

    // If the element is already above-the-fold at mount, reveal it
    // straight away — otherwise the IntersectionObserver's first async
    // tick leaves a perceptible flash of hidden content.
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.95 && rect.bottom > 0) {
      el.classList.add("is-revealed");
      return;
    }

    const merged = { ...DEFAULT_OPTIONS, ...options };
    const rootMargin = merged.rootMargin ?? DEFAULT_ROOT_MARGIN;
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
      { threshold: merged.threshold, rootMargin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [options]);

  return ref;
}
