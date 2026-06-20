import { useState } from "react";
import "./styles/Location.css";
import { FACILITIES } from "../app/constants/facilities";
import { useAutoCycle } from "../app/hooks/useAutoCycle";
import { useReveal } from "../app/hooks/useReveal";

const FACILITY_IDS = FACILITIES.map((f) => f.id);
const AUTO_CYCLE_MS = 6000;

function Location() {
  const [locked, setLocked] = useState(false);
  const [active, setActive] = useAutoCycle(FACILITY_IDS, AUTO_CYCLE_MS, locked);
  const loc = FACILITIES.find((f) => f.id === active) || FACILITIES[0];
  const mapsHref = loc.coords
    ? `https://maps.google.com/?q=${loc.coords.lat},${loc.coords.lng}`
    : `https://maps.google.com/?q=${encodeURIComponent(loc.address)}`;
  const iframeSrc = loc.coords
    ? `https://www.google.com/maps?ll=${loc.coords.lat},${loc.coords.lng}&q=${loc.coords.lat},${loc.coords.lng}&z=15&output=embed`
    : `https://www.google.com/maps?q=${encodeURIComponent(loc.address)}&output=embed`;
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
        <div className="section__head">
          <p className="eyebrow eyebrow--strong mono">
            ◇ Section 04 — Facilities
          </p>
          <h2 className="section__title">
            Coastal barge fleeting &amp; marine terminal locations.
          </h2>
          <p className="section__subtitle">
            Two coastal upper Texas Gulf Coast marine terminal facilities — San
            Leon on Galveston Bay near Dickinson, Texas City and Houston, and
            Freeport on the Gulf Intracoastal Waterway. Physical site details
            and direct contact for barge fleeting, marine services and dock
            lease coordination.
          </p>
        </div>

        <div className="location__body">
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
                          {f.coords && (
                            <div className="locCard__row locCard__row--wide">
                              <span className="locCard__label mono">Coordinates</span>
                              <span className="locCard__value mono tabular">
                                {f.coords.lat.toFixed(4)}° N ·{" "}
                                {Math.abs(f.coords.lng).toFixed(4)}° W
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="locCard__actions">
                          <a
                            className="btn btn--inline"
                            href={mapsHref}
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
                FAC · {loc.shortName}
              </span>
              {loc.coords && (
                <span className="location__mapCoords mono">
                  {loc.coords.lat.toFixed(4)}° N ·{" "}
                  {Math.abs(loc.coords.lng).toFixed(4)}° W
                </span>
              )}
            </div>
            <div className="location__mapFrame">
              <iframe
                title={`Map of Dickinson Bayou Fleeting ${loc.name} — ${loc.address}`}
                className="location__map"
                loading="lazy"
                allowFullScreen
                src={iframeSrc}
              ></iframe>
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
