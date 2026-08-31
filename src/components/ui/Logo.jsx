// The wordmark, in one place. It is drawn three times - twice in the bar for
// the two surfaces it crosses, once in the footer.
//
// Three raster widths ship, and `sizes` is what tells the browser which one the
// box needs. It is per call site, because the box is.
const SRCSET = (tone) =>
  `/images/DBF-Logo-${tone}-120.png 120w, ` +
  `/images/DBF-Logo-${tone}-240.png 240w, ` +
  `/images/DBF-Logo-${tone}.png 476w`;

// The artwork's own box, trimmed to its bounds so the height the mark is given
// is the height it draws at. Declared so the row it sits in is the right height
// before the file arrives.
const INTRINSIC = { width: 476, height: 146 };

function Logo({ tone = "White", sizes, priority = false, className = "" }) {
  return (
    <img
      src={`/images/DBF-Logo-${tone}.png`}
      srcSet={SRCSET(tone)}
      sizes={sizes}
      alt="Dickinson Bayou Fleeting"
      width={INTRINSIC.width}
      height={INTRINSIC.height}
      {...(priority
        ? { fetchPriority: "high" }
        : { loading: "lazy", decoding: "async" })}
      className={`w-auto object-contain ${className}`.trim()}
    />
  );
}

export default Logo;
