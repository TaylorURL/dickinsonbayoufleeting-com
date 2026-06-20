import { useState } from "react";
import "./styles/LeasePackage.css";
import { LEASE_OPTIONS } from "../app/constants/leaseOptions";
import { useReveal } from "../app/hooks/useReveal";

function LeasePackage() {
  const [locationId, setLocationId] = useState(LEASE_OPTIONS[0].id);
  const loc = LEASE_OPTIONS.find((l) => l.id === locationId);
  const headRef = useReveal();
  const estimatorRef = useReveal();
  const openInquiry = (e) => {
    e.preventDefault();
    window.dispatchEvent(new Event("inquiry:open"));
  };
  return (
    <section
      className="rate section"
      data-surface="light"
      aria-label="Pricing"
      id="rates"
    >
      <div className="container">
        <div className="section__head reveal-on-scroll" ref={headRef}>
          <p className="eyebrow eyebrow--strong mono">Lease rates</p>
          <h2 className="section__title">
            Coastal barge fleeting &amp; dock lease options.
          </h2>
          <p className="section__subtitle">
            Fixed monthly rates for five-acre coastal waterfront fleeting yards
            on Galveston Bay and the Gulf Intracoastal Waterway. Pick a facility
            below to see what is included.
          </p>
        </div>

        <div className="estimator reveal-on-scroll" aria-label="Lease options selector" ref={estimatorRef}>
          <div
            className="estimator__switch"
            role="tablist"
            aria-label="Select facility"
          >
            <span className="estimator__switchLabel mono">Facility</span>
            <div className="leaseSwitch">
              {LEASE_OPTIONS.map((l, idx) => (
                <button
                  key={l.id}
                  role="tab"
                  aria-selected={l.id === locationId}
                  className={`leaseSwitch__btn${l.id === locationId ? " leaseSwitch__btn--active" : ""}`}
                  onClick={() => setLocationId(l.id)}
                >
                  <span className="leaseSwitch__btnIndex mono">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <span className="leaseSwitch__btnName">{l.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="estimator__result" aria-live="polite">
            <div className="estimator__priceCol">
              <p className="estimator__priceLabel mono">
                MO/USD — Monthly Lease
              </p>
              <p className="estimator__priceRow">
                <span className="estimator__currency">$</span>
                <span className="estimator__figure tabular">
                  {loc.price.toLocaleString()}
                </span>
                <span className="estimator__period mono">/ MO</span>
              </p>
              <p className="estimator__caption mono">
                {loc.acreage} · {loc.subtitle}
              </p>
            </div>

            <div className="estimator__features">
              <p className="estimator__featuresLabel mono">
                ◇ Included with the lease
              </p>
              <ul className="leaseFeatureList">
                {loc.features.map((feature, idx) => (
                  <li key={feature} className="leaseFeatureList__item">
                    <span className="leaseFeatureList__idx mono">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <span className="leaseFeatureList__text">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="estimator__cta">
              <a
                className="btn btn--primary btn--block"
                href="#contact"
                onClick={openInquiry}
              >
                Start Lease Inquiry
              </a>
              <p className="estimator__assurance mono">
                No hidden fees · Long-term agreements · Direct facility access
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LeasePackage;
