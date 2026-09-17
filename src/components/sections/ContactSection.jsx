import { PHONE_NUMBER, telHref } from "../../app/content/phoneNumber";
import { FACILITIES } from "../../app/content/facilities";
import { HOURS } from "../../app/content/hours";
import InquiryFields from "../inquiry/InquiryFields";
import InquiryErrorSummary from "../inquiry/InquiryErrorSummary";
import Button from "../ui/Button";
import Confirmation from "../ui/Confirmation";
import { CODE, Container, Eyebrow, MICRO, Section } from "../ui/Layout";
import { FIELD } from "../ui/Field";
import { Reveal } from "../ui/Reveal";
import { MESSAGE_CAP } from "../../lib/inquiryForm";
import { useInquiryForm } from "../../lib/useInquiryForm";

const FORM_ID = "contactForm";

// The card is the only lifted thing on the band, and the tab across its
// top-left corner is the one mark that says it is the thing here to act on.
// It sits over the corner rather than inside it, so the stroke it interrupts
// is the card's own border.
const FORM_CARD =
  "relative rounded-md border border-border bg-surface before:absolute before:-left-px before:-top-px before:h-[2px] before:w-rule-long before:bg-highlight before:content-['']";

function ContactSection() {
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
  } = useInquiryForm({ formId: FORM_ID });

  const phoneHref = telHref();

  return (
    <Section surface="light" id="contact" aria-label="Contact">
      <Container>
        <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-8 md:grid-cols-12 md:gap-x-grid-gutter">
          <Reveal as="aside" className="flex flex-col gap-7 md:col-span-5">
            <div className="flex flex-col items-start gap-5">
              <Eyebrow>Reach the office</Eyebrow>
              <h2 className="m-0 min-w-0 text-h2-mobile text-primary md:text-h2">
                Talk to a person who knows the dock.
              </h2>
              <p className="m-0 font-body text-lead-mobile text-secondary md:text-lead">
                Single-barge job or year-long lease, we take both. Phone is
                fastest. The form reaches whoever is on shift.
              </p>
            </div>

            {/* The number is the largest thing in the column, because calling
                is the action this band actually wants. */}
            <dl className="m-0 flex flex-col gap-6 border-t-2 border-highlight p-0 pt-6">
              <div className="flex flex-col gap-[6px]">
                <dt className={`${MICRO} text-faint`}>Direct Line</dt>
                <dd className="m-0">
                  <a
                    href={phoneHref}
                    className="inline-flex items-center rounded-sm font-mono text-figure tabular-nums text-primary no-underline transition-colors duration-quick ease-settle hover:text-highlight focus-visible:shadow-focus focus-visible:outline-none"
                  >
                    {PHONE_NUMBER}
                  </a>
                </dd>
              </div>
              <div className="flex flex-col gap-3">
                <dt className={`${MICRO} text-faint`}>Hours</dt>
                <dd className="m-0 flex flex-col gap-3">
                  {HOURS.map((h) => (
                    <span key={h.label} className="flex flex-col gap-1">
                      <span className="font-body text-small-strong text-primary">
                        {h.label}
                      </span>
                      <span className="font-body text-small text-secondary">
                        {h.value}
                      </span>
                    </span>
                  ))}
                </dd>
              </div>
            </dl>

            <ul className="m-0 flex list-none flex-wrap gap-x-6 gap-y-5 border-t border-border p-0 pt-6">
              {FACILITIES.map((f) => (
                <li
                  key={f.id}
                  className="flex min-w-[250px] flex-1 flex-col gap-[6px] border-l-2 border-border-strong pl-3"
                >
                  <span className={`${CODE} text-primary`}>{f.name}</span>
                  <span className="font-body text-small-strong text-secondary">
                    {f.address}
                  </span>
                  <span className="font-body text-small text-faint">
                    {f.region}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal className="md:col-span-7">
            {submitted ? (
              <div
                role="status"
                className={`flex animate-rise flex-col gap-3 p-5 motion-reduce:animate-none md:p-7 ${FORM_CARD}`}
              >
                <Confirmation phone={PHONE_NUMBER} />
              </div>
            ) : (
              <form
                onSubmit={submit}
                noValidate
                aria-label="Quote Request"
                className={`flex flex-col gap-6 p-5 md:p-7 ${FORM_CARD}`}
              >
                <div className="flex flex-col gap-[14px]">
                  <p className="m-0 font-mono text-eyebrow uppercase text-primary">
                    Send a Note
                  </p>
                  <p className="m-0 font-body text-base text-secondary">
                    Tell us the footprint you need and the reach your tow runs.
                    We send terms inside one business day.
                  </p>
                  <p className="m-0 font-body text-small text-faint">
                    All fields are required. We do not sell what you send us.
                  </p>
                </div>

                {attempted ? (
                  <InquiryErrorSummary idPrefix={FORM_ID} errors={errors} />
                ) : null}

                {/* The fields bottom-align inside a row, so a hint under one
                    label does not leave the two controls beside each other at
                    different heights. */}
                <div className="grid grid-cols-[minmax(0,1fr)] items-end gap-5 xs:grid-cols-2">
                  <InquiryFields
                    idPrefix={FORM_ID}
                    values={values}
                    errors={errors}
                    shown={showError}
                    onChange={change}
                    onBlur={blur}
                    counter={
                      <span className={FIELD.counter}>
                        {values.message.length} / {MESSAGE_CAP}
                      </span>
                    }
                  />
                </div>

                <div className="flex flex-col-reverse items-stretch gap-3 xs:flex-row xs:items-center xs:justify-end">
                  <Button
                    variant="ghost"
                    href={phoneHref}
                    className="w-full xs:w-auto"
                  >
                    Call Instead
                  </Button>
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={submitting}
                    className="w-full xs:w-auto"
                  >
                    {submitting ? "Sending…" : "Send Request"}
                  </Button>
                </div>

                {submitError ? (
                  <p
                    role="alert"
                    className="m-0 font-body text-small text-danger"
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
