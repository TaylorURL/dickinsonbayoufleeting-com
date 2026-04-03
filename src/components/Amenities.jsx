import "./styles/Amenities.css";

function Amenities() {
  const amenities = [
    {
      name: "Dedicated Slip Access",
      desc: "Private slip assignments for reliable vessel staging and retrieval.",
    },
    {
      name: "On-Site Assistance",
      desc: "Trained personnel available to support docking and departure operations.",
    },
    {
      name: "Waterfront Acreage",
      desc: "Spacious five-acre lots with direct waterway access at each facility.",
    },
    {
      name: "Secure Premises",
      desc: "Gated entry and perimeter fencing to protect vessels and equipment.",
    },
    {
      name: "Flexible Leasing",
      desc: "Long-term lease options tailored to commercial and private needs.",
    },
    {
      name: "Convenient Locations",
      desc: "Facilities in Freeport and San Leon with easy Gulf Coast access.",
    },
  ];
  return (
    <section className="amenities" aria-label="Amenities" id="amenities">
      <div className="amenities__inner">
        <div className="amenities__head">
          <h2 className="amenities__title">Amenities & Services</h2>
          <p className="amenities__subtitle">
            Everything you need for safe, convenient vessel staging on the Texas
            Gulf Coast.
          </p>
        </div>
        <div className="amenities__grid">
          {amenities.map((a) => (
            <div key={a.name} className="amenity">
              <h3 className="amenity__name">{a.name}</h3>
              <p className="amenity__desc">{a.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Amenities;
