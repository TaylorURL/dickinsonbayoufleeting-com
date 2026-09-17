// The quote panel lives in the shell and any control on the site can ask for
// it, so the request travels as an event rather than as a prop threaded down
// through every band that carries a button. This is the one place the event is
// named and the one place the control's own default is cancelled on the way,
// because three call sites each spelling that out is three chances to spell it
// differently.
export const INQUIRY_OPEN = "inquiry:open";

export function openInquiry(event) {
  if (event) event.preventDefault();
  window.dispatchEvent(new Event(INQUIRY_OPEN));
}
