import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { PHONE_NUMBER, telHref } from "../../app/content/phoneNumber";
import InquiryFields from "./InquiryFields";
import InquiryErrorSummary from "./InquiryErrorSummary";
import Button from "../ui/Button";
import Confirmation from "../ui/Confirmation";
import { Eyebrow, HULL_PLATE } from "../ui/Layout";
import { formatPhone, validateInquiry } from "../../lib/inquiryForm";

// The panel animates in; taking focus before it lands makes the browser scroll
// to a field that is still moving.
const FOCUS_SETTLE_MS = 40;
const FORM_ID = "inqForm";
// Long enough for the panel to finish leaving before its fields are emptied.
const CLEAR_AFTER_CLOSE_MS = 250;
const MESSAGE_CAP = 1200;

// The rule across the top of the panel, the same mark the contact form carries.
const MODAL_PANEL_RULE =
  "before:absolute before:left-0 before:top-0 before:h-accent before:w-rule-wide before:bg-highlight before:content-['']";

const GUTTER = "px-5 xs:px-8";

function InquiryModal({ open, onClose, onSubmit }) {
  const panelRef = useRef(null);
  const firstFieldRef = useRef(null);
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });
  const [touched, setTouched] = useState({});
  const [attempted, setAttempted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [confirmingDiscard, setConfirmingDiscard] = useState(false);
  // Escape is bound once for the life of the panel, so it reaches the current
  // close through a ref rather than through a listener rebound on every key.
  const escapeRef = useRef(() => {});

  const errors = useMemo(() => validateInquiry(values), [values]);

  // A field speaks up once the reader has left it, or once a submit has been
  // tried. Marking a field wrong while it is still being typed into calls it
  // wrong before it is finished.
  const showError = useCallback(
    (key) => Boolean((attempted || touched[key]) && errors[key]),
    [attempted, touched, errors],
  );

  useEffect(() => {
    if (!open) return undefined;
    const timer = setTimeout(() => {
      firstFieldRef.current && firstFieldRef.current.focus();
    }, FOCUS_SETTLE_MS);
    return () => clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape" && open) {
        e.preventDefault();
        escapeRef.current();
      }
      if (e.key === "Tab" && open && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll(
          'button,a[href],input,textarea,select,[tabindex]:not([tabindex="-1"])',
        );
        const list = [...focusable].filter(
          (el) => !el.disabled && el.getAttribute("aria-hidden") !== "true",
        );
        if (!list.length) return;
        const first = list[0];
        const last = list[list.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const change = useCallback((key, raw) => {
    const value =
      key === "phone"
        ? formatPhone(raw)
        : key === "message"
          ? raw.slice(0, MESSAGE_CAP)
          : raw;
    setValues((prev) => ({ ...prev, [key]: value }));
  }, []);

  const blur = useCallback((key) => {
    setTouched((prev) => (prev[key] ? prev : { ...prev, [key]: true }));
  }, []);

  async function submit(e) {
    e.preventDefault();
    setAttempted(true);
    setSubmitError("");
    const failing = Object.keys(errors);
    if (failing.length) {
      const first = document.getElementById(`${FORM_ID}-${failing[0]}`);
      if (first) first.focus();
      return;
    }
    setSubmitting(true);
    try {
      const result = onSubmit && onSubmit(values);
      if (result && typeof result.then === "function") {
        await result;
      }
      setSubmitting(false);
      setSubmitted(true);
    } catch (err) {
      setSubmitting(false);
      setSubmitError(
        err && err.name === "TimeoutError"
          ? `Nothing came back in time. Try again, or call ${PHONE_NUMBER}.`
          : `That did not send. Try again, or call ${PHONE_NUMBER}.`,
      );
    }
  }

  const hasContent = Object.values(values).some((value) => value.trim() !== "");

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
    setTimeout(() => {
      setValues({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        message: "",
      });
      setTouched({});
      setSubmitted(false);
      setSubmitting(false);
      setSubmitError("");
      setAttempted(false);
    }, CLEAR_AFTER_CLOSE_MS);
  }

  escapeRef.current = requestClose;

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="inqTitle"
      aria-describedby="inqDesc"
      className="fixed inset-0 z-modal flex items-center justify-center gap-0 p-5"
    >
      {/* A real button, so the dialog can be dismissed from the keyboard as
          well as by clicking beside it. Nothing is written inside it, so its
          name lives on the element rather than in the markup. */}
      <button
        type="button"
        onClick={!submitting ? requestClose : undefined}
        disabled={submitting}
        aria-label="Close Lease Inquiry"
        className="absolute inset-0 animate-arrive appearance-none border-0 bg-overlay-scrim backdrop-blur-sm transition-opacity duration-quick ease-settle hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-highlight disabled:cursor-not-allowed motion-reduce:animate-none"
      />

      <div
        ref={panelRef}
        data-done={submitted}
        data-phase={submitted ? "done" : "form"}
        className={`relative max-h-[calc(100dvh-theme(spacing.8))] w-[min(680px,100%)] animate-rise overflow-y-auto overscroll-contain rounded-sm border border-border-strong bg-bg motion-reduce:animate-none ${HULL_PLATE} ${MODAL_PANEL_RULE}`}
      >
        {confirmingDiscard ? (
          // The panel scrolls, so the question sticks to its top edge and stays
          // on screen wherever the reader had got to. It sits over the note it
          // is asking about, which is what makes clear which words are at
          // stake.
          <div
            role="alertdialog"
            aria-label="Discard Note"
            className={`sticky top-0 z-overlay flex flex-wrap items-center justify-between gap-4 border-b border-danger bg-surface py-5 ${GUTTER}`}
          >
            <p className="font-condensed text-h6 uppercase text-primary">
              Discard this note?
            </p>
            <div className="flex gap-3">
              <Button
                variant="ghost"
                arrow={false}
                onClick={() => setConfirmingDiscard(false)}
              >
                Keep Editing
              </Button>
              <Button variant="primary" arrow={false} onClick={resetAndClose}>
                Discard
              </Button>
            </div>
          </div>
        ) : null}

        {/* The row takes no height of its own, so the mark sits over the
            panel's top corner and stays there while the panel scrolls under
            it. A float and a negative margin did the same job by accident. */}
        <div className="sticky top-0 z-raised flex h-0 justify-end pr-3 pt-3">
          <button
            type="button"
            onClick={requestClose}
            disabled={submitting}
            aria-label="Close Lease Inquiry"
            className="pointer-events-auto inline-flex h-control-sm w-control-sm items-center justify-center rounded-sm bg-transparent text-faint shadow-edge transition-colors duration-quick ease-settle hover:enabled:bg-layer-2 hover:enabled:text-primary focus-visible:shadow-focus focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            {/* Two rules crossed, so the mark inherits the button's colour and
              needs no second asset to keep in step with the theme. */}
            <span
              aria-hidden="true"
              className="relative block h-icon-sm w-icon-sm before:absolute before:left-0 before:top-1/2 before:h-px before:w-full before:rotate-45 before:bg-current before:content-[''] after:absolute after:left-0 after:top-1/2 after:h-px after:w-full after:-rotate-45 after:bg-current after:content-['']"
            />
          </button>
        </div>

        {!submitted && (
          <form onSubmit={submit} noValidate className="flex flex-col gap-7">
            <header
              className={`flex flex-col gap-3 border-b border-hairline pb-4 pt-7 xs:pt-9 ${GUTTER}`}
            >
              <Eyebrow strong>Get a Quote</Eyebrow>
              <h2 id="inqTitle" className="text-h3 text-primary">
                Lease Inquiry
              </h2>
              <p id="inqDesc" className="font-body text-base text-secondary">
                Tell us the footprint you need and the reach your tow runs.
                Terms come back inside one business day.
              </p>
            </header>

            <p className={`font-body text-sm text-faint ${GUTTER}`}>
              All fields are required.
            </p>

            {attempted ? (
              <InquiryErrorSummary
                className={`mx-5 xs:mx-8`}
                idPrefix={FORM_ID}
                errors={errors}
              />
            ) : null}

            <div
              className={`grid grid-cols-[minmax(0,1fr)] xs:grid-cols-2 gap-5 ${GUTTER}`}
            >
              <InquiryFields
                idPrefix={FORM_ID}
                values={values}
                errors={errors}
                shown={showError}
                onChange={change}
                onBlur={blur}
                firstFieldRef={firstFieldRef}
                counter={
                  <span
                    aria-live="polite"
                    className="self-end font-mono text-xs tabular-nums text-muted"
                  >
                    {values.message.length}/{MESSAGE_CAP}
                  </span>
                }
              />
            </div>

            <div
              className={`flex flex-col gap-3 border-t border-hairline pb-5 pt-5 xs:pb-7 ${GUTTER}`}
            >
              <div className="flex flex-wrap items-center justify-end gap-3">
                <Button variant="inline" arrow={false} href={telHref()}>
                  Call Instead
                </Button>
                <Button
                  variant="ghost"
                  arrow={false}
                  disabled={submitting}
                  onClick={requestClose}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  arrow={false}
                  type="submit"
                  disabled={submitting}
                >
                  {submitting ? "Sending…" : "Send Request"}
                </Button>
              </div>
              {submitError ? (
                <p
                  role="alert"
                  className="font-body text-sm leading-normal text-danger"
                >
                  {submitError}
                </p>
              ) : null}
            </div>
          </form>
        )}

        {submitted && (
          <div
            className={`relative flex animate-rise flex-col items-start gap-4 pb-9 pt-10 motion-reduce:animate-none ${GUTTER}`}
          >
            <Confirmation phone={PHONE_NUMBER} />
            <Button variant="primary" arrow={false} onClick={resetAndClose}>
              Close
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default InquiryModal;
