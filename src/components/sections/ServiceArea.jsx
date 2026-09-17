import { SERVICE_AREA_CITIES } from "../../app/content/serviceArea";
import { PHONE_NUMBER } from "../../app/content/phoneNumber";
import { CODE, Container, Section } from "../ui/Layout";
import { Reveal } from "../ui/Reveal";

// The extent of one coastline, set as a run of town names with the county
// attached to each. The two facts are different sizes, which is the whole of
// what separates them - a town on this coast is only unambiguous with its
// county, and a middle dot between them made the pair read as two entries.
//
// The band is the sunken ground: a light band a step deeper than the one above
// it, which is what sets the list apart without spending a third mode on it.
function ServiceArea() {
  return (
    <Section
      surface="light"
      id="service-area"
      aria-label="Where we work"
      className="bg-bg-deep"
    >
      <Container className="flex flex-col gap-7 md:gap-8">
        <Reveal>
          <h2 className="m-0 text-h2-mobile text-primary md:max-w-[900px] md:text-h2">
            Galveston Bay, the Ship Channel, the GIWW.
          </h2>
        </Reveal>

        {/* A run at desktop and a column on a phone, where the county moves to
            the right edge so the town names still start on one margin. */}
        <Reveal className="border-t border-border-strong pt-6 md:pt-7">
          <ul className="m-0 flex list-none flex-col gap-[10px] p-0 md:flex-row md:flex-wrap md:gap-x-7 md:gap-y-5">
            {SERVICE_AREA_CITIES.map((city) => (
              <li
                key={city.name}
                className="flex items-center justify-between gap-2 md:items-start md:justify-start"
              >
                <span className="font-condensed text-h4 uppercase text-primary md:text-h3">
                  {city.name}
                </span>
                <span className={`${CODE} flex-none text-faint`}>
                  {city.county}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="flex flex-col gap-4 border-t border-border pt-6 md:flex-row md:gap-8 md:pt-7">
          <p className="m-0 min-w-0 flex-1 font-body text-small text-secondary">
            Dickinson sits on Galveston Bay with quick access to the Houston
            Ship Channel. Freeport carries the same operation south along the
            Gulf Intracoastal Waterway.
          </p>
          <p className="m-0 min-w-0 flex-1 font-body text-small text-secondary">
            A town not on this list is not a no. Call {PHONE_NUMBER} and we will
            tell you straight whether we can take it.
          </p>
        </Reveal>
      </Container>
    </Section>
  );
}

export default ServiceArea;
