import { forwardRef } from "react";
import Plate from "./Plate";

// The band and the measure it holds. Every section on the site is one of
// these, so the gutter, the maximum width and the rhythm between bands are
// decided once instead of per section.

// The measure, and the two rules that fence it. The rules are on the container
// rather than on the page, so every band draws its own pair at the same offset
// and they stack into one unbroken line down the whole document. The extra two
// pixels of width are the rules themselves, so the content column keeps the
// measure it was given.
const CONTAINER =
  "mx-auto w-full max-w-container-ruled border-x border-hairline px-gutter";

// A divider inside a band, run out past the gutter so its ends touch the two
// vertical rules. A rule that stops short of them reads as a floating line
// instead of a cell edge.
export const BLEED = "-mx-gutter";

// Worn by whatever the pointer actually lands on. It sets the one property the
// arrow reads, so the trigger can be the link itself or the whole row around
// it, and the keyboard gets the same mark the pointer does.
export const ARROW_TRIGGER =
  "hover:[--arrow-live:1] focus-visible:[--arrow-live:1] focus-within:[--arrow-live:1]";

// Depth in three rungs, each adding one thing to the one below it. A panel
// takes the lowest rung that reads, because a page where everything is lifted
// has nothing lifted. The hairline is an outline rather than a border so it
// costs no layout box and a panel can gain or lose it without moving what is
// inside it.
export const PANEL_TINT = "bg-surface";
export const PANEL = `${PANEL_TINT} outline outline-1 -outline-offset-1 outline-border`;
export const PANEL_RAISED = `${PANEL} shadow-raise`;

// One step between the blocks of a band. A margin on each block is how two
// gaps in the same stack end up different sizes.
export const BAND = "flex flex-col gap-8";

// content-visibility keeps a band the reader has not reached out of style and
// layout; the stored size keeps the scrollbar honest while it is skipped, so
// approaching one does not move what is already on screen.
const SECTION =
  "relative border-t border-hairline py-section [contain-intrinsic-size:auto_640px] [content-visibility:auto]";

export function Container({
  as: Tag = "div",
  className = "",
  children,
  ...rest
}) {
  return (
    <Tag className={`${CONTAINER} ${className}`.trim()} {...rest}>
      {children}
    </Tag>
  );
}

// Takes a ref because a band that defers work until the reader reaches it has
// to observe itself.
export const Section = forwardRef(function Section(
  { as: Tag = "section", surface = "dark", className = "", children, ...rest },
  ref,
) {
  return (
    <Tag
      ref={ref}
      data-surface={surface}
      className={`${SECTION} ${className}`.trim()}
      {...rest}
    >
      {children}
    </Tag>
  );
});

// The rule that opens an eyebrow is markup rather than a pseudo-element, so it
// takes the eyebrow's own colour without a second rule to keep in step.
export function Eyebrow({ strong = false, className = "", children }) {
  return (
    <p
      className={`inline-flex items-center gap-3 font-mono text-xs font-medium uppercase tracking-eyebrow ${
        strong ? "text-highlight" : "text-faint"
      } ${className}`.trim()}
    >
      <span
        aria-hidden="true"
        className={`inline-block h-px flex-none bg-highlight ${
          strong ? "w-rule-short" : "w-icon-lg"
        }`}
      />
      {children}
    </p>
  );
}

// The micro label: mono, uppercase, tracked wide. Two steps, because a dense
// panel sets them a size below a section, and naming the step is what keeps the
// two from being the same label at two sizes by accident.
export const MICRO = "font-mono text-xs font-medium uppercase tracking-label";
export const MICRO_SM =
  "font-mono text-2xs font-medium uppercase tracking-label";

// The register mark a chart plate is trimmed to, one at each corner. The
// borders that draw the two visible edges are the caller's, because which two
// they are is what says which corner this is.
export const CORNER_TICK = "pointer-events-none absolute h-icon-sm w-icon-sm";

// Riveted steel at the faintest reading that still registers.
export const HULL_PLATE = "bg-hull bg-hull-grid bg-left-top";

// A head can carry one of the drawn plates, which turns it into two columns at
// the width that has room for both. The plate takes the narrower column so the
// title keeps the measure it was set for.
export function SectionHead({
  eyebrow,
  title,
  subtitle,
  plate,
  className = "",
  children,
}) {
  // Title and supporting line sit beside each other on a twelve-column grid
  // rather than stacking, the title taking the first seven and the line running
  // from the eighth to the edge. The line is pushed down half a pixel short of
  // six so its first baseline meets the top of the title's cap height, which
  // aligning the boxes alone does not do at this size difference.
  const head = (
    <div
      className={`grid grid-cols-[minmax(0,1fr)] gap-x-gap gap-y-6 lg:grid-cols-12 ${
        plate ? "" : className
      }`.trim()}
    >
      <div className="flex min-w-0 flex-col items-start gap-5 lg:col-span-7">
        {eyebrow ? <Eyebrow strong>{eyebrow}</Eyebrow> : null}
        <h2 className="min-w-0 max-w-title text-h2 text-primary">{title}</h2>
      </div>
      {subtitle ? (
        <p className="m-0 max-w-prose self-start font-body text-md font-normal normal-case tracking-normal text-secondary lg:col-start-8 lg:col-end-[-1] lg:pt-[5.5px]">
          {subtitle}
        </p>
      ) : null}
      {children}
    </div>
  );

  if (!plate) return head;

  return (
    <div
      className={`grid grid-cols-[minmax(0,1fr)] items-center gap-7 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.72fr)] lg:gap-9 ${className}`.trim()}
    >
      {head}
      <Plate name={plate} />
    </div>
  );
}
