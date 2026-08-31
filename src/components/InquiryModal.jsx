import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import "./styles/InquiryModal.css";
import { PHONE_NUMBER } from "../app/constants/phoneNumber";
import InquiryFields from "./InquiryFields";
import InquiryErrorSummary from "./InquiryErrorSummary";
import { CheckIcon } from "./Icons";
import { formatPhone, validateInquiry } from "../app/constants/inquiryForm";

// The panel animates in; taking focus before it lands makes the browser scroll
// to a field that is still moving.
const FOCUS_SETTLE_MS = 40;
const FORM_ID = "inqForm";
// Long enough for the panel to finish leaving before its fields are emptied.
const CLEAR_AFTER_CLOSE_MS = 250;
const MAX_MESSAGE = 1200;

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
          ? raw.slice(0, MAX_MESSAGE)
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
          ? "The desk did not answer in time. Try again, or call the direct line."
          : "That did not send. Try again, or call the direct line.",
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
      className="inqModal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="inqTitle"
      aria-describedby="inqDesc"
    >
      <button
        type="button"
        className="inqModal__backdrop"
        onClick={!submitting ? requestClose : undefined}
        disabled={submitting}
        aria-label="Close Lease Inquiry"
      />
      <div
        className="inqShell"
        data-done={submitted}
        ref={panelRef}
        data-phase={submitted ? "done" : "form"}
      >
        {confirmingDiscard ? (
          <div
            className="inqDiscard"
            role="alertdialog"
            aria-label="Discard Note"
          >
            <p className="inqDiscard__ask">Discard this note?</p>
            <div className="inqDiscard__actions">
              <button
                type="button"
                className="inqBtn inqBtn--ghost"
                onClick={() => setConfirmingDiscard(false)}
              >
                Keep Editing
              </button>
              <button
                type="button"
                className="inqBtn inqBtn--primary"
                onClick={resetAndClose}
              >
                Discard
              </button>
            </div>
          </div>
        ) : null}
        <button
          type="button"
          className="inqShell__close"
          onClick={requestClose}
          disabled={submitting}
          aria-label="Close Lease Inquiry"
        >
          <span className="inqShell__closeMark" aria-hidden="true" />
        </button>
        {!submitted && (
          <form className="inqLayout" onSubmit={submit} noValidate>
            <header className="inqHeader">
              <p className="eyebrow">Get a Quote</p>
              <h2 id="inqTitle" className="inqTitle">
                Lease Inquiry
              </h2>
              <p id="inqDesc" className="inqLede">
                Tell us about your docking needs and we&rsquo;ll respond within
                24 hours.
              </p>
            </header>
            <p className="inqRequired">All fields are required.</p>
            {attempted ? (
              <InquiryErrorSummary
                block="inq"
                idPrefix={FORM_ID}
                errors={errors}
              />
            ) : null}
            <div className="inqGrid">
              <InquiryFields
                block="inq"
                idPrefix={FORM_ID}
                values={values}
                errors={errors}
                shown={showError}
                onChange={change}
                onBlur={blur}
                firstFieldRef={firstFieldRef}
                counter={
                  <span className="inqCounter" aria-live="polite">
                    {values.message.length}/{MAX_MESSAGE}
                  </span>
                }
              />
            </div>
            <div className="inqFooter inqFooter--actions">
              <div className="inqActions inqActions--right">
                <a
                  href={`tel:1${PHONE_NUMBER.replace(/[^0-9]/g, "")}`}
                  className="inqBtn inqBtn--call"
                >
                  Call
                </a>
                <button
                  type="button"
                  disabled={submitting}
                  className="inqBtn inqBtn--ghost"
                  onClick={requestClose}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inqBtn inqBtn--primary"
                  data-busy={submitting}
                >
                  {submitting ? "Sending\u2026" : "Submit"}
                </button>
              </div>
            </div>
            {submitError ? (
              <p className="inqSubmitErr" role="alert">
                {submitError}
              </p>
            ) : null}
          </form>
        )}
        {submitted && (
          <div className="inqResult">
            <div className="inqResult__icon" aria-hidden="true">
              <CheckIcon size={30} strokeWidth="2.5" />
            </div>
            <h2 className="inqResult__title">Message Sent</h2>
            <p className="inqResult__text">
              We will reach out within 24 hours. You can also call{" "}
              {PHONE_NUMBER} any time for immediate assistance.
            </p>
            <div className="inqResult__actions">
              <button
                className="inqBtn inqBtn--primary"
                onClick={resetAndClose}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default InquiryModal;
