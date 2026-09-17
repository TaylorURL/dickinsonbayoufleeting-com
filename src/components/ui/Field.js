// The five inquiry fields are asked for in two places - the panel in the modal
// and the form on the contact page - so how a field looks is decided here and
// the hosts decide only where it sits.

// The well the fields sit in. It is a step deeper than every surface that
// hosts them, so a field reads the same on the paper panel of the contact form
// and on the raised panel of the inquiry dialog.
const CONTROL = [
  "w-full appearance-none rounded-sm border bg-field-surface px-4 py-3",
  "font-body text-base text-primary",
  // Held at its final width and offset from the moment it is drawn, so focus
  // lands without the field moving under it.
  "outline outline-2 outline-offset-2 outline-transparent",
  "transition-[border-color,background-color,outline-color] duration-quick ease-settle",
  "focus-visible:outline-highlight-ring",
].join(" ");

export const FIELD = {
  root: "flex flex-col gap-[6px]",
  full: "col-span-full",
  label: "font-body text-micro text-faint",
  hint: "font-body text-small text-faint",
  input: `${CONTROL} min-h-control-lg`,
  // The box grows with what is typed into it. Where field-sizing is understood
  // the browser does the sizing and no script measures the field.
  textarea: `${CONTROL} max-h-field min-h-field resize-y [field-sizing:content]`,
  invalid: "border-danger bg-danger-soft",
  valid: "border-field-border",
  // A line of its own under the box rather than a mark floating inside it: the
  // count is read after the note, not over it.
  counter: "self-end font-mono text-code tabular-nums text-muted",
  // The slot is there whether or not it has words in it, so a field that turns
  // out to be wrong does not push everything under it down the page.
  error: "min-h-line font-body text-small text-danger",
};
