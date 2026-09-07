import { CheckIcon } from "./Icons";

// What the reader sees once the note has gone. The same form is asked for in
// two places - the panel on the contact page and the dialog - and a
// confirmation that differs between them is one of the two looking unfinished.
// The mark, the size it is drawn at and the words are decided here so neither
// host has an opinion about any of it.
function Confirmation({ phone, className = "" }) {
  return (
    <>
      <span
        aria-hidden="true"
        className={`inline-flex h-control w-control animate-rise-1 items-center justify-center rounded-sm bg-accent text-on-accent motion-reduce:animate-none ${className}`.trim()}
      >
        <CheckIcon size={22} />
      </span>
      <h3 className="m-0 text-h4 text-primary">We have your note.</h3>
      <p className="m-0 max-w-prose-tight text-base text-secondary">
        Someone will get back to you inside one business day. If your timeline
        is tighter than that, please call {phone}. The on-call line is always
        answered.
      </p>
    </>
  );
}

export default Confirmation;
