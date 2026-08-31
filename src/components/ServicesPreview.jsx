import { SERVICES, SERVICE_HIGHLIGHTS } from "../app/constants/services";
import { Link } from "../app/router/Link";
import { ArrowRightIcon } from "./Icons";
import Button from "./ui/Button";
import { BAND, Container, Eyebrow, Section } from "./ui/Layout";
import { Reveal, Stagger, staggerChild } from "./ui/Reveal";

// The marker rule runs up the left edge of a card under the pointer. It is laid
// out at full height and scaled from nothing, so it extends on the compositor
// rather than reflowing the grid.
const MARKER =
  "after:absolute after:bottom-0 after:left-0 after:top-0 after:w-marker after:origin-bottom after:scale-y-0 after:bg-highlight after:transition-transform after:duration-settle after:ease-swell after:content-[''] hover:after:scale-y-100 motion-reduce:after:transition-none";

function ServicesPreview() {
  return (
    <Section surface="light" id="services" aria-label="What We Do">
      <Container className={BAND}>
        <Reveal className="grid grid-cols-[minmax(0,1fr)] items-end gap-6 sm:grid-cols-[minmax(0,1fr)_auto]">
          <div className="flex max-w-head flex-col gap-5">
            <Eyebrow strong>What we do</Eyebrow>
            <h2 className="min-w-0 max-w-title text-h2 text-primary">
              Barge fleeting, marine services and waterfront docks.
            </h2>
            <p className="max-w-prose text-lead text-secondary">
              Seven services, run out of the San Leon and Freeport yards for the
              towboats, dispatchers and barge operators who use them.
            </p>
          </div>
          <Button
            variant="ghost"
            to="/services"
            className="self-start whitespace-nowrap sm:self-end"
          >
            See All Services
          </Button>
        </Reveal>

        {/* Cards share one border and one ground, so the grid reads as a ruled
            sheet rather than a stack of panels that happen to touch. */}
        <Stagger
          as="ul"
          aria-label="Service Summary"
          className="m-0 grid list-none grid-cols-[minmax(0,1fr)] gap-0 border border-border bg-surface p-0 sm:grid-cols-2 lg:grid-cols-3"
        >
          {SERVICES.map((s, idx) => (
            <li
              key={s.id}
              className={`group/card relative flex flex-col gap-3 overflow-hidden border-b border-border px-6 pb-6 pt-7 last:border-b-0 sm:border-r sm:last:border-b sm:last:border-r-0 ${MARKER} ${staggerChild(idx)}`}
            >
              <span className="relative z-raised font-mono text-xs font-medium tracking-control text-highlight">
                {s.code}
              </span>
              <h3 className="relative z-raised m-0 text-h6 text-primary">
                {s.name}
              </h3>
              <p className="relative z-raised flex-1 text-md text-secondary">
                {s.summary}
              </p>
              <Link
                to={`/services#${s.id}`}
                className="group/link relative z-raised inline-flex min-h-control-sm items-center gap-2 font-mono text-xs font-medium uppercase tracking-label text-faint no-underline transition-colors duration-quick ease-settle hover:text-highlight focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-highlight active:scale-[0.98] group-hover/card:text-highlight"
              >
                Learn More
                <span
                  aria-hidden="true"
                  className="inline-flex items-center transition-transform duration-settle ease-settle group-hover/link:translate-x-2 motion-reduce:transition-none"
                >
                  <ArrowRightIcon />
                </span>
              </Link>
            </li>
          ))}
        </Stagger>

        <Stagger
          as="ul"
          aria-label="Why Customers Stay"
          className="grid list-none grid-cols-[minmax(0,1fr)] gap-7 p-0 sm:grid-cols-2 lg:grid-cols-3"
        >
          {SERVICE_HIGHLIGHTS.map((h, idx) => (
            <li key={h.title} className={staggerChild(idx)}>
              {/* The lift sits on the inner block so the stagger keeps the
                  outer transform to itself. */}
              <div className="flex flex-col gap-2 border-t border-highlight py-4 transition-transform duration-settle ease-settle hover:-translate-y-1 motion-reduce:transition-none">
                <span className="font-mono text-xs font-medium tracking-control text-highlight">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <h3 className="m-0 text-h6 text-primary">{h.title}</h3>
                <p className="max-w-prose-tight text-md text-secondary">
                  {h.body}
                </p>
              </div>
            </li>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}

export default ServicesPreview;
