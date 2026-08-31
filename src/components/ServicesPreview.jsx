import "./styles/ServicesPreview.css";
import { SERVICES, SERVICE_HIGHLIGHTS } from "../app/constants/services";
import { Link } from "../app/router/Link";
import { ArrowRightIcon } from "./Icons";
import { useReveal } from "../app/hooks/useReveal";

function ServicesPreview() {
  const headRef = useReveal();
  const gridRef = useReveal();
  const highlightsRef = useReveal();
  return (
    <section
      className="servicesPreview section"
      data-surface="light"
      id="services"
      aria-label="What We Do"
    >
      <div className="container">
        <div
          className="section__head servicesPreview__head reveal-on-scroll"
          ref={headRef}
        >
          <div className="servicesPreview__headText">
            <p className="eyebrow eyebrow--strong mono">What we do</p>
            <h2 className="section__title">
              Barge fleeting, marine services and waterfront docks.
            </h2>
            <p className="section__subtitle">
              Seven services, run out of the San Leon and Freeport yards for the
              towboats, dispatchers and barge operators who use them.
            </p>
          </div>
          <Link to="/services" className="btn btn--ghost servicesPreview__cta">
            See All Services
          </Link>
        </div>

        <ul
          className="servicesPreview__grid reveal-on-scroll reveal-stagger"
          aria-label="Service Summary"
          ref={gridRef}
        >
          {SERVICES.map((s) => (
            <li key={s.id} className="serviceCard">
              <span className="serviceCard__code mono">{s.code}</span>
              <h3 className="serviceCard__name">{s.name}</h3>
              <p className="serviceCard__summary">{s.summary}</p>
              <Link to={`/services#${s.id}`} className="serviceCard__link mono">
                Learn More
                <span className="serviceCard__linkArrow" aria-hidden="true">
                  <ArrowRightIcon />
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <ul
          className="servicesPreview__highlights reveal-on-scroll reveal-stagger"
          aria-label="Why Customers Stay"
          ref={highlightsRef}
        >
          {SERVICE_HIGHLIGHTS.map((h, idx) => (
            <li key={h.title} className="highlight">
              <span className="highlight__idx mono">
                {String(idx + 1).padStart(2, "0")}
              </span>
              <h3 className="highlight__title">{h.title}</h3>
              <p className="highlight__body">{h.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default ServicesPreview;
