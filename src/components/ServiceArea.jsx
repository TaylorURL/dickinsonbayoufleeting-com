import "./styles/ServiceArea.css";
import { SERVICE_AREA_CITIES } from "../app/constants/serviceArea";

function ServiceArea() {
  return (
    <section
      className="serviceArea section"
      data-surface="light"
      aria-label="Service area"
      id="service-area"
    >
      <div className="container">
        <div className="section__head">
          <p className="eyebrow eyebrow--strong mono">
            ◇ Section 03 — Coverage
          </p>
          <h2 className="section__title">
            Service area — Houston Ship Channel, Galveston Bay &amp; coastal upper Texas Gulf Coast.
          </h2>
          <p className="section__subtitle">
            Our San Leon facility puts barges directly on Galveston Bay with
            quick access to the Houston Ship Channel and the Gulf Intracoastal
            Waterway, and our Freeport facility extends coastal coverage south
            along the Intracoastal. Together they support barge fleeting,
            marine services and long-term dock leasing throughout the coastal
            upper Texas Gulf Coast.
          </p>
        </div>

        <ul className="serviceArea__grid" aria-label="Cities and areas served">
          {SERVICE_AREA_CITIES.map((city, idx) => (
            <li key={city.name} className="serviceArea__item">
              <span className="serviceArea__idx mono">
                {String(idx + 1).padStart(2, "0")}
              </span>
              <span className="serviceArea__name">{city.name}</span>
              <span className="serviceArea__county mono">{city.county}</span>
            </li>
          ))}
        </ul>

        <p className="serviceArea__note">
          <span className="serviceArea__noteLabel mono">FN.01 —</span>
          Also serving the wider Houston Ship Channel, Galveston Bay and Gulf
          Intracoastal Waterway corridors and surrounding coastal Texas
          waterways — including Brazoria, Galveston and Harris county
          waterfronts. Contact us for barge fleeting, marine services and
          mooring needs beyond this list.
        </p>
      </div>
    </section>
  );
}

export default ServiceArea;
