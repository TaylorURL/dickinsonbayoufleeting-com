import { useEffect, useRef, useState } from "react";

// The band is called in before its first pixel lands, so the entrance has run
// by the time the reader is looking at it. Revealing on arrival means every
// band is caught mid-animation, which reads as the page still loading.
const DEFAULT_ROOT_MARGIN = "0px 0px 15% 0px";
const DEFAULT_OPTIONS = { threshold: 0, once: true };

// Reports whether an element has reached the viewport. The ref goes on the
// element, and `revealed` picks between the hidden and settled utility sets the
// caller holds.
//
// `revealed` starts true wherever a reveal cannot be observed - reduced motion,
// no IntersectionObserver, an element already on screen at mount - so the block
// carries its content rather than an empty box.
//
// options takes threshold and rootMargin as an IntersectionObserver does, plus
// once, which is true by default: a block that has arrived stays arrived.
export function useReveal(options) {
  const ref = useRef(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (reduced || !("IntersectionObserver" in window)) {
      setRevealed(true);
      return undefined;
    }

    // An element already above the fold at mount reveals straight away.
    // Otherwise the observer's first async tick leaves a perceptible flash of
    // hidden content.
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.95 && rect.bottom > 0) {
      setRevealed(true);
      return undefined;
    }

    const merged = { ...DEFAULT_OPTIONS, ...options };
    const rootMargin = merged.rootMargin ?? DEFAULT_ROOT_MARGIN;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRevealed(true);
            if (merged.once) observer.unobserve(entry.target);
          } else if (!merged.once) {
            setRevealed(false);
          }
        }
      },
      { threshold: merged.threshold, rootMargin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [options]);

  return { ref, revealed };
}
