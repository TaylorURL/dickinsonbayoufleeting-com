import { useEffect, useRef, useState } from "react";

const DEFAULT_DURATION = 1200;

function easeOutExpo(t) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

// Counts a figure up from zero to target the first time the element the
// returned ref is bound to reaches the viewport, and only that first time.
// Under prefers-reduced-motion the figure is at its target from the start.
//
// duration is in milliseconds; decimals is how many places the running value
// keeps, which matters for a figure whose target is not whole. The ref goes on
// the element that carries the figure, because that element's arrival is what
// starts the count.
export function useCountUp(target, options = {}) {
  const { duration = DEFAULT_DURATION, decimals = 0 } = options;
  const ref = useRef(null);
  const [value, setValue] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      setValue(target);
      return;
    }

    let raf = 0;
    const animate = () => {
      if (startedRef.current) return;
      startedRef.current = true;
      const start = performance.now();
      // Sixty frames a second of eased float would be sixty renders to show a
      // number that only ever takes eleven values. The frame still runs on
      // every tick; the state moves only when what is on screen would change.
      const round = (v) => Number(v.toFixed(decimals));
      let shown = 0;
      const step = (now) => {
        const t = Math.min(1, (now - start) / duration);
        const next = round(easeOutExpo(t) * target);
        if (next !== shown) {
          shown = next;
          setValue(next);
        }
        if (t < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    };

    // An element already on screen at mount has no arrival to wait for, so the
    // count starts at once rather than holding the figure at zero under a reader
    // who is already looking at it. A browser with no observer counts straight
    // away for the same reason.
    const rect = el.getBoundingClientRect();
    const alreadyVisible = rect.top < window.innerHeight && rect.bottom > 0;
    if (alreadyVisible || !("IntersectionObserver" in window)) {
      animate();
      return () => cancelAnimationFrame(raf);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting) return;
        animate();
        observer.disconnect();
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [target, duration, decimals]);

  const display =
    decimals > 0 ? value.toFixed(decimals) : Math.round(value).toString();
  return { ref, display, value };
}
