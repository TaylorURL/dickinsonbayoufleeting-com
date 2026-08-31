import { BAND, Container, Section, SectionHead } from "./ui/Layout";
import { Reveal, Stagger, staggerChild } from "./ui/Reveal";
import { ROW, ROW_INNER, ROW_MARKER, SLOT } from "./ui/Row";

const AMENITIES = [
  {
    code: "CAP/01",
    name: "Dedicated Barge Slips",
    desc: "A slip assigned to you and held for you, for staging, mooring or retrieval on Galveston Bay and the Houston Ship Channel.",
    meta: "Slip · Mooring",
  },
  {
    code: "CAP/02",
    name: "On-Site Fleeting & Marine Crew",
    desc: "Shore crew on site at both yards for fleeting, mooring, docking and departures on the upper Texas Gulf Coast.",
    meta: "Crew · 24/7",
  },
  {
    code: "CAP/03",
    name: "5-Acre Coastal Waterfront Yards",
    desc: "Five acres at each yard, one on Galveston Bay and one on the Gulf Intracoastal Waterway, both with the water at the bulkhead.",
    meta: "5 AC · Direct",
  },
  {
    code: "CAP/04",
    name: "Secure Gated Marine Premises",
    desc: "Gated entry, fenced perimeter, and somebody on site at every hour of the day.",
    meta: "Gated · Patrolled",
  },
  {
    code: "CAP/05",
    name: "Long-Term Fleeting Leases",
    desc: "A fixed monthly rate for the term, quoted per yard, for barge operators, logistics teams and tow companies.",
    meta: "Lease · Fixed",
  },
  {
    code: "CAP/06",
    name: "Coastal Texas & Greater Houston Coverage",
    desc: "Facilities in San Leon and Freeport TX serving Houston, Dickinson, Texas City, League City, Kemah, Bacliff, Seabrook, La Marque, Galveston and the surrounding coastal Texas waterways.",
    meta: "Regional · Coastal",
  },
];

// The rules are lines drawn across the list, not borders on its boxes: a ruled
// list is one surface with lines across it, not a stack of panels that happen
// to touch.
function Amenities() {
  return (
    <Section surface="dark" id="amenities" aria-label="Amenities">
      <Container className={BAND}>
        <Reveal>
          <SectionHead
            eyebrow="Capabilities"
            title="What a slip here comes with."
            subtitle="Dedicated slips, a crew on site, gated ground and five acres of it, on Galveston Bay and the Gulf Intracoastal Waterway."
            plate="dock"
          />
        </Reveal>

        <Stagger
          as="ol"
          aria-label="Capability List"
          className="m-0 list-none border-t border-border p-0"
        >
          {AMENITIES.map((amenity, idx) => (
            <li
              key={amenity.name}
              className={`border-b border-border ${staggerChild(idx)}`}
            >
              <div className={`${ROW} ${ROW_INNER} ${ROW_MARKER} py-6 lg:py-7`}>
                <span
                  aria-hidden="true"
                  className={`${SLOT.index} font-mono text-xs font-medium tracking-control text-muted`}
                >
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <span
                  className={`${SLOT.code} font-mono text-xs font-medium tracking-control text-faint`}
                >
                  {amenity.code}
                </span>
                <h3
                  className={`${SLOT.name} m-0 text-h6 text-primary lg:row-span-2`}
                >
                  {amenity.name}
                </h3>
                <p
                  className={`${SLOT.detail} max-w-prose text-md text-secondary`}
                >
                  {amenity.desc}
                </p>
                <span
                  className={`${SLOT.meta} whitespace-nowrap font-mono text-xs font-medium uppercase tracking-label text-muted`}
                >
                  {amenity.meta}
                </span>
              </div>
            </li>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}

export default Amenities;
