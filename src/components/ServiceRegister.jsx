import { SERVICES } from "../app/constants/services";
import { Link } from "../app/router/Link";
import Button from "./ui/Button";
import { Container, MICRO_SM, Section } from "./ui/Layout";
import { Reveal, Stagger, staggerChild } from "./ui/Reveal";

// The seven jobs, set as an index rather than as a table or a grid of cards.
// Nothing here is ruled or boxed: the rows are held apart by space and by the
// size of the type, and the only thing that moves on hover is the row itself,
// sliding off the code in its gutter. The ruled version of this list lives on
// the services page, and the two are deliberately not the same shape.
function ServiceRegister() {
  return (
    <Section
      surface="gray"
      id="services"
      aria-label="What we do"
      seam={{ shape: "fade", into: "light" }}
    >
      <Container>
        <div className="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,0.62fr)_minmax(0,1fr)] lg:gap-11">
          <Reveal className="flex flex-col items-start gap-5 lg:sticky lg:top-anchor lg:self-start">
            <h2 className="m-0 max-w-title text-h2 text-primary">
              The dock is already staffed.
            </h2>
            <p className="m-0 max-w-prose text-lead text-secondary">
              This is not leasing bare land. The crew that works both yards
              covers all seven, on site whether your lease uses them or not.
            </p>
            <Button variant="ghost" to="/services">
              See All Services
            </Button>
          </Reveal>

          <Stagger as="ul" className="m-0 flex list-none flex-col p-0">
            {SERVICES.map((s, i) => (
              <li key={s.id} className={`min-w-0 ${staggerChild(i)}`}>
                <Link
                  to={`/services#${s.id}`}
                  className="group grid grid-cols-[minmax(0,1fr)] gap-x-6 rounded-sm py-6 no-underline transition-[transform,opacity] duration-settle ease-swell hover:translate-x-2 hover:[--arrow-live:1] focus-visible:translate-x-2 focus-visible:shadow-focus focus-visible:outline-none focus-visible:[--arrow-live:1] motion-reduce:transition-none motion-reduce:hover:translate-x-0 sm:grid-cols-[minmax(0,var(--col-label))_minmax(0,1fr)]"
                >
                  <span
                    className={`${MICRO_SM} mt-[0.6em] hidden tabular-nums text-muted transition-colors duration-quick group-hover:text-accent sm:block`}
                  >
                    {s.code}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-condensed text-h3 uppercase tracking-tight text-secondary transition-colors duration-quick group-hover:text-primary group-focus-visible:text-primary">
                      {s.name}
                    </span>
                    <span className="mt-2 block max-w-prose text-sm text-muted">
                      {s.summary}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </Stagger>
        </div>
      </Container>
    </Section>
  );
}

export default ServiceRegister;
