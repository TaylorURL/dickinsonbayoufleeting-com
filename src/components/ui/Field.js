// The five inquiry fields are asked for in two places - the panel in the modal
// and the form on the contact page - so how a field looks is decided here and
// the hosts decide only where it sits.

// The well the fields sit in. It is a step deeper than every surface that
// hosts them, so a field reads the same on the paper panel of the contact form
// and on the hull ground of the inquiry panel.
const CONTROL = [
  "w-full appearance-none rounded-sm border bg-field-surface p-4",
  "font-body text-base leading-snug text-primary",
  // A transparent outline held at its final width, so focus lands without the
  // field moving under it.
  "outline outline-2 -outline-offset-0 outline-transparent",
  "transition-[border-color,background-color,outline-color] duration-quick ease-settle",
  // Hover brings the ring up faintly rather than moving the border, because
  // the border is where the field says whether what is in it is valid.
  "hover:outline-highlight-ring",
  "focus-visible:border-highlight focus-visible:outline-highlight",
].join(" ");

export const FIELD = {
  root: "relative flex flex-col gap-1",
  full: "col-span-full",
  label: "font-mono text-xs font-medium uppercase tracking-label text-faint",
  hint: "font-body text-sm leading-snug text-faint",
  input: `${CONTROL} min-h-control`,
  // The box grows with what is typed into it. Where field-sizing is understood
  // the browser does the sizing and no script measures the field.
  textarea: `${CONTROL} max-h-field min-h-field resize-y [field-sizing:content]`,
  invalid: "border-danger",
  valid: "border-field-border",
  counter:
    "pointer-events-none absolute bottom-2 right-1 font-mono text-2xs text-faint",
  // The slot is there whether or not it has words in it, so a field that turns
  // out to be wrong does not push everything under it down the page.
  error: "min-h-line font-body text-sm leading-snug text-danger",
};
