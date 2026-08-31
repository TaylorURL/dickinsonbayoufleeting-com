// The wordmark, in one place. It is drawn three times - twice in the bar for
// the two surfaces it crosses, once in the footer - and the copies had already
// parted: all three declared the same `sizes` while the footer draws the mark at
// up to 200px, so the browser picked the 120w file for it and scaled it up.
//
// Three raster widths ship, and `sizes` is what tells the browser which one the
// box needs. It is per call site, because the box is.
const SRCSET = (tone) =>
  `/images/DBF-Logo-${tone}-120.png 120w, ` +
  `/images/DBF-Logo-${tone}-240.png 240w, ` +
  `/images/DBF-Logo-${tone}.png 500w`;

// The intrinsic box, which is square. Declared so the row it sits in is the
// right height before the file arrives.
const INTRINSIC = 240;

function Logo({ tone = "White", sizes, priority = false, className = "" }) {
  return (
    <img
      src={`/images/DBF-Logo-${tone}.png`}
      srcSet={SRCSET(tone)}
      sizes={sizes}
      alt="Dickinson Bayou Fleeting"
      width={INTRINSIC}
      height={INTRINSIC}
      {...(priority
        ? { fetchPriority: "high" }
        : { loading: "lazy", decoding: "async" })}
      className={`w-auto object-contain ${className}`.trim()}
    />
  );
}

export default Logo;
