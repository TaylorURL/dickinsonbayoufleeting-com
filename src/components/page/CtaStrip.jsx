import { PHONE_NUMBER, telHref } from "../../app/content/phoneNumber";
import Button from "../ui/Button";
import { Container, MICRO_SM, Section } from "../ui/Layout";
import { Reveal } from "../ui/Reveal";

// The close. The number is the largest thing on it because calling is the
// action this business actually wants, and a button labelled with a phone
// number is a smaller promise than the number set at the size of a headline.
//
// The last band before the footer, so it hands no seam down: the footer opens
// with its own.
function CtaStrip({
  title = "Take a yard on a lease.",
  body = "Tell us the footprint you need and the reach your tow runs. Written lease terms come back inside one business day, and the line is faster still.",
  primary = { label: "Get Lease Terms", to: "/contact" },
}) {
  const phoneHref = telHref();
  return (
    <Section
      surface="dark"
      aria-label="Get in touch"
      className="overflow-hidden before:pointer-events-none before:absolute before:inset-0 before:bg-hull before:bg-hull-grid before:opacity-60 before:content-['']"
    >
      <Container>
        <Reveal className="relative grid grid-cols-[minmax(0,1fr)] gap-y-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,auto)] lg:items-end lg:gap-x-11">
          <div className="flex min-w-0 flex-col gap-5">
            <h2 className="m-0 max-w-title text-h2 text-primary">{title}</h2>
            <p className="m-0 max-w-prose text-lead text-secondary">{body}</p>
          </div>

          {/* The number is a link at display size rather than a button, so the
              action reads as the thing itself instead of a control that leads
              to it. The rule above it is what keeps it in the layout. */}
          <div className="flex min-w-0 flex-col gap-5 border-t border-border-strong pt-6 lg:justify-self-end lg:text-right">
            <p className={`${MICRO_SM} m-0 text-faint`}>Direct Line</p>
            <a
              href={phoneHref}
              className="inline-flex min-h-control-sm items-center rounded-sm font-condensed text-figure-sm uppercase tracking-tight tabular-nums text-primary no-underline decoration-2 underline-offset-[6px] transition-colors duration-quick ease-settle hover:underline focus-visible:shadow-focus focus-visible:outline-none"
            >
              {PHONE_NUMBER}
            </a>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Button variant="primary" to={primary.to}>
                {primary.label}
              </Button>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}

export default CtaStrip;
