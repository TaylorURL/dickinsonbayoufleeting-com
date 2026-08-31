import { useEffect, useState } from "react";

// True once the page has moved past `threshold` pixels.
//
// A one-pixel sentinel pinned to the top of the document answers this without
// a callback on every scroll frame: the observer fires twice per page, on the
// way out of the viewport and on the way back in.
export function useScrolled(threshold = 12) {
  const [isPast, setIsPast] = useState(false);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return undefined;

    const sentinel = document.createElement("div");
    sentinel.setAttribute("aria-hidden", "true");
    sentinel.style.cssText = [
      "position:absolute",
      "top:0",
      "left:0",
      "width:1px",
      "height:" + threshold + "px",
      "pointer-events:none",
      "visibility:hidden",
    ].join(";");
    document.body.appendChild(sentinel);

    const observer = new IntersectionObserver(
      (entries) => setIsPast(!entries[entries.length - 1].isIntersecting),
      { threshold: 0 },
    );
    observer.observe(sentinel);

    return () => {
      observer.disconnect();
      sentinel.remove();
    };
  }, [threshold]);

  return isPast;
}
