import { useEffect } from "react";

const RIPPLE_LIFETIME_MS = 400;

// Draws a short ripple at the cursor on every left-button press, anywhere on
// the page. The layer is created once, sits above everything and never takes
// a click, so a section with `overflow: hidden` cannot clip the ripple and no
// control loses its own press feedback to it.
//
// The mark is coloured from the band it lands on rather than from the layer it
// lives in. The layer hangs off the body, which carries the document's theme,
// and with no hue in the palette that meant a near-white ring drawn on the
// near-white bands that make up most of the page: present, measurable, and
// invisible. Reading the surface under the cursor is what makes the press
// register on every band instead of only the dark ones.
//
// No-op under prefers-reduced-motion, and re-checked on every press so a
// setting changed mid-visit takes effect without a reload.
export function useClickRipple() {
  useEffect(() => {
    if (typeof document === "undefined") return undefined;

    const layer = document.createElement("div");
    layer.className =
      "fixed inset-0 z-pointer pointer-events-none [contain:strict]";
    layer.setAttribute("aria-hidden", "true");
    document.body.appendChild(layer);

    const still = window.matchMedia?.("(prefers-reduced-motion: reduce)");

    const inkUnder = (x, y) => {
      const band = document
        .elementFromPoint(x, y)
        ?.closest("[data-surface],[data-theme]");
      if (!band) return null;
      const ink = getComputedStyle(band)
        .getPropertyValue("--color-highlight")
        .trim();
      return ink || null;
    };

    const onPointerDown = (event) => {
      if (still?.matches || event.button !== 0) return;
      const ripple = document.createElement("span");
      ripple.className =
        "click-ripple absolute h-3 w-3 -ml-[6px] -mt-[6px] border border-highlight opacity-[0.85] animate-click-ripple";
      const ink = inkUnder(event.clientX, event.clientY);
      if (ink) ripple.style.borderColor = ink;
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
