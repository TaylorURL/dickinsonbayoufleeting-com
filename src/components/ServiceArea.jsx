import "./styles/ServiceArea.css";
import { SERVICE_AREA_CITIES } from "../app/constants/serviceArea";
import { useReveal } from "../app/hooks/useReveal";

function ServiceArea() {
  const headRef = useReveal();
  const gridRef = useReveal();
  return (
    <section
      className="serviceArea section"
      data-surface="light"
      aria-label="Service area"
      id="service-area"
    >
      <div className="container">
        <div className="section__head reveal-on-scroll" ref={headRef}>
          <p className="eyebrow eyebrow--strong mono">Coverage</p>
          <h2 className="section__title">
            Houston Ship Channel, Galveston Bay &amp; the upper Texas coast.
          </h2>
          <p className="section__subtitle">
            Our San Leon yard sits directly on Galveston Bay with quick access
            to the Houston Ship Channel and the Gulf Intracoastal Waterway.
            Freeport extends the same operation south along the GIWW. Together
            the two facilities cover the customers and routes that matter on
            the upper Texas coast.
          </p>
        </div>

        <ul
          className="serviceArea__grid reveal-on-scroll reveal-stagger"
          aria-label="Cities and areas served"
          ref={gridRef}
        >
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
          <span className="serviceArea__noteLabel mono">Note —</span>
          We also serve the broader Houston Ship Channel, Galveston Bay and
          Gulf Intracoastal Waterway corridors — including Brazoria, Galveston
          and Harris county waterfronts. If you do not see your port on the
          list, call and ask.
        </p>
      </div>
    </section>
  );
}

export default ServiceArea;
