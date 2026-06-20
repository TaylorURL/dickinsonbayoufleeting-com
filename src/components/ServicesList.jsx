import "./styles/ServicesList.css";
import { SERVICES } from "../app/constants/services";
import { useReveal } from "../app/hooks/useReveal";

function ServicesList({ surface = "dark" }) {
  const headRef = useReveal();
  const listRef = useReveal();
  return (
    <section
      className="servicesList section"
      data-surface={surface}
      aria-label="Services"
      id="services-detail"
    >
      <div className="container">
        <div className="section__head reveal-on-scroll" ref={headRef}>
          <p className="eyebrow eyebrow--strong mono">
            What we do
          </p>
          <h2 className="section__title">
            Coastal barge fleeting &amp; marine services, in plain language.
          </h2>
          <p className="section__subtitle">
            Seven core services delivered from two coastal yards — built around
            the towboats, dispatchers and barge operators we work with every day
            on Galveston Bay and the Gulf Intracoastal Waterway.
          </p>
        </div>

        <ol className="servicesList__list" aria-label="Service list">
          {SERVICES.map((s, idx) => (
            <li key={s.id} className="serviceRow" id={s.id}>
              <span className="serviceRow__index mono" aria-hidden="true">
                {String(idx + 1).padStart(2, "0")}
              </span>
              <span className="serviceRow__code mono">{s.code}</span>
              <h3 className="serviceRow__name">{s.name}</h3>
              <p className="serviceRow__summary">{s.summary}</p>
              <p className="serviceRow__detail">{s.detail}</p>
              <span className="serviceRow__meta mono">{s.meta}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export default ServicesList;
