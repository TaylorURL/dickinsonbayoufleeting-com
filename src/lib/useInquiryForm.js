import { useCallback, useMemo, useState } from "react";
import {
  MESSAGE_CAP,
  formatPhone,
  inquiryErrorMessage,
  submitInquiry,
  validateInquiry,
} from "./inquiryForm";

// The state machine behind an inquiry form, held once because the site asks
// for the same five things in two places. The fields, their rules and their
// wording were already shared; what a form does with them - when a field is
// allowed to call itself wrong, what a phone number is reformatted to as it is
// typed, where focus goes when a submit is refused, and what the reader is
// told when the send fails - was written out twice and had already started to
// differ.
//
// The hosts are left with what actually differs between them: the modal has a
// dialog to run and the contact page has a band to lay out.

const EMPTY = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  message: "",
};

/**
 * @param {string} formId The prefix the fields' element ids are built from,
 *   which is how a refused submit finds the first failing field to focus.
 * @param {(values: object) => Promise<void>} onSubmit What a completed form is
 *   handed to. It throws on anything but a delivered inquiry.
 */
export function useInquiryForm({ formId, onSubmit = submitInquiry }) {
  const [values, setValues] = useState(EMPTY);
  const [touched, setTouched] = useState({});
  const [attempted, setAttempted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const errors = useMemo(() => validateInquiry(values), [values]);

  // A field speaks up once the reader has left it, or once a submit has been
  // tried. Marking a field wrong while it is still being typed into calls it
  // wrong before it is finished.
  const showError = useCallback(
    (key) => Boolean((attempted || touched[key]) && errors[key]),
    [attempted, touched, errors],
  );

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

  const submit = useCallback(
    async (event) => {
      event.preventDefault();
      setAttempted(true);
      setSubmitError("");
      const failing = Object.keys(errors);
      if (failing.length) {
        const first = document.getElementById(`${formId}-${failing[0]}`);
        if (first) first.focus();
        return;
      }
      setSubmitting(true);
      try {
        await onSubmit(values);
        setSubmitting(false);
        setSubmitted(true);
      } catch (error) {
        setSubmitting(false);
        setSubmitError(inquiryErrorMessage(error));
      }
    },
    [errors, formId, onSubmit, values],
  );

  const reset = useCallback(() => {
    setValues(EMPTY);
    setTouched({});
    setAttempted(false);
    setSubmitted(false);
    setSubmitting(false);
    setSubmitError("");
  }, []);

  // Whether there is anything in the form worth asking about before it is
  // thrown away.
  const hasContent = Object.values(values).some((value) => value.trim() !== "");

  return {
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
  };
}
