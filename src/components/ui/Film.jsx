import { useEffect, useRef, useState } from "react";

// The footage behind the hero and behind every inner page header. It is a
// surface, not a player: no sound, no controls, no poster button. A reader who
// wants to watch something has not been offered anything to watch, so the clip
// is hidden from assistive technology and the page reads the same without it.
//
// Two clips, one component. The hero runs the aerial of a towboat pushing a
// loaded barge; every inner plate runs the cargo barge in the channel.

// The frame the plate opens on, and the picture a reader who has asked for
// less motion is left looking at. It is a frame of the clip, so nothing
// changes when the film arrives except that the water starts moving.
//
// The poster is a picture rather than the video's own poster attribute,
// because poster takes one file and WebP is about two thirds of the JPEG at
// the same frame. The JPEG stays behind it for a browser that cannot read the
// other. It is in the served markup, so the preload scanner has it at parse
// time and no separate preload link is buying anything.
export const HERO_FILM = {
  poster: "/video/hero-poster",
  grade: "film-grade",
  // Widest first: the first entry the device is wide enough for wins.
  sources: [
    { from: 1000, src: "/video/hero-1080.mp4" },
    { from: 0, src: "/video/hero-720.mp4" },
  ],
};

// The 2160 encode is twenty-four megabytes, so it is held back for a screen
// that can show more than the 1080 encode has: a 4K monitor at one density or a
// 5K one at two. A 1440 laptop at two times the density asks for 2880 device
// pixels, which the 1080 file already fills to within one scale step, and it is
// not worth twenty megabytes to close that gap behind a scrim.
export const PLATE_FILM = {
  poster: "/video/plate-poster",
  // Shot in full daylight, where the hero clip was shot at dusk. Under the same
  // wash its deck and sky stay bright enough to run through the lede, so it is
  // brought down to the hero's level in the grade and the wash stays one value.
  grade: "film-grade-day",
  sources: [
    { from: 3000, src: "/video/plate-2160.mp4" },
    { from: 1000, src: "/video/plate-1080.mp4" },
    { from: 0, src: "/video/plate-720.mp4" },
  ],
};

// The clips are 16:9 masters thrown across a plate that is neither, so the
// element is given the master's ratio and cropped by object-fit. A wrong ratio
// here is a layout shift the moment the metadata lands.
const INTRINSIC = { width: 1920, height: 1080 };

// A browser that is not told to wait still asks for enough of a clip to know
// what is in it, and for these that is a large part of the file. A timeout
// stands in where the callback is not understood, so the film always arrives.
function whenIdle(run) {
  const idle = window.requestIdleCallback;
  if (typeof idle === "function") return idle(run, { timeout: 2000 });
  return window.setTimeout(run, 200);
}

// Nothing is fetched for a reader who has asked for less motion or who has
// asked the browser to save data. Both are a request not to spend the
// bandwidth, and the poster is the same picture.
function holdsThePoster() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    return true;
  return Boolean(navigator.connection && navigator.connection.saveData);
}

// Which encode this device actually needs, in device pixels rather than CSS
// pixels: a phone at 390 CSS pixels and three times the density is asking for
// a 1170-pixel-wide picture, and a 720 encode on it is visibly soft.
//
// Read once, when the clip is armed. Unlike a picture element, a media element
// does not pick again when the window is resized, and a background plate is
// not worth re-fetching a second encode for.
function pick(sources) {
  const devicePx = window.innerWidth * (window.devicePixelRatio || 1);
  const match = sources.find((source) => devicePx >= source.from);
  return (match || sources[sources.length - 1]).src;
}

// The plate comes up on the poster and holds the film when the file catches
// up. Waiting for the first frame of video to decode before showing either of
// them left the band empty for as long as the clip took to arrive.
//
// The file is the heaviest thing the site owns, so the markup does not name
// it: the element ships with no source at all and one is rendered once the
// page has loaded and the main thread has gone quiet. Named in the markup it
// was on the wire beside the type and the poster the plate opens on, taking
// the connection those needed to arrive.
function Film({ film, className = "" }) {
  const videoRef = useRef(null);
  // The source the element is allowed to fetch. Null until the page has
  // settled, which is what keeps the clip off the first screen's connection.
  const [armed, setArmed] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const arm = () => {
      if (cancelled || holdsThePoster()) return;
      setArmed(pick(film.sources));
    };
    const queue = () => whenIdle(arm);

    if (document.readyState === "complete") queue();
    else window.addEventListener("load", queue, { once: true });

    return () => {
      cancelled = true;
      window.removeEventListener("load", queue);
    };
  }, [film]);

  // A source appended to a media element that has already run resource
  // selection is ignored, and this one completed selection at mount with no
  // candidates at all, so it has to be told to select again.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !armed) return undefined;
    video.load();

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
  }, [armed]);

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`.trim()}>
      <picture>
        <source srcSet={`${film.poster}.webp`} type="image/webp" />
        <img
          src={`${film.poster}.jpg`}
          alt=""
          aria-hidden="true"
          width={INTRINSIC.width}
          height={INTRINSIC.height}
          fetchPriority="high"
          decoding="async"
          className={`${film.grade} absolute inset-0 h-full w-full object-cover`}
        />
      </picture>
      <video
        ref={videoRef}
        aria-hidden="true"
        className={`${film.grade} absolute inset-0 block h-full w-full animate-film-in object-cover`}
        width={INTRINSIC.width}
        height={INTRINSIC.height}
        loop
        muted
        playsInline
        preload="none"
      >
        {armed ? <source src={armed} type="video/mp4" /> : null}
      </video>
    </div>
  );
}

export default Film;
