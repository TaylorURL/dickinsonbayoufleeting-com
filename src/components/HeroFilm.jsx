import { useEffect, useRef, useState } from "react";

// The plate behind the hero: twelve seconds of a tow pushing downriver after
// dark, cut from the yard's own footage. It sits where the drawn sea sat, under
// the same scrim and the same vignette, so the band reads as it always has and
// the water in it is real.
//
// The clip carries no sound and no controls. It is a surface, not a player: a
// reader who wants to watch something has not been offered anything to watch.
function HeroFilm({ className = "" }) {
  const videoRef = useRef(null);
  const [painted, setPainted] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    // A reader who has asked for less motion gets the poster frame and nothing
    // moving. The element stays in the tree either way, so the box is the same
    // size and nothing below it shifts.
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const settle = () => {
      if (query.matches) {
        video.pause();
        return;
      }
      const started = video.play();
      if (started && typeof started.catch === "function")
        started.catch(() => {});
    };

    settle();
    query.addEventListener("change", settle);
    return () => query.removeEventListener("change", settle);
  }, []);

  return (
    <video
      ref={videoRef}
      aria-hidden="true"
      className={`absolute inset-0 block h-full w-full object-cover [min-height:100%] transition-opacity duration-settle ease-settle ${
        painted ? "opacity-100" : "opacity-0"
      } ${className}`.trim()}
      height="432"
      loop
      muted
      onLoadedData={() => setPainted(true)}
      playsInline
      poster="/video/hero-poster.jpg"
      preload="metadata"
      width="1280"
    >
      <source src="/video/hero.mp4" type="video/mp4" />
    </video>
  );
}

export default HeroFilm;
