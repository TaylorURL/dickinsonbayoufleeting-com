import { useEffect } from "react";

const RIPPLE_LIFETIME_MS = 400;

// Draws a short ripple at the cursor on every left-button press, anywhere on
// the page. The layer is created once, sits above everything and never takes
// a click, so a section with `overflow: hidden` cannot clip the ripple and no
// control loses its own press feedback to it.
//
// No-op under prefers-reduced-motion, and re-checked on every press so a
// setting changed mid-visit takes effect without a reload.
export function useClickRipple() {
  useEffect(() => {
    if (typeof document === "undefined") return undefined;

    const layer = document.createElement("div");
    layer.className = "clickLayer";
    layer.setAttribute("aria-hidden", "true");
    document.body.appendChild(layer);

    const still = window.matchMedia?.("(prefers-reduced-motion: reduce)");

    const onPointerDown = (event) => {
      if (still?.matches || event.button !== 0) return;
      const ripple = document.createElement("span");
      ripple.className = "clickLayer__ripple";
      ripple.style.left = `${event.clientX}px`;
      ripple.style.top = `${event.clientY}px`;
      // animationend does not fire for a tab backgrounded mid-animation, so a
      // timer clears the node either way and the layer never accumulates.
      const sweep = window.setTimeout(
        () => ripple.remove(),
        RIPPLE_LIFETIME_MS,
      );
      ripple.addEventListener("animationend", () => {
        window.clearTimeout(sweep);
        ripple.remove();
      });
      layer.appendChild(ripple);
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      layer.remove();
    };
  }, []);
}
