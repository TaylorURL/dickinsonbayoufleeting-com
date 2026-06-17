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
    name: "Dedicated Slip Access",
    desc: "Private slip assignments for reliable vessel staging and retrieval.",
  },
  {
    icon: "assist",
    name: "On-Site Assistance",
    desc: "Trained personnel available to support docking and departure operations.",
  },
  {
    icon: "waterfront",
    name: "Waterfront Acreage",
    desc: "Spacious five-acre lots with direct waterway access at each facility.",
  },
  {
    icon: "secure",
    name: "Secure Premises",
    desc: "Gated entry and perimeter fencing to protect vessels and equipment.",
  },
  {
    icon: "lease",
    name: "Flexible Leasing",
    desc: "Long-term lease options tailored to commercial and private needs.",
  },
  {
    icon: "location",
    name: "Convenient Locations",
    desc: "Facilities in Freeport and San Leon with easy Gulf Coast access.",
  },
];

function Amenities() {
  return (
    <section className="amenities" aria-label="Amenities" id="amenities">
      <div className="amenities__inner">
        <div className="amenities__head">
          <p className="eyebrow">Capabilities</p>
          <h2 className="amenities__title">Amenities &amp; Services</h2>
          <p className="amenities__subtitle">
            Everything you need for safe, convenient vessel staging on the Texas
            Gulf Coast.
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
