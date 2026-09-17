import { Link } from "../../app/router/Link";
import { ArrowRightIcon } from "./Icons";

// One button per band carries `primary`. With no hue in the palette the filled
// control is the only thing on a band wearing its ground inverted, so a second
// one beside it splits the eye instead of leading it.
//
// Three variants and two sizes, and the three are a ranking rather than three
// appearances: a fill, a strong stroke, a hairline stroke. The size is the
// band's, not the label's - large where the control is the point of the block,
// small where it sits in a row of chrome.

const BASE = [
  "group relative isolate inline-flex items-center justify-center gap-2",
  "hover:[--arrow-live:1] focus-visible:[--arrow-live:1]",
  "select-none whitespace-nowrap",
  "rounded-sm border no-underline",
  "font-body text-small-strong",
  "transition-[background-color,color,border-color,box-shadow] duration-quick ease-settle",
  "focus-visible:shadow-focus focus-visible:outline-none",
  "disabled:pointer-events-none disabled:opacity-40 aria-disabled:pointer-events-none aria-disabled:opacity-40",
].join(" ");

// The block padding, the 22px label and the 1px stroke come out at the two
// control heights the layout is measured on: 48 and 40. A fixed height with a
// small label rattling around inside it does not read as a button.
const SIZE = {
  lg: "px-6 py-3",
  sm: "px-4 py-2",
};

const VARIANT = {
  primary:
    "border-highlight bg-highlight text-on-highlight hover:border-highlight-hover hover:bg-highlight-hover",
  ghost:
    "border-border-strong bg-transparent text-primary hover:border-highlight hover:bg-layer-1 active:bg-layer-2",
  // The third rank, for an action that has to be reachable without asking to
  // be taken. A hairline where the ghost has a stroke.
  inline:
    "border-border bg-transparent text-primary hover:border-border-strong hover:bg-layer-1 active:bg-layer-2",
};

// The mark carries its own motion, off the property the control sets, and it
// is drawn in currentColor, so it reads against the fill on a primary and
// against the band on the other two.
const ARROW = "flex-none";

// Renders as a router link, a plain anchor or a button, whichever the call
// gives it, so a control never has to choose between the right element and the
// right appearance.
function Button({
  variant = "ghost",
  size = "lg",
  to,
  href,
  arrow,
  className = "",
  children,
  ...rest
}) {
  // The hairline rank is the one that carries no mark: it is already the
  // quietest thing on the band, and an arrow on it puts it back up a rank.
  const marked = arrow ?? variant !== "inline";
  const classes = [BASE, SIZE[size], VARIANT[variant], className]
    .filter(Boolean)
    .join(" ");

  const body = (
    <>
      {children}
      {marked ? <ArrowRightIcon className={ARROW} /> : null}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {body}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={classes} {...rest}>
        {body}
      </a>
    );
  }
  return (
    <button type="button" className={classes} {...rest}>
      {body}
    </button>
  );
}

export default Button;
