// Painted in the ground of the band on the far side of the seam, so the shape
// reads as that band's water rising into this one. Sits as a section's last
// child for a bottom seam, or takes `flip` for a top one.
//
// The three layers take three tones off the same scale rather than one tone at
// three opacities: a translucent light over a dark band composites to grey, and
// grey is not a colour this palette has. Static geometry, so the depth costs
// nothing at runtime.
//
// flex-basis and the full width are what make it span: every host is a flex
// container, and without them a divider dropped into a row one lays out beside
// its sibling as a short bar rather than across the seam.

// A dark band whose wave bites into the foam band below wears this, so the
// shape is cut out of the paper rather than out of the hull.
export const WAVE_INTO_LIGHT =
  "[--wave-ink-back:var(--foam-200)] [--wave-ink-mid:var(--foam-150)] [--wave-ink:var(--foam-050)]";

function WaveDivider({ flip = false, className = "" }) {
  return (
    <div
      aria-hidden="true"
      className={`relative z-raised m-0 block h-wave w-full flex-none pointer-events-none text-[color:var(--wave-ink)] ${className}`.trim()}
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

export default WaveDivider;
