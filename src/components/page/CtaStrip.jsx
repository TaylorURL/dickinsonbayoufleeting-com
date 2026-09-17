import { PHONE_NUMBER, telHref } from "../../app/content/phoneNumber";
import Button from "../ui/Button";
import { Container, MICRO, Section } from "../ui/Layout";
import { Reveal } from "../ui/Reveal";

// The close. The number is the largest thing on it because calling is the
// action this business actually wants, and a button labelled with a phone
// number is a smaller promise than the number set at the size of a figure.
//
// The band is dark on every page, so it and the footer under it read as one
// dark foot to the page rather than as two closes stacked.
function CtaStrip({
  title = "Take a yard on a lease.",
  body = "Tell us the footprint you need and the reach your tow runs. Written lease terms come back inside one business day, and the line is faster still.",
  primary = { label: "Get Lease Terms", to: "/contact" },
}) {
  const phoneHref = telHref();
  return (
    <Section surface="dark" aria-label="Get in touch">
      <Container>
        <Reveal className="grid grid-cols-[minmax(0,1fr)] gap-y-8 md:grid-cols-12 md:items-end md:gap-x-grid-gutter">
          <div className="flex min-w-0 flex-col gap-5 md:col-span-7">
            <h2 className="m-0 text-h2-mobile text-primary md:text-h2">
              {title}
            </h2>
            <p className="m-0 text-lead-mobile text-secondary md:text-lead">
              {body}
            </p>
          </div>

          {/* The number is a link at figure size rather than a button, so the
              action reads as the thing itself instead of a control that leads
              to it. The rule above it is what keeps it in the layout. */}
          <div className="flex min-w-0 flex-col items-start gap-5 border-t border-border-strong pt-6 md:col-span-5 md:items-end md:text-right">
            <p className={`${MICRO} m-0 text-faint`}>Direct Line</p>
            <a
              href={phoneHref}
              className="inline-flex items-center rounded-sm font-mono text-figure tabular-nums text-primary no-underline transition-colors duration-quick ease-settle hover:text-highlight focus-visible:shadow-focus focus-visible:outline-none"
            >
              {PHONE_NUMBER}
            </a>
            <Button
              variant="primary"
              to={primary.to}
              className="w-full xs:w-auto"
            >
              {primary.label}
            </Button>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}

export default CtaStrip;
