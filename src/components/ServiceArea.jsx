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
      aria-label="Service Area"
      id="service-area"
    >
      <div className="container">
        <div className="section__head reveal-on-scroll" ref={headRef}>
          <p className="eyebrow eyebrow--strong mono">Coverage</p>
          <h2 className="section__title">
            Galveston Bay, the Ship Channel, the GIWW.
          </h2>
          <p className="section__subtitle">
            San Leon sits on Galveston Bay with quick access to the Ship
            Channel. Freeport extends the same operation south along the GIWW.
          </p>
        </div>

        <ul
          className="serviceArea__grid reveal-on-scroll reveal-stagger"
          aria-label="Cities and Areas Served"
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
          <span className="serviceArea__noteLabel mono">Note:</span>
          Coverage runs across Brazoria, Galveston and Harris county
          waterfronts. Call and ask about any port not on the list.
        </p>
      </div>
    </section>
  );
}

export default ServiceArea;
