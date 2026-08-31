import { useCallback, useMemo, useState } from "react";
import "./styles/ContactSection.css";
import { PHONE_NUMBER } from "../app/constants/phoneNumber";
import { FACILITIES } from "../app/constants/facilities";
import { useReveal } from "../app/hooks/useReveal";
import InquiryFields from "./InquiryFields";
import InquiryErrorSummary from "./InquiryErrorSummary";
import { CheckIcon } from "./Icons";
import {
  formatPhone,
  inquiryErrorMessage,
  submitInquiry,
  validateInquiry,
} from "../app/constants/inquiryForm";

const MAX_MESSAGE = 1200;
const FORM_ID = "contactForm";

function ContactSection() {
  const asideRef = useReveal();
  const formRef = useReveal();
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
    <section
      className="contactSection section"
      data-surface="light"
      id="contact"
      aria-label="Contact"
    >
      <div className="container">
        <div className="contactSection__layout">
          <aside
            className="contactSection__aside reveal-on-scroll"
            ref={asideRef}
          >
            <div className="section__head">
              <p className="eyebrow eyebrow--strong mono">Reach the office</p>
              <h2 className="section__title">
                Talk to a person who knows the dock.
              </h2>
              <p className="section__subtitle">
                Single-barge job or year-long lease, we are happy to talk. Phone
                is fastest. The form goes straight to the operations desk.
              </p>
            </div>

            <dl className="contactSection__directList">
              <div className="contactSection__directItem">
                <dt className="mono">Direct Line</dt>
                <dd>
                  <a
                    className="contactSection__directValue tabular"
                    href={phoneHref}
                  >
                    {PHONE_NUMBER}
                  </a>
                </dd>
              </div>
              <div className="contactSection__directItem">
                <dt className="mono">Operations Desk</dt>
                <dd className="contactSection__directNote">
                  Shore presence 24 / 7. The office is staffed weekdays, with
                  the on-call line monitored at all other hours.
                </dd>
              </div>
            </dl>

            <ul className="contactSection__facilityList">
              {FACILITIES.map((f) => (
                <li key={f.id} className="contactSection__facility">
                  <span className="contactSection__facLabel mono">
                    {f.shortName} Facility
                  </span>
                  <span className="contactSection__facAddr">{f.address}</span>
                  <span className="contactSection__facRegion mono">
                    {f.region}
                  </span>
                </li>
              ))}
            </ul>
          </aside>

          <div
            className="contactSection__formWrap reveal-on-scroll"
            ref={formRef}
          >
            {submitted ? (
              <div className="contactSection__success" role="status">
                <span
                  className="contactSection__successTick"
                  aria-hidden="true"
                >
                  <CheckIcon size={22} />
                </span>
                <h3 className="contactSection__successTitle">
                  We have your note.
                </h3>
                <p className="contactSection__successBody">
                  Someone will reach back inside one business day. If your
                  timeline is tighter than that, please call {PHONE_NUMBER}. The
                  on-call line is always answered.
                </p>
              </div>
            ) : (
              <form
                className="contactForm"
                onSubmit={submit}
                noValidate
                aria-label="Quote Request"
              >
                <p className="contactForm__lede mono">Send a Note</p>
                <p className="contactForm__required">
                  All fields are required.
                </p>
                {attempted ? (
                  <InquiryErrorSummary
                    block="contactForm"
                    idPrefix={FORM_ID}
                    errors={errors}
                  />
                ) : null}
                <div className="contactForm__grid">
                  <InquiryFields
                    block="contactForm"
                    idPrefix={FORM_ID}
                    values={values}
                    errors={errors}
                    shown={showError}
                    onChange={change}
                    onBlur={blur}
                    counter={
                      <span className="contactForm__counter mono">
                        {values.message.length} / {MAX_MESSAGE}
                      </span>
                    }
                  />
                </div>

                <div className="contactForm__actions">
                  <a href={phoneHref} className="btn btn--ghost">
                    Call Instead
                  </a>
                  <button
                    type="submit"
                    className="btn btn--primary"
                    disabled={submitting}
                  >
                    {submitting ? "Sending…" : "Send Request"}
                  </button>
                </div>
                {submitError ? (
                  <p className="contactForm__submitErr" role="alert">
                    {submitError}
                  </p>
                ) : null}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactSection;
