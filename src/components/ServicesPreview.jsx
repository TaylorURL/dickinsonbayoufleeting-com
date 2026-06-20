import "./styles/ServicesPreview.css";
import { SERVICES, SERVICE_HIGHLIGHTS } from "../app/constants/services";
import { Link } from "../app/router/Link";
import { useReveal } from "../app/hooks/useReveal";

/* Home-page teaser for the seven core services. The full detail page
 * lives at /services — this card grid is the surface that funnels
 * visitors to it. */
function ServicesPreview() {
  const headRef = useReveal();
  const gridRef = useReveal();
  const highlightsRef = useReveal();
  return (
    <section
      className="servicesPreview section"
      data-surface="light"
      id="services"
      aria-label="What we do"
    >
      <div className="container">
        <div className="section__head servicesPreview__head reveal-on-scroll" ref={headRef}>
          <div className="servicesPreview__headText">
            <p className="eyebrow eyebrow--strong mono">What we do</p>
            <h2 className="section__title">
              Barge fleeting, marine services and waterfront docks.
            </h2>
            <p className="section__subtitle">
              Seven services delivered from two coastal yards. Designed around
              the towboats, dispatchers and barge operators we work with every
              day.
            </p>
          </div>
          <Link to="/services" className="btn btn--ghost servicesPreview__cta">
            See all services
          </Link>
        </div>

        <ul
          className="servicesPreview__grid reveal-on-scroll"
          aria-label="Service summary"
          ref={gridRef}
        >
          {SERVICES.map((s) => (
            <li key={s.id} className="serviceCard">
              <span className="serviceCard__code mono">{s.code}</span>
              <h3 className="serviceCard__name">{s.name}</h3>
              <p className="serviceCard__summary">{s.summary}</p>
              <Link
                to={`/services#${s.id}`}
                className="serviceCard__link mono"
              >
                Learn more
                <span aria-hidden="true">→</span>
              </Link>
            </li>
          ))}
        </ul>

        <ul className="servicesPreview__highlights" aria-label="Why customers stay">
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
