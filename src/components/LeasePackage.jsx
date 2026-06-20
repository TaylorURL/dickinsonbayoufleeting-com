import { useState } from "react";
import "./styles/LeasePackage.css";
import { LEASE_OPTIONS } from "../app/constants/leaseOptions";

function LeasePackage() {
  const [locationId, setLocationId] = useState(LEASE_OPTIONS[0].id);
  const loc = LEASE_OPTIONS.find((l) => l.id === locationId);
  const openInquiry = (e) => {
    e.preventDefault();
    window.dispatchEvent(new Event("inquiry:open"));
  };
  return (
    <section className="rate section" aria-label="Pricing" id="rates">
      <div className="container">
        <div className="section__head">
          <p className="eyebrow">Lease Rates</p>
          <h2 className="section__title">
            Coastal Barge Fleeting &amp; Dock Lease Options
          </h2>
          <p className="section__subtitle">
            Fixed monthly rates for five-acre coastal waterfront fleeting yards
            on Galveston Bay and the Gulf Intracoastal Waterway. Select a
            facility to view its barge fleeting, marine services and dock lease
            details.
          </p>
        </div>
        <div className="estimator" aria-label="Lease options selector">
          <div className="estimator__head">
            <span className="estimator__headLabel">Facility</span>
            <div
              className="leaseSwitch"
              role="tablist"
              aria-label="Select facility"
            >
              {LEASE_OPTIONS.map((l) => (
                <button
                  key={l.id}
                  role="tab"
                  aria-selected={l.id === locationId}
                  className={`leaseSwitch__btn${l.id === locationId ? " leaseSwitch__btn--active" : ""}`}
                  onClick={() => setLocationId(l.id)}
                >
                  {l.name}
                </button>
              ))}
            </div>
          </div>
          <div className="estimator__result" aria-live="polite">
            <div className="estimator__priceBlock">
              <p className="estimator__label">Monthly Lease</p>
              <p className="estimator__priceRow">
                <span className="estimator__currency">$</span>
                <span className="estimator__figure tabular">
                  {loc.price.toLocaleString()}
                </span>
                <span className="estimator__period">/ month</span>
              </p>
              <p className="estimator__caption">
                {loc.acreage} waterfront · {loc.subtitle}
              </p>
            </div>
            <div className="estimator__featuresBlock">
              <p className="estimator__featuresLabel">Included with the lease</p>
              <ul className="leaseFeatureList">
                {loc.features.map((feature) => (
                  <li key={feature} className="leaseFeatureList__item">
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <a
              className="btn btn--primary btn--block"
              href="#contact"
              onClick={openInquiry}
            >
              Start Lease Inquiry
            </a>
            <p className="estimator__assurance">
              No hidden fees · Long-term agreements · Direct facility access
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LeasePackage;
