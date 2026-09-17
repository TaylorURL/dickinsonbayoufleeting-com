import { useEffect, useRef, useState } from "react";
import { PHONE_NUMBER, telHref } from "../../app/content/phoneNumber";
import InquiryFields from "./InquiryFields";
import InquiryErrorSummary from "./InquiryErrorSummary";
import Button from "../ui/Button";
import Confirmation from "../ui/Confirmation";
import { Dialog } from "../ui/Dialog";
import { FIELD } from "../ui/Field";
import { Eyebrow } from "../ui/Layout";
import { MESSAGE_CAP } from "../../lib/inquiryForm";
import { useInquiryForm } from "../../lib/useInquiryForm";

// The panel animates in; taking focus before it lands makes the browser scroll
// to a field that is still moving.
const FOCUS_SETTLE_MS = 40;
const FORM_ID = "inqForm";
// Long enough for the panel to finish leaving before its fields are emptied.
const CLEAR_AFTER_CLOSE_MS = 250;

const PANEL =
  "relative flex max-h-[calc(100dvh-theme(spacing.10))] w-[min(640px,100%)] animate-rise flex-col gap-6 overflow-y-auto overscroll-contain rounded-md border border-border bg-surface p-5 xs:p-7 motion-reduce:animate-none";

function InquiryModal({ open, onClose, onSubmit }) {
  const firstFieldRef = useRef(null);
  const discardRef = useRef(null);
  const [confirmingDiscard, setConfirmingDiscard] = useState(false);
  const {
    values,
    errors,
    attempted,
    showError,
    change,
    blur,
    submit,
    submitting,
    submitted,
    submitError,
    hasContent,
    reset,
  } = useInquiryForm({ formId: FORM_ID, onSubmit });

  useEffect(() => {
    if (!open) return undefined;
    const timer = setTimeout(() => {
      firstFieldRef.current && firstFieldRef.current.focus();
    }, FOCUS_SETTLE_MS);
    return () => clearTimeout(timer);
  }, [open]);

  // The question is the only thing on the panel worth reading at the moment it
  // appears, so it takes the mark rather than leaving focus on whatever asked
  // it.
  useEffect(() => {
    if (confirmingDiscard) discardRef.current?.focus();
  }, [confirmingDiscard]);

  // Closing a panel with a half-written note in it should ask first: the note
  // is the only copy of it. A panel that has not been typed into closes on the
  // first click, because there is nothing to lose.
  function requestClose() {
    if (hasContent && !submitted) {
      setConfirmingDiscard(true);
      return;
    }
    resetAndClose();
  }

  function resetAndClose() {
    setConfirmingDiscard(false);
    onClose();
    // Clearing happens after the panel is gone, so the fields do not empty in
    // front of the reader on the way out.
    setTimeout(reset, CLEAR_AFTER_CLOSE_MS);
  }

  // While the question is up, Escape answers it rather than asking it again:
  // closing the panel is the thing being confirmed, so the key that would
  // close it has to mean "no" until the question has gone.
  function onEscape() {
    if (confirmingDiscard) {
      setConfirmingDiscard(false);
      return;
    }
    requestClose();
  }

  return (
    <Dialog
      open={open}
      onEscape={onEscape}
      label="Lease Inquiry"
      className="items-center justify-center gap-0 p-5"
      panelClassName={PANEL}
      data-done={submitted}
      data-phase={submitted ? "done" : "form"}
      scrim={
        // A real button, so the dialog can be dismissed from the keyboard as
        // well as by clicking beside it. Nothing is written inside it, so its
        // name lives on the element rather than in the markup.
        <button
          type="button"
          onClick={!submitting ? requestClose : undefined}
          disabled={submitting}
          aria-label="Close Lease Inquiry"
          className="absolute inset-0 animate-arrive appearance-none border-0 bg-overlay-scrim transition-opacity duration-quick ease-settle hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-highlight disabled:cursor-not-allowed motion-reduce:animate-none"
        />
      }
    >
      {confirmingDiscard ? (
        // The panel scrolls, so the question sticks to its top edge and stays
        // on screen wherever the reader had got to. It sits over the note it
        // is asking about, which is what makes clear which words are at
        // stake.
        <div
          ref={discardRef}
          tabIndex={-1}
          role="alertdialog"
          aria-label="Discard Note"
          className="sticky top-0 z-overlay -mx-5 -mt-5 flex flex-wrap items-center justify-between gap-4 border-b border-danger bg-surface px-5 py-5 outline-none xs:-mx-7 xs:-mt-7 xs:px-7"
        >
          <p className="m-0 font-condensed text-h5 uppercase text-primary">
            Discard this note?
          </p>
          <div className="flex gap-3">
            <Button
              variant="ghost"
              size="sm"
              arrow={false}
              onClick={() => setConfirmingDiscard(false)}
            >
              Keep Editing
            </Button>
            <Button
              variant="primary"
              size="sm"
              arrow={false}
              onClick={resetAndClose}
            >
              Discard
            </Button>
          </div>
        </div>
      ) : null}

      {!submitted && (
        <form onSubmit={submit} noValidate className="flex flex-col gap-6">
          <header className="flex items-start justify-between gap-5">
            <div className="flex min-w-0 flex-col gap-4">
              <Eyebrow>Get a Quote</Eyebrow>
              <h2 className="m-0 text-h3 text-primary">Lease Inquiry</h2>
              <p className="m-0 font-body text-base text-secondary">
                Tell us the footprint you need and the reach your tow runs. We
                send terms inside one business day.
              </p>
              <p className="m-0 font-body text-small text-faint">
                All fields are required.
              </p>
            </div>
            <button
              type="button"
              onClick={requestClose}
              disabled={submitting}
              aria-label="Close Lease Inquiry"
              className="-mr-2 -mt-2 inline-flex h-control-md w-control-md flex-none items-center justify-center rounded-sm bg-transparent text-faint transition-colors duration-quick ease-settle hover:enabled:text-primary focus-visible:shadow-focus focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              {/* Two rules crossed, so the mark inherits the button's colour and
                  needs no second asset to keep in step with the mode. */}
              <span
                aria-hidden="true"
                className="relative block h-4 w-4 before:absolute before:left-0 before:top-1/2 before:h-px before:w-full before:rotate-45 before:bg-current before:content-[''] after:absolute after:left-0 after:top-1/2 after:h-px after:w-full after:-rotate-45 after:bg-current after:content-['']"
              />
            </button>
          </header>

          {attempted ? (
            <InquiryErrorSummary idPrefix={FORM_ID} errors={errors} />
          ) : null}

          <div className="grid grid-cols-[minmax(0,1fr)] gap-5 xs:grid-cols-2">
            <InquiryFields
              idPrefix={FORM_ID}
              values={values}
              errors={errors}
              shown={showError}
              onChange={change}
              onBlur={blur}
              firstFieldRef={firstFieldRef}
              counter={
                <span aria-live="polite" className={FIELD.counter}>
                  {values.message.length} / {MESSAGE_CAP}
                </span>
              }
            />
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-end gap-3">
              <Button variant="inline" size="sm" href={telHref()}>
                Call Instead
              </Button>
              <Button
                variant="ghost"
                size="sm"
                arrow={false}
                disabled={submitting}
                onClick={requestClose}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                arrow={false}
                type="submit"
                disabled={submitting}
              >
                {submitting ? "Sending…" : "Send Request"}
              </Button>
            </div>
            {submitError ? (
              <p role="alert" className="m-0 font-body text-small text-danger">
                {submitError}
              </p>
            ) : null}
          </div>
        </form>
      )}

      {submitted && (
        <div className="relative flex animate-rise flex-col items-start gap-4 motion-reduce:animate-none">
          <Confirmation phone={PHONE_NUMBER} />
          <Button variant="primary" arrow={false} onClick={resetAndClose}>
            Close
          </Button>
        </div>
      )}
    </Dialog>
  );
}

export default InquiryModal;
