import { forwardRef } from "react";

// The band and the measure it holds. Every section on the site is one of
// these, so the gutter, the maximum width and the rhythm between bands are
// decided once instead of per section.

const CONTAINER = "mx-auto w-full max-w-container px-gutter";

// One step between the blocks of a band. A margin on each block is how two
// gaps in the same stack end up different sizes.
export const BAND = "flex flex-col gap-10";

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

// Riveted steel at the faintest reading that still registers.
export const HULL_PLATE = "bg-hull bg-hull-grid bg-left-top";

export function SectionHead({
  eyebrow,
  title,
  subtitle,
  className = "",
  children,
}) {
  return (
    <div
      className={`flex max-w-head flex-col items-start gap-5 ${className}`.trim()}
    >
      {eyebrow ? <Eyebrow strong>{eyebrow}</Eyebrow> : null}
      <h2 className="min-w-0 max-w-title text-h2 text-primary">{title}</h2>
      {subtitle ? (
        <p className="max-w-prose font-body text-lead font-normal normal-case tracking-normal text-secondary">
          {subtitle}
        </p>
      ) : null}
      {children}
    </div>
  );
}
