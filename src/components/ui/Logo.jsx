import { useCallback, useState } from "react";

// The wordmark, in one place. It is drawn three times - twice in the bar for
// the two surfaces it crosses, once in the footer.
//
// The same artwork ships in two formats. WebP is offered first and is about
// half the weight of the PNG at every width, and it is written out of the PNG
// losslessly, so the picture in it is the picture the PNG holds rather than a
// second rendering of it. The PNG stays behind it for a browser that cannot
// read WebP. `sizes` is what tells the browser which width the box needs, and
// it is per call site, because the box is.
const WEBP_SRCSET = (tone) =>
  `/images/DBF-Logo-${tone}-120.webp 120w, ` +
  `/images/DBF-Logo-${tone}-240.webp 240w, ` +
  `/images/DBF-Logo-${tone}-320.webp 320w, ` +
  `/images/DBF-Logo-${tone}.webp 476w`;

const PNG_SRCSET = (tone) =>
  `/images/DBF-Logo-${tone}-120.png 120w, ` +
  `/images/DBF-Logo-${tone}-240.png 240w, ` +
  `/images/DBF-Logo-${tone}.png 476w`;

// The artwork's own box, trimmed to its bounds so the height the mark is given
// is the height it draws at. Declared so the row it sits in is the right height
// before the file arrives.
const INTRINSIC = { width: 476, height: 146 };

function Logo({ tone = "White", sizes, priority = false, className = "" }) {
  // The fill stands in for the mark until the file decodes, then goes. It has
  // to go rather than sit behind: the artwork is transparent around the
  // letterforms, so a fill that stayed would draw a block around the wordmark
  // instead of standing in for it.
  const [drawn, setDrawn] = useState(false);
  const settle = useCallback(() => setDrawn(true), []);

  // A cached file can finish before the load handler is attached, which is the
  // case that would otherwise leave the fill up for good.
  const check = useCallback((node) => {
    if (node?.complete) setDrawn(true);
  }, []);

  const fill = drawn ? "" : "bg-layer-2";
  // The mark in the bar is on the first screen and is fetched with everything
  // else there. The one in the footer is not, so it is asked for at the back of
  // the queue: it arrives while the reader is still at the top of the page,
  // which is what keeps the stand-in fill off the foot of it, and it takes no
  // bandwidth from anything the reader is actually looking at.
  const loading = priority
    ? { fetchPriority: "high" }
    : { fetchPriority: "low", decoding: "async" };

  // The picture element carries no box of its own, so the image stays the
  // element its parent lays out and the row it sits in is unchanged.
  return (
    <picture className="contents">
      <source type="image/webp" srcSet={WEBP_SRCSET(tone)} sizes={sizes} />
      <img
        ref={check}
        src={`/images/DBF-Logo-${tone}.png`}
        srcSet={PNG_SRCSET(tone)}
        sizes={sizes}
        alt="Dickinson Bayou Fleeting"
        width={INTRINSIC.width}
        height={INTRINSIC.height}
        onLoad={settle}
        onError={settle}
        {...loading}
        className={`w-auto object-contain ${fill} ${className}`.trim()}
      />
    </picture>
  );
}

export default Logo;
