import { SERVICE_AREA_CITIES } from "../app/constants/serviceArea";
import { BAND, Container, Section, SectionHead } from "./ui/Layout";
import { Reveal, Stagger, staggerChild } from "./ui/Reveal";

// The rule under a cell fills from the left as the pointer crosses it, which is
// the cell's whole hover: the ground stays put so twelve cells do not all
// change colour at once as the pointer travels the grid.
const CELL_RULE =
  "after:absolute after:-bottom-px after:left-0 after:h-accent after:w-full after:origin-left after:scale-x-0 after:bg-highlight after:transition-transform after:duration-settle after:ease-swell after:content-[''] hover:after:scale-x-100 motion-reduce:after:transition-none";

function ServiceArea() {
  return (
    <Section surface="light" id="service-area" aria-label="Service Area">
      <Container className={BAND}>
        <Reveal>
          <SectionHead
            eyebrow="Coverage"
            title="Galveston Bay, the Ship Channel, the GIWW."
            subtitle="San Leon sits on Galveston Bay with quick access to the Ship Channel. Freeport extends the same operation south along the GIWW."
          />
        </Reveal>

        <Stagger
          as="ul"
          aria-label="Cities and Areas Served"
          className="m-0 grid list-none grid-cols-2 gap-0 border-t border-border p-0 md:grid-cols-3 lg:grid-cols-4"
        >
          {SERVICE_AREA_CITIES.map((city, idx) => (
            <li key={city.name} className={staggerChild(idx)}>
              <div
                className={`relative flex h-full flex-col gap-2 border-b border-r border-hairline px-4 py-5 ${CELL_RULE}`}
              >
                <span className="font-mono text-xs font-medium tracking-control text-muted">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <span className="font-condensed text-lg font-semibold uppercase tracking-normal text-primary">
                  {city.name}
                </span>
                <span className="font-mono text-2xs font-medium uppercase tracking-label text-faint">
                  {city.county}
                </span>
              </div>
            </li>
          ))}
        </Stagger>

        <p className="block max-w-prose border-l-2 border-highlight pl-5 text-md leading-relaxed text-secondary">
          <span className="mr-2 inline-block font-mono text-xs font-medium tracking-control text-highlight">
            Note:
          </span>
          Coverage runs across Brazoria, Galveston and Harris county
          waterfronts. Call and ask about any port not on the list.
        </p>
      </Container>
    </Section>
  );
}

export default ServiceArea;
