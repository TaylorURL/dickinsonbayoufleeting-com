import { SERVICE_AREA_CITIES } from "../app/constants/serviceArea";
import { PHONE_NUMBER } from "../app/constants/phoneNumber";
import { BAND, Container, MICRO_SM, Section } from "./ui/Layout";
import { Reveal } from "./ui/Reveal";

// Set as a run rather than as a grid. Twelve towns in twelve ruled cells asks
// to be read as twelve separate things when the only fact in it is the extent
// of one coastline, and a run of large type says that extent in one look. The
// counties stay attached to their towns because a name on this coast is only
// unambiguous with one.
function ServiceArea({ surface = "gray", seam = null }) {
  return (
    <Section
      surface={surface}
      seam={seam}
      id="service-area"
      aria-label="Where we work"
    >
      <Container className={BAND}>
        <Reveal className="max-w-head">
          <h2 className="m-0 max-w-title text-h2 text-primary">
            Galveston Bay, the Ship Channel, the GIWW.
          </h2>
        </Reveal>

        <Reveal className="border-t border-border-strong pt-10">
          <ul className="m-0 flex list-none flex-wrap items-baseline gap-x-5 gap-y-4 p-0">
            {SERVICE_AREA_CITIES.map((city, i) => (
              <li key={city.name} className="flex items-baseline gap-5">
                {i > 0 ? (
                  <span
                    aria-hidden="true"
                    className="font-condensed text-h4 leading-none text-muted"
                  >
                    ·
                  </span>
                ) : null}
                <span className="font-condensed text-h3 font-bold uppercase leading-none tracking-tight text-primary">
                  {city.name}
                  <span className={`${MICRO_SM} ml-2 align-super text-faint`}>
                    {city.county}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="grid grid-cols-[minmax(0,1fr)] gap-8 border-t border-hairline pt-8 lg:grid-cols-2 lg:gap-10">
          <p className="m-0 max-w-prose text-md text-secondary">
            Dickinson sits on Galveston Bay with quick access to the Houston
            Ship Channel. Freeport carries the same operation south along the
            Gulf Intracoastal Waterway.
          </p>
          <p className="m-0 max-w-prose text-md text-secondary">
            A town not on this list is not a no. Call {PHONE_NUMBER} and we will
            tell you straight whether we can take it.
          </p>
        </Reveal>
      </Container>
    </Section>
  );
}

export default ServiceArea;
