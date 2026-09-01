import { PHONE_NUMBER } from "../app/constants/phoneNumber";
import Button from "./ui/Button";
import { Container, MICRO_SM } from "./ui/Layout";
import { Reveal } from "./ui/Reveal";

// The close. The number is the largest thing on it because calling is the
// action this business actually wants, and a button labelled with a phone
// number is a smaller promise than the number set at the size of a headline.
function CtaStrip({
  eyebrow = "Next step",
  title = "Take a yard on a lease.",
  body = "Tell us the footprint you need and the reach your tow runs. Written lease terms come back inside one business day, and the line is faster still.",
  primary = { label: "Get Lease Terms", to: "/contact" },
}) {
  const phoneHref = `tel:1${PHONE_NUMBER.replace(/[^0-9]/g, "")}`;
  return (
    <section
      data-surface="dark"
      aria-label="Get in touch"
      className="relative overflow-hidden border-t border-hairline py-section before:pointer-events-none before:absolute before:inset-0 before:bg-hull before:bg-hull-grid before:opacity-60 before:content-['']"
    >
      <Container>
        <Reveal className="relative grid grid-cols-[minmax(0,1fr)] gap-y-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,auto)] lg:items-end lg:gap-x-16">
          <div className="min-w-0">
            <p className={`${MICRO_SM} text-faint`}>{eyebrow}</p>
            <h2 className="m-0 mt-5 max-w-title text-h2 font-bold text-primary">
              {title}
            </h2>
            <p className="m-0 mt-5 max-w-prose text-lead text-secondary">
              {body}
            </p>
          </div>

          {/* The number is a link at display size rather than a button, so the
              action reads as the thing itself instead of a control that leads
              to it. The rule above it is what keeps it in the layout. */}
          <div className="min-w-0 border-t border-border-strong pt-6 lg:justify-self-end lg:text-right">
            <p className={`${MICRO_SM} m-0 text-faint`}>Direct line</p>
            <a
              href={phoneHref}
              className="mt-3 block font-condensed text-figure-sm font-bold uppercase leading-none tracking-tight tabular-nums text-primary no-underline transition-colors duration-quick hover:text-accent"
            >
              {PHONE_NUMBER}
            </a>
            <div className="mt-7 flex flex-wrap gap-3 lg:justify-end">
              <Button variant="primary" to={primary.to}>
                {primary.label}
              </Button>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

export default CtaStrip;
