import { useCallback, useEffect, useState } from "react";
import "./styles/Location.css";
import { FACILITIES } from "../app/constants/facilities";
import { useReveal } from "../app/hooks/useReveal";

const buildEmbedSrc = (address) =>
  `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;

const buildMapsHref = (address) =>
  `https://maps.google.com/?q=${encodeURIComponent(address)}`;

const buildTelHref = (phone) => `tel:1${phone.replace(/[^0-9]/g, "")}`;

function Location() {
  const [activeId, setActiveId] = useState(FACILITIES[0].id);
  /* Mount only the default map immediately; idle-mount the rest so the
   * initial paint isn't competing with two Google Maps iframes loading
   * in parallel. The click handler also force-mounts, so a click before
   * the idle callback fires is still instant. Once mounted, iframes
   * stay mounted forever — swap is then a visibility toggle, never a
   * remount or network refetch. */
  const [mountedIds, setMountedIds] = useState(
    () => new Set([FACILITIES[0].id]),
  );
  const headRef = useReveal();
  const bodyRef = useReveal();

  const activeFacility =
    FACILITIES.find((f) => f.id === activeId) || FACILITIES[0];

  useEffect(() => {
    const mountAll = () => {
      setMountedIds(new Set(FACILITIES.map((f) => f.id)));
    };
    if (typeof window === "undefined") return;
    if ("requestIdleCallback" in window) {
      const handle = window.requestIdleCallback(mountAll, { timeout: 4000 });
      return () => window.cancelIdleCallback?.(handle);
    }
    const handle = window.setTimeout(mountAll, 1500);
    return () => window.clearTimeout(handle);
  }, []);

  const selectFacility = useCallback((id) => {
    setActiveId(id);
    setMountedIds((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  const openInquiry = (e) => {
    e.preventDefault();
    window.dispatchEvent(new Event("inquiry:open"));
  };

  return (
    <section
      className="location section"
      data-surface="dark"
      aria-label="Facilities"
      id="location"
    >
      <div className="container">
        <div className="section__head reveal-on-scroll" ref={headRef}>
          <p className="eyebrow eyebrow--strong mono">Facilities</p>
          <h2 className="section__title">Two yards, one operations desk.</h2>
          <p className="section__subtitle">
            San Leon sits on Galveston Bay near Dickinson and Texas City;
            Freeport sits on the Gulf Intracoastal Waterway south of Houston.
            One desk dispatches both — pick a yard for its address, direct
            line, and live map.
          </p>
        </div>

        <div className="location__body reveal-on-scroll" ref={bodyRef}>
          <div className="location__col">
            <div
              className="locSwitch"
              role="tablist"
              aria-label="Select facility"
            >
              {FACILITIES.map((f, idx) => {
                const active = f.id === activeId;
                return (
                  <button
                    key={f.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    aria-controls="location-detail"
                    id={`location-tab-${f.id}`}
                    className={`locSwitch__btn${active ? " locSwitch__btn--active" : ""}`}
                    onClick={() => selectFacility(f.id)}
                  >
                    <span className="locSwitch__idx mono">
                      F-{String(idx + 1).padStart(2, "0")}
                    </span>
                    <span className="locSwitch__name">{f.shortName}</span>
                  </button>
                );
              })}
            </div>

            <div
              id="location-detail"
              role="tabpanel"
              aria-labelledby={`location-tab-${activeFacility.id}`}
              className="location__detail"
            >
              <p className="location__region mono">{activeFacility.region}</p>
              <h3 className="location__name">{activeFacility.name}</h3>
              <p className="location__address">{activeFacility.address}</p>

              <dl className="location__specs">
                <div className="location__spec">
                  <dt className="location__specLabel mono">Direct Line</dt>
                  <dd className="location__specValue mono tabular">
                    {activeFacility.phone}
                  </dd>
                </div>
                <div className="location__spec">
                  <dt className="location__specLabel mono">Acreage</dt>
                  <dd className="location__specValue mono tabular">
                    {activeFacility.acreage}
                  </dd>
                </div>
              </dl>

              <div className="location__actions">
                <a
                  className="btn btn--inline"
                  href={buildMapsHref(activeFacility.address)}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open in Maps
                </a>
                <a
                  className="btn btn--inline"
                  href={buildTelHref(activeFacility.phone)}
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
          </div>

          <div className="location__mapWrap">
            <div className="location__mapHeader">
              <span className="location__mapTag mono">
                <span className="location__mapDot" aria-hidden="true" />
                {activeFacility.shortName} facility
              </span>
              <span className="location__mapAddress mono">
                {activeFacility.address}
              </span>
            </div>
            <div className="location__mapFrame">
              {FACILITIES.map((f) => {
                if (!mountedIds.has(f.id)) return null;
                const isActive = f.id === activeId;
                return (
                  <iframe
                    key={f.id}
                    title={`Map of Dickinson Bayou Fleeting ${f.name} — ${f.address}`}
                    className={`location__map${isActive ? " location__map--active" : ""}`}
                    loading="lazy"
                    allowFullScreen
                    src={buildEmbedSrc(f.address)}
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
