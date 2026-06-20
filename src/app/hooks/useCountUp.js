import { useEffect, useRef, useState } from "react";

const DEFAULT_DURATION = 1200;

function easeOutExpo(t) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

/**
 * Animates a numeric value from 0 → target the first time the bound
 * element scrolls into view. Honours prefers-reduced-motion by jumping
 * straight to the target.
 *
 * @param {number} target
 * @param {{ duration?: number, decimals?: number }} [options]
 */
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

    if (reduced || !("IntersectionObserver" in window)) {
      setValue(target);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (startedRef.current) return;
        const entry = entries[0];
        if (!entry?.isIntersecting) return;
        startedRef.current = true;
        const start = performance.now();
        let raf = 0;
        const step = (now) => {
          const t = Math.min(1, (now - start) / duration);
          const v = easeOutExpo(t) * target;
          setValue(v);
          if (t < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
        observer.disconnect();
        return () => cancelAnimationFrame(raf);
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  const display =
    decimals > 0 ? value.toFixed(decimals) : Math.round(value).toString();
  return { ref, display, value };
}
