import { forwardRef } from "react";

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

// Depth in three rungs, each adding one thing to the one below it. A panel
// takes the lowest rung that reads, because a page where everything is lifted
// has nothing lifted. The hairline is an outline rather than a border so it
// costs no layout box and a panel can gain or lose it without moving what is
// inside it.
export const PANEL =
  "rounded-md bg-surface outline outline-1 -outline-offset-1 outline-border";
export const PANEL_RAISED = `${PANEL} shadow-raise`;

// What a control does under the finger. The ink drops rather than the control
// shrinking: a scale press moves the thing the finger is already on, and at
// the two or three percent that reads as restrained it moves it by an amount
// nothing registers. Stated once, so no two controls press differently.
export const PRESS = "active:opacity-70";

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

// The one thing that opens a band. Every section on the site uses this rather
// than setting its own, because a page whose eyebrows come in three sizes has
// three labels doing one job and no ranking among them.
//
// The rule that opens it is markup rather than a pseudo-element, so it takes
// the eyebrow's own colour without a second rule to keep in step.
export function Eyebrow({ strong = false, className = "", children, ...rest }) {
  return (
    <p
      {...rest}
      className={`m-0 inline-flex items-center gap-3 font-body text-xs font-semibold ${
        strong ? "text-primary" : "text-faint"
      } ${className}`.trim()}
    >
      <span
        aria-hidden="true"
        className={`inline-block h-px flex-none ${
          strong ? "w-rule-short bg-primary" : "w-icon-lg bg-border-strong"
        }`}
      />
      {children}
    </p>
  );
}

// The small label a value is filed under: body face, sentence case, no
// tracking. Two steps, because a dense panel sets them a size below a section,
// and naming the step is what keeps the two from being the same label at two
// sizes by accident.
export const MICRO = "font-body text-xs font-semibold";
export const MICRO_SM = "font-body text-2xs font-semibold";

// The register mark a chart plate is trimmed to, one at each corner. The
// borders that draw the two visible edges are the caller's, because which two
// they are is what says which corner this is.
export const CORNER_TICK = "pointer-events-none absolute h-icon-sm w-icon-sm";

// Riveted steel at the faintest reading that still registers.
export const HULL_PLATE = "bg-hull bg-hull-grid bg-left-top";

export function SectionHead({
  eyebrow,
  title,
  subtitle,
  className = "",
  children,
}) {
  // Title and supporting line sit beside each other on a twelve-column grid
  // rather than stacking, the title taking the first seven and the line running
  // from the eighth to the edge.
  const head = (
    <div
      className={`grid grid-cols-[minmax(0,1fr)] gap-x-gap gap-y-6 lg:grid-cols-12 ${className}`.trim()}
    >
      <div className="flex min-w-0 flex-col items-start gap-5 lg:col-span-7">
        {eyebrow ? <Eyebrow strong>{eyebrow}</Eyebrow> : null}
        <h2 className="min-w-0 max-w-title text-h2 text-primary">{title}</h2>
      </div>
      {subtitle ? (
        <p className="m-0 max-w-prose self-start font-body text-md font-normal normal-case text-secondary lg:col-start-8 lg:col-end-[-1]">
          {subtitle}
        </p>
      ) : null}
      {children}
    </div>
  );

  return head;
}
