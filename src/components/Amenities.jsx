import "./styles/Amenities.css";

const iconProps = {
  width: 26,
  height: 26,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

const AMENITY_ICONS = {
  slip: (
    <svg {...iconProps}>
      <circle cx="12" cy="5" r="2" />
      <path d="M12 7v13M5 13a7 7 0 0 0 14 0M5 13H3m16 0h2M8 9h8" />
    </svg>
  ),
  assist: (
    <svg {...iconProps}>
      <path d="M12 13a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
      <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
    </svg>
  ),
  waterfront: (
    <svg {...iconProps}>
      <path d="M2 7c2 0 2 1.5 4 1.5S8 7 10 7s2 1.5 4 1.5S16 7 18 7s2 1.5 4 1.5" />
      <path d="M2 13c2 0 2 1.5 4 1.5S8 13 10 13s2 1.5 4 1.5 2-1.5 4-1.5 2 1.5 4 1.5" />
      <path d="M2 19c2 0 2-1.5 4-1.5S8 19 10 19s2-1.5 4-1.5 2 1.5 4 1.5 2-1.5 4-1.5" />
    </svg>
  ),
  secure: (
    <svg {...iconProps}>
      <path d="M12 3 5 6v6c0 4 3 6.5 7 9 4-2.5 7-5 7-9V6l-7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
  lease: (
    <svg {...iconProps}>
      <path d="M7 3h7l4 4v14H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
      <path d="M14 3v4h4M9.5 13l1.8 1.8L15 11" />
    </svg>
  ),
  location: (
    <svg {...iconProps}>
      <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  ),
};

const AMENITIES = [
  {
    icon: "slip",
    name: "Dedicated Barge Slips",
    desc: "Private fleeting slip assignments for reliable barge staging, marine vessel mooring and barge retrieval on Galveston Bay and the Houston Ship Channel.",
  },
  {
    icon: "assist",
    name: "On-Site Fleeting & Marine Crew",
    desc: "Trained marine personnel on site to support barge fleeting, mooring, docking and departure operations along the coastal upper Texas Gulf Coast.",
  },
  {
    icon: "waterfront",
    name: "5-Acre Coastal Waterfront Yards",
    desc: "Spacious five-acre coastal waterfront yards with direct access to Galveston Bay and the Gulf Intracoastal Waterway at each marine terminal facility.",
  },
  {
    icon: "secure",
    name: "Secure Gated Marine Premises",
    desc: "Gated entry, perimeter fencing and round-the-clock site presence protect fleeted barges, marine vessels and equipment.",
  },
  {
    icon: "lease",
    name: "Long-Term Fleeting Leases",
    desc: "Fixed-rate, long-term barge fleeting, marine services and dock-lease options structured for commercial barge operators, marine logistics teams and tow companies.",
  },
  {
    icon: "location",
    name: "Coastal Texas & Greater Houston Coverage",
    desc: "Facilities in San Leon and Freeport TX serving Houston, Dickinson, Texas City, League City, Kemah, Bacliff, Seabrook, La Marque, Galveston and the surrounding coastal Texas waterways.",
  },
];

function Amenities() {
  return (
    <section className="amenities section" aria-label="Amenities" id="amenities">
      <div className="container">
        <div className="section__head">
          <p className="eyebrow">Capabilities</p>
          <h2 className="section__title">
            Barge Fleeting, Marine Services &amp; Coastal Amenities
          </h2>
          <p className="section__subtitle">
            Everything operators need for safe, reliable barge fleeting, marine
            vessel staging and coastal fleet support on Galveston Bay, the
            Houston Ship Channel and the Gulf Intracoastal Waterway.
          </p>
        </div>
        <div className="amenities__grid">
          {AMENITIES.map((amenity) => (
            <article key={amenity.name} className="amenity">
              <span className="amenity__icon">
                {AMENITY_ICONS[amenity.icon]}
              </span>
              <h3 className="amenity__name">{amenity.name}</h3>
              <p className="amenity__desc">{amenity.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Amenities;
