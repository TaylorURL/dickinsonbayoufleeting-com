import { useEffect, useRef } from "react";

// The plate behind the hero: twelve seconds of a tow pushing downriver after
// dark, cut from the yard's own footage. It sits where the drawn sea sat, under
// the same scrim and the same vignette, so the band reads as it always has and
// the water in it is real.
//
// The clip carries no sound and no controls. It is a surface, not a player: a
// reader who wants to watch something has not been offered anything to watch.

// The grade. The source is a phone clip at 1024 wide, cropped and then thrown
// across a plate several times that size, so it arrives soft and blocky in the
// sky. A half-pixel of blur takes the block edges off before the contrast finds
// them, the contrast and saturation put the night back, and the brightness step
// keeps the whole thing under the headline rather than beside it. The same
// language the map grade is written in, for the same reason.
// The grade does two jobs. Grayscale holds the footage inside a palette that
// has no hue in it anywhere else, and the half-pixel blur under raised contrast
// takes the compression edges off a source that was never shot for a hero.
const GRADE =
  "[filter:grayscale(1)_blur(0.5px)_brightness(0.88)_contrast(1.24)] " +
  "motion-reduce:[filter:grayscale(1)_brightness(0.88)_contrast(1.18)]";

// The plate comes up on the poster and holds the film when the file catches
// up, which is the same picture twice: the poster is a frame of the clip, and
// it is what a reader who has asked for less motion is left looking at. Waiting
// for the first frame of video to decode before showing either of them left the
// band empty for as long as the clip took to arrive, and the fade then landed
// somewhere in the second half of the load rather than at the start of it.
function HeroFilm({ className = "" }) {
  const videoRef = useRef(null);

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
      className={`absolute inset-0 block h-full w-full scale-[1.02] animate-film-in object-cover [min-height:100%] ${GRADE} ${className}`.trim()}
      height="432"
      loop
      muted
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
