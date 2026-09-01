import { Link } from "../../app/router/Link";
import { ArrowRightIcon } from "../Icons";

// One button per section carries `primary`. The safety-orange fill is the only
// warm colour in the palette, so a second one on the same screen splits the eye
// instead of leading it.

const BASE = [
  "group relative isolate inline-flex items-center justify-center gap-3",
  "hover:[--arrow-live:1] focus-visible:[--arrow-live:1]",
  "select-none overflow-hidden whitespace-nowrap",
  "rounded-sm border border-transparent no-underline",
  "font-mono uppercase leading-none",
  "transition-[background-color,color,border-color,transform,box-shadow] duration-quick ease-settle",
  "focus-visible:shadow-focus focus-visible:outline-none",
  "active:scale-[0.97] active:opacity-80",
  "disabled:pointer-events-none disabled:opacity-45 aria-disabled:pointer-events-none aria-disabled:opacity-45",
].join(" ");

const SIZE = {
  default: "min-h-control px-7 py-4 text-xs tracking-label",
  inline: "min-h-control-sm px-5 py-3 text-2xs tracking-control",
};

const VARIANT = {
  primary:
    "bg-highlight text-on-highlight shadow-accent hover:bg-highlight-hover focus-visible:shadow-focus-accent",
  // For actions sitting inside an already-highlighted region, where safety
  // orange would compete rather than lead.
  solid: "bg-primary text-on-accent hover:bg-accent",
  ghost:
    "bg-transparent text-primary border-field-border hover:border-highlight hover:text-highlight",
  inline:
    "bg-transparent text-secondary border-field-border hover:border-highlight hover:text-highlight",
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
