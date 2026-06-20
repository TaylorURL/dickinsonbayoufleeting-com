import { useState } from "react";
import "./styles/Location.css";
import { FACILITIES } from "../app/constants/facilities";
import { useAutoCycle } from "../app/hooks/useAutoCycle";
import { useReveal } from "../app/hooks/useReveal";

const FACILITY_IDS = FACILITIES.map((f) => f.id);
const AUTO_CYCLE_MS = 6000;

const FACILITY_MAP_SRC = Object.fromEntries(
  FACILITIES.map((f) => [
    f.id,
    `https://www.google.com/maps?q=${encodeURIComponent(f.address)}&output=embed`,
  ]),
);

const buildMapsHref = (address) =>
  `https://maps.google.com/?q=${encodeURIComponent(address)}`;

function Location() {
  const [locked, setLocked] = useState(false);
  const [active, setActive] = useAutoCycle(FACILITY_IDS, AUTO_CYCLE_MS, locked);
  const headRef = useReveal();
  const bodyRef = useReveal();
  const loc = FACILITIES.find((f) => f.id === active) || FACILITIES[0];
  const openInquiry = (e) => {
    e.preventDefault();
    window.dispatchEvent(new Event("inquiry:open"));
  };
  return (
    <section
      className="location section"
      data-surface="dark"
      aria-label="Location"
      id="location"
    >
      <div className="container">
        <div className="section__head reveal-on-scroll" ref={headRef}>
          <p className="eyebrow eyebrow--strong mono">Facilities</p>
          <h2 className="section__title">
            Two yards, one operations desk.
          </h2>
          <p className="section__subtitle">
            San Leon sits on Galveston Bay near Dickinson and Texas City;
            Freeport sits on the Gulf Intracoastal Waterway south of Houston.
            Pick a facility for address, contact and a live map.
          </p>
        </div>

        <div className="location__body reveal-on-scroll" ref={bodyRef}>
          <div className="location__col">
            <ul className="location__list" aria-label="Available locations">
              {FACILITIES.map((f, idx) => {
                const activeCard = f.id === active;
                return (
                  <li
                    key={f.id}
                    className={`locCard${activeCard ? " locCard--active" : ""}`}
                  >
                    <button
                      className="locCard__main"
                      aria-expanded={activeCard}
                      onClick={() => {
                        setActive(f.id);
                        setLocked(true);
                      }}
                    >
                      <span className="locCard__index mono">
                        F-{String(idx + 1).padStart(2, "0")}
                      </span>
                      <span className="locCard__heading">
                        <span className="locCard__region mono">{f.region}</span>
                        <span className="locCard__name">{f.name}</span>
                        <span className="locCard__address">{f.address}</span>
                      </span>
                      <span
                        className="locCard__chevron"
                        aria-hidden="true"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          width="14"
                          height="14"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="square"
                          strokeLinejoin="miter"
                        >
                          <path d="M5 12h14M13 6l6 6-6 6" />
                        </svg>
                      </span>
                    </button>
                    {activeCard && (
                      <div className="locCard__detail">
                        <div className="locCard__rows">
                          <div className="locCard__row">
                            <span className="locCard__label mono">Acreage</span>
                            <span className="locCard__value tabular">
                              {f.acreage}
                            </span>
                          </div>
                          <div className="locCard__row">
                            <span className="locCard__label mono">Direct Line</span>
                            <span className="locCard__value mono tabular">
                              {f.phone}
                            </span>
                          </div>
                        </div>
                        <div className="locCard__actions">
                          <a
                            className="btn btn--inline"
                            href={buildMapsHref(f.address)}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Open in Maps
                          </a>
                          <a
                            className="btn btn--inline"
                            href={`tel:1${f.phone.replace(/[^0-9]/g, "")}`}
                          >
                            Call Facility
                          </a>
                          <a
                            className="btn btn--primary"
                            href="#contact"
                            onClick={openInquiry}
                          >
                            Lease Inquiry
                          </a>
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="location__mapWrap">
            <div className="location__mapHeader">
              <span className="location__mapTag mono">
                <span className="location__mapDot" aria-hidden="true" />
                {loc.shortName} facility
              </span>
              <span className="location__mapAddress mono">{loc.address}</span>
            </div>
            <div className="location__mapFrame">
              {FACILITIES.map((f) => {
                const isActive = f.id === active;
                return (
                  <iframe
                    key={f.id}
                    title={`Map of Dickinson Bayou Fleeting ${f.name} — ${f.address}`}
                    className={`location__map${isActive ? " location__map--active" : ""}`}
                    loading="lazy"
                    allowFullScreen
                    src={FACILITY_MAP_SRC[f.id]}
                    aria-hidden={!isActive}
                    tabIndex={isActive ? 0 : -1}
                  />
                );
              })}
              <span className="location__mapTickTL" aria-hidden="true" />
              <span className="location__mapTickTR" aria-hidden="true" />
              <span className="location__mapTickBL" aria-hidden="true" />
              <span className="location__mapTickBR" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Location;
