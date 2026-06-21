import { useCallback, useMemo, useState } from "react";
import "./styles/ContactSection.css";
import { PHONE_NUMBER } from "../app/constants/phoneNumber";
import { FACILITIES } from "../app/constants/facilities";
import { useReveal } from "../app/hooks/useReveal";

const MAX_MESSAGE = 1200;

function formatPhone(v) {
  const digits = v.replace(/[^0-9]/g, "").slice(0, 15);
  if (digits.length < 4) return digits;
  if (digits.length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  if (digits.length < 11)
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  return `+${digits.slice(0, -10)} (${digits.slice(-10, -7)}) ${digits.slice(-7, -4)}-${digits.slice(-4)}`;
}

function validateForm({ firstName, lastName, email, phone, message }) {
  const e = {};
  if (!firstName.trim()) e.firstName = "Required";
  if (!lastName.trim()) e.lastName = "Required";
  if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Invalid";
  if (!phone.replace(/[^0-9]/g, "").match(/[0-9]{7,}/)) e.phone = "Invalid";
  if (!message.trim() || message.trim().length < 5) e.message = "Too short";
  return e;
}

function ContactSection() {
  const asideRef = useReveal();
  const formRef = useReveal();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [attempted, setAttempted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const errors = useMemo(
    () => validateForm({ firstName, lastName, email, phone, message }),
    [firstName, lastName, email, phone, message],
  );
  const isValid = Object.keys(errors).length === 0;

  const showError = useCallback(
    (key) => attempted && errors[key],
    [attempted, errors],
  );

  async function submit(e) {
    e.preventDefault();
    setAttempted(true);
    if (Object.keys(errors).length) return;
    setSubmitting(true);
    /* No backend wired up — preserve the existing demo behaviour
     * (the same posture used in InquiryModal) and confirm receipt
     * once the simulated send resolves. */
    await new Promise((res) => setTimeout(res, 600));
    setSubmitting(false);
    setSubmitted(true);
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
          <aside className="contactSection__aside reveal-on-scroll" ref={asideRef}>
            <div className="section__head">
              <p className="eyebrow eyebrow--strong mono">Reach the office</p>
              <h2 className="section__title">
                Talk to a person who knows the dock.
              </h2>
              <p className="section__subtitle">
                Whether it is a single-barge job or a year-long lease, we are
                happy to talk. Phone is the fastest. The form below goes
                straight to the operations desk.
              </p>
            </div>

            <dl className="contactSection__directList">
              <div className="contactSection__directItem">
                <dt className="mono">Direct line</dt>
                <dd>
                  <a className="contactSection__directValue tabular" href={phoneHref}>
                    {PHONE_NUMBER}
                  </a>
                </dd>
              </div>
              <div className="contactSection__directItem">
                <dt className="mono">Email</dt>
                <dd>
                  <a className="contactSection__directValue" href={emailHref}>
                    office@dickinsonbayoufleeting.com
                  </a>
                </dd>
              </div>
              <div className="contactSection__directItem">
                <dt className="mono">Operations desk</dt>
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
                    {f.shortName} facility
                  </span>
                  <span className="contactSection__facAddr">{f.address}</span>
                  <span className="contactSection__facRegion mono">
                    {f.region}
                  </span>
                </li>
              ))}
            </ul>
          </aside>

          <div className="contactSection__formWrap reveal-on-scroll" ref={formRef}>
            {submitted ? (
              <div className="contactSection__success" role="status">
                <span className="contactSection__successTick" aria-hidden="true">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m5 12.5 4.5 4.5L19 7" />
                  </svg>
                </span>
                <h3 className="contactSection__successTitle">
                  We have your note.
                </h3>
                <p className="contactSection__successBody">
                  Someone will reach back inside one business day. If your
                  timeline is tighter than that, please call {PHONE_NUMBER} —
                  the on-call line is always answered.
                </p>
              </div>
            ) : (
              <form
                className="contactForm"
                onSubmit={submit}
                noValidate
                aria-label="Quote request"
              >
                <p className="contactForm__lede mono">Send a note</p>
                <div className="contactForm__grid">
                  <label className="contactForm__field">
                    <span className="contactForm__label">First name</span>
                    <input
                      className="contactForm__input"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      aria-invalid={showError("firstName") ? true : undefined}
                    />
                    {showError("firstName") && (
                      <span className="contactForm__err">Required</span>
                    )}
                  </label>
                  <label className="contactForm__field">
                    <span className="contactForm__label">Last name</span>
                    <input
                      className="contactForm__input"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      aria-invalid={showError("lastName") ? true : undefined}
                    />
                    {showError("lastName") && (
                      <span className="contactForm__err">Required</span>
                    )}
                  </label>
                  <label className="contactForm__field">
                    <span className="contactForm__label">Email</span>
                    <input
                      type="email"
                      className="contactForm__input"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      aria-invalid={showError("email") ? true : undefined}
                    />
                    {showError("email") && (
                      <span className="contactForm__err">Invalid email</span>
                    )}
                  </label>
                  <label className="contactForm__field">
                    <span className="contactForm__label">Phone</span>
                    <input
                      type="tel"
                      className="contactForm__input"
                      value={phone}
                      onChange={(e) => setPhone(formatPhone(e.target.value))}
                      placeholder="(555) 555-5555"
                      aria-invalid={showError("phone") ? true : undefined}
                    />
                    {showError("phone") && (
                      <span className="contactForm__err">Invalid phone</span>
                    )}
                  </label>
                  <label className="contactForm__field contactForm__field--full">
                    <span className="contactForm__label">
                      Tell us about the job
                    </span>
                    <textarea
                      className="contactForm__textarea"
                      rows={5}
                      value={message}
                      onChange={(e) =>
                        setMessage(e.target.value.slice(0, MAX_MESSAGE))
                      }
                      placeholder="Vessel particulars, timing, port pairs, anything that helps us answer accurately."
                      aria-invalid={showError("message") ? true : undefined}
                    />
                    <span className="contactForm__counter mono">
                      {message.length} / {MAX_MESSAGE}
                    </span>
                    {showError("message") && (
                      <span className="contactForm__err">
                        Please add a few words about the job.
                      </span>
                    )}
                  </label>
                </div>

                <div className="contactForm__actions">
                  <a href={phoneHref} className="btn btn--ghost">
                    Call instead
                  </a>
                  <button
                    type="submit"
                    className="btn btn--primary"
                    disabled={!isValid || submitting}
                  >
                    {submitting ? "Sending…" : "Send request"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactSection;
