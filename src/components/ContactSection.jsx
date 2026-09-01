import { useCallback, useMemo, useState } from "react";
import { PHONE_NUMBER } from "../app/constants/phoneNumber";
import { FACILITIES } from "../app/constants/facilities";
import InquiryFields from "./InquiryFields";
import InquiryErrorSummary from "./InquiryErrorSummary";
import Button from "./ui/Button";
import Confirmation from "./ui/Confirmation";
import { Container, Eyebrow, MICRO, PANEL_RAISED, Section } from "./ui/Layout";
import { FIELD } from "./ui/Field";
import { Reveal } from "./ui/Reveal";
import {
  formatPhone,
  inquiryErrorMessage,
  submitInquiry,
  validateInquiry,
} from "../app/constants/inquiryForm";

const MAX_MESSAGE = 1200;
const FORM_ID = "contactForm";

// The rule across the top of the panel, which is the one mark that says the
// form is the thing on this band to act on.
const CONTACT_PANEL_RULE =
  "before:absolute before:-top-px before:left-0 before:h-accent before:w-rule-long before:bg-highlight before:content-['']";

function ContactSection() {
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
    const failing = Object.keys(errors);
    if (failing.length) {
      const first = document.getElementById(`${FORM_ID}-${failing[0]}`);
      if (first) first.focus();
      return;
    }
    setSubmitting(true);
    setSubmitError("");
    try {
      await submitInquiry(values);
      setSubmitting(false);
      setSubmitted(true);
    } catch (err) {
      setSubmitting(false);
      setSubmitError(inquiryErrorMessage(err));
    }
  }

  const phoneHref = `tel:1${PHONE_NUMBER.replace(/[^0-9]/g, "")}`;

  return (
    <Section surface="light" id="contact" aria-label="Contact">
      <Container>
        <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-7 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:gap-9">
          <Reveal as="aside" className="flex flex-col gap-7">
            <div className="flex max-w-head flex-col items-start gap-5">
              <Eyebrow strong>Reach the office</Eyebrow>
              <h2 className="min-w-0 max-w-title text-h2 text-primary">
                Talk to a person who knows the dock.
              </h2>
              <p className="max-w-prose text-lead text-secondary">
                Single-barge job or year-long lease, we are happy to talk. Phone
                is fastest. The form reaches whoever is on shift.
              </p>
            </div>

            <dl className="m-0 flex flex-col gap-5 border-t-2 border-highlight p-0 pt-6">
              <div className="flex flex-col gap-1">
                <dt className={`${MICRO} text-faint`}>Direct Line</dt>
                <dd>
                  <a
                    href={phoneHref}
                    className="inline-flex min-h-control-sm items-center whitespace-nowrap font-condensed text-h5 uppercase tabular-nums text-primary no-underline transition-[color,background-color,border-color,transform,opacity] duration-quick ease-settle hover:text-highlight focus-visible:text-highlight focus-visible:outline-none active:opacity-70"
                  >
                    {PHONE_NUMBER}
                  </a>
                </dd>
              </div>
              <div className="flex flex-col gap-1">
                <dt className={`${MICRO} text-faint`}>Hours</dt>
                <dd className="max-w-prose-tight text-md text-secondary">
                  Shore presence 24 / 7. The office is staffed weekdays, with
                  the on-call line monitored at all other hours.
                </dd>
              </div>
            </dl>

            <ul className="m-0 grid list-none grid-cols-[minmax(0,1fr)] gap-4 border-t border-border p-0 pt-6 sm:grid-cols-2">
              {FACILITIES.map((f) => (
                <li
                  key={f.id}
                  className="flex flex-col gap-1 border-l-2 border-hairline pl-3 transition-colors duration-quick ease-settle hover:border-highlight"
                >
                  <span className={`${MICRO} text-highlight`}>
                    {f.shortName} Facility
                  </span>
                  <span className="font-body text-base font-semibold text-primary">
                    {f.address}
                  </span>
                  <span className="font-body text-sm text-faint">
                    {f.region}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal>
            {submitted ? (
              <div
                role="status"
                className={`relative flex animate-rise flex-col gap-3 p-7 motion-reduce:animate-none ${PANEL_RAISED} ${CONTACT_PANEL_RULE} before:top-0`}
              >
                <Confirmation phone={PHONE_NUMBER} className="mb-2" />
              </div>
            ) : (
              <form
                onSubmit={submit}
                noValidate
                aria-label="Quote Request"
                className={`relative p-6 md:p-7 ${PANEL_RAISED} ${CONTACT_PANEL_RULE}`}
              >
                <div className="mb-5">
                  <Eyebrow strong>Send a Note</Eyebrow>
                </div>
                <p className="mb-5 font-body text-sm text-faint">
                  All fields are required.
                </p>
                {attempted ? (
                  <InquiryErrorSummary
                    className="mb-5"
                    idPrefix={FORM_ID}
                    errors={errors}
                  />
                ) : null}
                <div className="grid grid-cols-[minmax(0,1fr)] gap-5 xs:grid-cols-2">
                  <InquiryFields
                    idPrefix={FORM_ID}
                    values={values}
                    errors={errors}
                    shown={showError}
                    onChange={change}
                    onBlur={blur}
                    counter={
                      <span className={FIELD.counter}>
                        {values.message.length} / {MAX_MESSAGE}
                      </span>
                    }
                  />
                </div>

                <div className="mt-6 flex flex-col-reverse flex-wrap items-stretch justify-end gap-3 xs:flex-row xs:items-center">
                  <Button variant="ghost" href={phoneHref}>
                    Call Instead
                  </Button>
                  <Button variant="primary" type="submit" disabled={submitting}>
                    {submitting ? "Sending…" : "Send Request"}
                  </Button>
                </div>
                {submitError ? (
                  <p
                    role="alert"
                    className="mt-3 font-body text-sm leading-normal text-danger"
                  >
                    {submitError}
                  </p>
                ) : null}
              </form>
            )}
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}

export default ContactSection;
