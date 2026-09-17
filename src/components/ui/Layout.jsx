import { forwardRef } from "react";

// The band and the measure it holds. Every section on the site is one of
// these, so the gutter, the maximum width and the rhythm between bands are
// decided once instead of per section.

// The measure. 1280 with 80 either side at desktop and 20 on a phone, which is
// the whole of the page's horizontal geometry.
const CONTAINER = "mx-auto w-full max-w-container px-gutter";

// Depth in two rungs. A panel takes the lower one, because a page where
// everything is lifted has nothing lifted. The hairline is an outline rather
// than a border so it costs no layout box and a panel can gain or lose it
// without moving what is inside it.
const PANEL =
  "rounded-md bg-surface outline outline-1 -outline-offset-1 outline-border";
export const PANEL_RAISED = `${PANEL} shadow-raise`;

// The step between a band's head and what it introduces. A margin on each
// block is how two gaps in the same stack end up different sizes.
export const BAND = "flex flex-col gap-9";

// content-visibility keeps a band the reader has not reached out of style and
// layout; the stored size keeps the scrollbar honest while it is skipped, so
// approaching one does not move what is already on screen.
const SECTION =
  "relative py-band [contain-intrinsic-size:auto_640px] [content-visibility:auto]";

// The small label a value is filed under: body face, sentence case, no
// tracking.
export const MICRO = "font-body text-micro";

// The code a thing is filed under, and the only place caps and open tracking
// are spent below heading size.
export const CODE = "font-mono text-code uppercase";

// The register mark a chart plate is trimmed to, one at each corner. The
// borders that draw the two visible edges are the caller's, because which two
// they are is what says which corner this is.
export const CORNER_TICK = "pointer-events-none absolute h-icon-sm w-icon-sm";

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
//
// Bands meet on a straight edge. Where the mode changes the colour change is
// the join and nothing is drawn; where two bands share a mode the lower one
// takes `ruled` and draws the single hairline between them on its own top
// edge. A band drawing a rule it does not need is what puts two lines on one
// join.
export const Section = forwardRef(function Section(
  {
    as: Tag = "section",
    surface = "dark",
    ruled = false,
    className = "",
    children,
    ...rest
  },
  ref,
) {
  return (
    <Tag
      ref={ref}
      data-surface={surface}
      className={`${SECTION} ${ruled ? "border-t border-border" : ""} ${className}`.trim()}
      {...rest}
    >
      {children}
    </Tag>
  );
});

// The one thing that opens a band. A rule and a mono label: at this size a
// condensed cap with nothing beside it reads as a mis-set heading, and the
// rule in front of it is what makes it read as a label instead.
//
// Strong is for the band that is speaking; quiet is for the one that is only
// being named. The rule is markup rather than a pseudo-element, so it takes a
// colour of its own without a second rule to keep in step.
export function Eyebrow({
  as: Tag = "p",
  tone = "strong",
  className = "",
  children,
  ...rest
}) {
  const quiet = tone === "quiet";
  return (
    <Tag
      {...rest}
      className={`m-0 inline-flex items-center gap-3 font-mono text-eyebrow ${
        quiet ? "text-faint" : "text-primary"
      } ${className}`.trim()}
    >
      <span
        aria-hidden="true"
        className={`inline-block h-px w-rule-eyebrow flex-none ${
          quiet ? "bg-border-strong" : "bg-highlight"
        }`}
      />
      {children}
    </Tag>
  );
}

// Every band on every page opens with this. That is the fix to the two heads
// the build was carrying: a component on three bands and a hand-written
// heading on the other ten, with no way to tell which a new band should copy.
//
// Twelve columns, the head on the first seven and the lede on the last five,
// their tops aligned. The lede's own top padding is what aligns the two
// baselines rather than the two boxes. Below the break they stack.
export function SectionHead({
  eyebrow,
  eyebrowTone = "strong",
  title,
  subtitle,
  as: Tag = "h2",
  className = "",
  children,
}) {
  return (
    <div
      className={`grid grid-cols-[minmax(0,1fr)] gap-x-grid-gutter gap-y-4 md:grid-cols-12 ${className}`.trim()}
    >
      <div className="flex min-w-0 flex-col items-start gap-5 md:col-span-7">
        {eyebrow ? <Eyebrow tone={eyebrowTone}>{eyebrow}</Eyebrow> : null}
        <Tag className="m-0 min-w-0 text-h2-mobile text-primary md:text-h2">
          {title}
        </Tag>
      </div>
      {subtitle ? (
        <p className="m-0 self-start font-body text-lead-mobile normal-case text-secondary md:col-span-5 md:pt-2 md:text-lead">
          {subtitle}
        </p>
      ) : null}
      {children}
    </div>
  );
}
