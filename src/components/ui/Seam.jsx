// The join between two bands. Every surface change on the site goes through
// one of these, because a band change left to a hairline is a hard flip from
// one ground to another and reads as two pages stacked rather than one page
// continuing.
//
// Both shapes are painted in the ground of the band on the far side of the
// join, so the seam belongs to the band it is heading into rather than the one
// it sits in. That is why a seam is the outgoing section's last child and
// takes an `into` preset naming where it lands.
//
// Which shape a join gets is decided by the size of the tonal step. Hull to
// foam is the full width of the scale and carries the wave, so the two black
// bands that open and close the page are cut by water rather than by a rule.
// Foam to paper is one step, where a wave would be a shape nobody can see and
// four waves down one page would read as a template; those joins fade instead.
//
// flex-basis and the full width are what make it span: every host is a flex
// container, and without them a seam dropped into a row one lays out beside
// its sibling as a short bar rather than across the join.

// Where the seam lands. The three tones of a wave come off one scale rather
// than one tone at three opacities, because a translucent light over a dark
// band composites to grey and grey is not a colour this palette has.
export const INTO_LIGHT =
  "[--seam-into:var(--foam-050)] [--wave-ink-back:var(--foam-200)] [--wave-ink-mid:var(--foam-150)] [--wave-ink:var(--foam-050)]";

export const INTO_GRAY =
  "[--seam-into:var(--paper-150)] [--wave-ink-back:var(--paper-250)] [--wave-ink-mid:var(--paper-100)] [--wave-ink:var(--paper-150)]";

export const INTO_DARK =
  "[--seam-into:var(--hull-900)] [--wave-ink-back:var(--hull-950)] [--wave-ink-mid:var(--hull-850)] [--wave-ink:var(--hull-900)]";

const BASE = "relative z-raised m-0 block w-full flex-none pointer-events-none";

const FADE_LAYER =
  "h-[var(--seam-fade-height)] bg-gradient-to-b from-transparent to-[color:var(--seam-into)]";

function Seam({ shape = "wave", flip = false, className = "" }) {
  if (shape === "fade") {
    return (
      <div
        aria-hidden="true"
        className={`${BASE} ${FADE_LAYER} ${
          flip ? "-scale-y-100" : ""
        } ${className}`.trim()}
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      className={`${BASE} h-wave text-[color:var(--wave-ink)] ${className}`.trim()}
    >
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`block h-full w-full ${flip ? "-scale-y-100" : ""}`.trim()}
      >
        <path
          d="M0,40 C180,72 360,8 540,28 C720,48 900,76 1080,52 C1260,28 1380,44 1440,40 L1440,80 L0,80 Z"
          fill="var(--wave-ink-back, currentColor)"
        />
        <path
          d="M0,52 C200,82 380,28 580,42 C780,56 940,84 1140,60 C1300,40 1380,56 1440,52 L1440,80 L0,80 Z"
          fill="var(--wave-ink-mid, currentColor)"
        />
        <path
          d="M0,64 C220,92 420,48 620,60 C820,72 980,92 1180,72 C1320,58 1380,68 1440,64 L1440,80 L0,80 Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}

export default Seam;
