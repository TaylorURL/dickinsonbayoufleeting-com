/* WaveDivider — silhouette wave seam between two contrasting surfaces.
 *
 * Renders an SVG wave painted in the *current* section's --color-bg, so
 * it visually carves into whichever band sits below. Drop it as the last
 * child of a section (the bottom edge will bite the next section). For
 * the top edge, pass `flip` to flip the wave vertically.
 *
 * Three layered waves with different amplitudes/phases give the seam a
 * little water-like depth without animating — performant, GPU-free. */
function WaveDivider({ flip = false, className = "" }) {
  return (
    <div
      className={`waveDivider${flip ? " waveDivider--flip" : ""}${className ? ` ${className}` : ""}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,40 C180,72 360,8 540,28 C720,48 900,76 1080,52 C1260,28 1380,44 1440,40 L1440,80 L0,80 Z"
          fill="currentColor"
          fillOpacity="0.55"
        />
        <path
          d="M0,52 C200,82 380,28 580,42 C780,56 940,84 1140,60 C1300,40 1380,56 1440,52 L1440,80 L0,80 Z"
          fill="currentColor"
          fillOpacity="0.8"
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
