import { PHONE_NUMBER } from "../app/constants/phoneNumber";
import Button from "./ui/Button";
import { Container, Eyebrow } from "./ui/Layout";
import { Reveal } from "./ui/Reveal";

function CtaStrip({
  eyebrow = "Next step",
  title = "Get a slip, or a yard on a lease.",
  body = "Give us the boat, the dates and the port pairs. A written quote comes back inside one business day, and the direct line is faster still.",
  primary = { label: "Get a Written Quote", to: "/contact" },
}) {
  const phoneHref = `tel:1${PHONE_NUMBER.replace(/[^0-9]/g, "")}`;
  return (
    <section
      data-surface="dark"
      aria-label="Get in Touch"
      className="relative overflow-hidden border-t border-hairline py-section before:pointer-events-none before:absolute before:inset-0 before:bg-hull before:bg-hull-grid before:opacity-60 before:content-['']"
    >
      <Container>
        <Reveal className="relative grid grid-cols-[minmax(0,1fr)] items-end gap-8 border-t-2 border-highlight pt-7 sm:grid-cols-[minmax(0,1.5fr)_auto]">
          <div className="flex flex-col gap-4">
            <Eyebrow strong>{eyebrow}</Eyebrow>
            <h2 className="m-0 max-w-title text-h2 font-bold text-primary">
              {title}
            </h2>
            <p className="max-w-prose text-lead text-secondary">{body}</p>
          </div>
          <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto">
            <Button
              variant="primary"
              to={primary.to}
              className="flex-1 sm:flex-none"
            >
              {primary.label}
            </Button>
            <Button
              variant="ghost"
              href={phoneHref}
              className="flex-1 sm:flex-none"
            >
              {PHONE_NUMBER}
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

export default CtaStrip;
