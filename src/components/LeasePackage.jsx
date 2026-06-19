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
            Coastal Barge Fleeting, Marine Services & Dock Lease Options
          </h2>
          <p className="section__subtitle">
            Fixed monthly rates for five-acre coastal waterfront fleeting yards
            on Galveston Bay and the Gulf Intracoastal Waterway. Select a
            facility to view its monthly barge fleeting, marine services and
            dock lease details.
          </p>
        </div>
        <div className="estimator" aria-label="Lease options selector">
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
          <div className="estimator__result" aria-live="polite">
            <p className="estimator__label">Monthly Lease</p>
            <p className="estimator__priceRow">
              <span className="estimator__figure">
                ${loc.price.toLocaleString()}
              </span>
              <span className="estimator__period">/ month</span>
            </p>
            <p className="estimator__caption">
              {loc.acreage} waterfront · {loc.subtitle}
            </p>
            <ul className="leaseFeatureList">
              {loc.features.map((feature) => (
                <li key={feature} className="leaseFeatureList__item">
                  {feature}
                </li>
              ))}
            </ul>
            <a
              className="btn btn--primary btn--block"
              href="#contact"
              onClick={openInquiry}
            >
              Start Lease Inquiry
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LeasePackage;
