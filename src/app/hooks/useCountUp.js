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
      const step = (now) => {
        const t = Math.min(1, (now - start) / duration);
        const v = easeOutExpo(t) * target;
        setValue(v);
        if (t < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    };

    // Hero stats are typically above the fold — if so, start immediately
    // so the user never sees a stale 0. Otherwise defer until the row
    // scrolls into view.
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
  }, [target, duration]);

  const display =
    decimals > 0 ? value.toFixed(decimals) : Math.round(value).toString();
  return { ref, display, value };
}
