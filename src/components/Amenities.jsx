import "./styles/Amenities.css";
import { useReveal } from "../app/hooks/useReveal";

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

function Amenities() {
  const headRef = useReveal();
  const listRef = useReveal();
  return (
    <section
      className="amenities section"
      data-surface="dark"
      aria-label="Amenities"
      id="amenities"
    >
      <div className="container">
        <div className="section__head reveal-on-scroll" ref={headRef}>
          <p className="eyebrow eyebrow--strong mono">Capabilities</p>
          <h2 className="section__title">
            Barge fleeting, marine services &amp; coastal amenities.
          </h2>
          <p className="section__subtitle">
            Everything operators need for safe barge fleeting, vessel staging
            and fleet support on Galveston Bay and the Gulf Intracoastal
            Waterway.
          </p>
        </div>

        <ol
          className="amenities__list reveal-on-scroll reveal-stagger"
          aria-label="Capability List"
          ref={listRef}
        >
          {AMENITIES.map((amenity, idx) => (
            <li key={amenity.name} className="amenityRow">
              <span className="amenityRow__index mono" aria-hidden="true">
                {String(idx + 1).padStart(2, "0")}
              </span>
              <span className="amenityRow__code mono">{amenity.code}</span>
              <h3 className="amenityRow__name">{amenity.name}</h3>
              <p className="amenityRow__desc">{amenity.desc}</p>
              <span className="amenityRow__meta mono">{amenity.meta}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export default Amenities;
