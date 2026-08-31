// Painted in the ground of the band on the far side of the seam, so the shape
// reads as that band's water rising into this one. Drop it as a section's last
// child for a bottom seam, or pass `flip` for a top one.
//
// The three layers take three tones off the same scale rather than one tone at
// three opacities: a translucent light over a dark band composites to grey, and
// grey is not a colour this palette has. Static geometry, so the depth costs
// nothing at runtime.
function WaveDivider({ flip = false, className = "" }) {
  return (
    <div
      className={`waveDivider${flip ? " waveDivider--flip" : ""}${className ? ` ${className}` : ""}`}
      aria-hidden="true"
    >
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
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
