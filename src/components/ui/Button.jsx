import { Link } from "../../app/router/Link";
import { ArrowRightIcon } from "./Icons";

// One button per section carries `primary`. With no hue in the palette the
// filled control is the only thing on a band wearing its ground inverted, so a
// second one beside it splits the eye instead of leading it.
//
// The label sets the control rather than the control setting the label: a
// sixteen-pixel word with twenty-four pixels of padding either side of it and
// sixteen above and below, which is what a button reads as at arm's length. A
// fixed height with a small label rattling around inside it does not.

const BASE = [
  "group relative isolate inline-flex items-center justify-center gap-2",
  "hover:[--arrow-live:1] focus-visible:[--arrow-live:1]",
  "select-none whitespace-nowrap",
  "rounded-sm border border-transparent no-underline",
  "font-body font-medium leading-none",
  "transition-[background-color,color,border-color,box-shadow] duration-quick ease-settle",
  "focus-visible:shadow-focus focus-visible:outline-none",
  "disabled:pointer-events-none disabled:opacity-45 aria-disabled:pointer-events-none aria-disabled:opacity-45",
].join(" ");

// The block padding is two pixels short at the top and two long at the bottom,
// because centring the line box leaves a cap-height label sitting low in the
// control. The two together plus the label and the border come out at the
// height the route placeholder reserves for an actions row.
const SIZE = {
  default: "px-6 pb-[16px] pt-[14px] text-base",
  inline: "px-5 pb-[13px] pt-[11px] text-sm",
};

const VARIANT = {
  primary:
    "bg-highlight text-on-highlight hover:bg-highlight-hover active:bg-accent active:text-on-accent",
  // For an action sitting on a band the primary fill would disappear into.
  solid:
    "bg-primary text-on-accent hover:bg-highlight-hover hover:text-on-highlight active:bg-accent",
  ghost:
    "bg-transparent text-primary border-border-strong hover:border-primary hover:bg-layer-1 active:bg-layer-2",
  inline:
    "bg-transparent text-secondary border-border-strong hover:border-primary hover:bg-layer-1 hover:text-primary active:bg-layer-2",
};

// The mark carries its own motion now, off the property the control sets, so
// there is nothing left for the button to do to it but hold its place.
const ARROW = "flex-none";

// Renders as a router link, a plain anchor or a button, whichever the call
// gives it, so a control never has to choose between the right element and the
// right appearance.
function Button({
  variant = "ghost",
  to,
  href,
  block = false,
  arrow = true,
  className = "",
  children,
  ...rest
}) {
  const size = variant === "inline" ? SIZE.inline : SIZE.default;
  const classes = [
    BASE,
    size,
    VARIANT[variant],
    block ? "w-full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const body = (
    <>
      {children}
      {arrow ? <ArrowRightIcon className={ARROW} /> : null}
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
