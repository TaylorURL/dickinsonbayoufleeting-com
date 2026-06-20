import "./styles/Amenities.css";
import { useReveal } from "../app/hooks/useReveal";

const AMENITIES = [
  {
    code: "CAP/01",
    name: "Dedicated Barge Slips",
    desc: "Private fleeting slip assignments for reliable barge staging, marine vessel mooring and barge retrieval on Galveston Bay and the Houston Ship Channel.",
    meta: "Slip · Mooring",
  },
  {
    code: "CAP/02",
    name: "On-Site Fleeting & Marine Crew",
    desc: "Trained marine personnel on site to support barge fleeting, mooring, docking and departure operations along the coastal upper Texas Gulf Coast.",
    meta: "Crew · 24/7",
  },
  {
    code: "CAP/03",
    name: "5-Acre Coastal Waterfront Yards",
    desc: "Spacious five-acre coastal waterfront yards with direct access to Galveston Bay and the Gulf Intracoastal Waterway at each marine terminal facility.",
    meta: "5 AC · Direct",
  },
  {
    code: "CAP/04",
    name: "Secure Gated Marine Premises",
    desc: "Gated entry, perimeter fencing and round-the-clock site presence protect fleeted barges, marine vessels and equipment.",
    meta: "Gated · Patrolled",
  },
  {
    code: "CAP/05",
    name: "Long-Term Fleeting Leases",
    desc: "Fixed-rate, long-term barge fleeting, marine services and dock-lease options structured for commercial barge operators, marine logistics teams and tow companies.",
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
            Everything operators need for safe, reliable barge fleeting, marine
            vessel staging and coastal fleet support on Galveston Bay, the
            Houston Ship Channel and the Gulf Intracoastal Waterway.
          </p>
        </div>

        <ol
          className="amenities__list reveal-on-scroll"
          aria-label="Capability list"
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
