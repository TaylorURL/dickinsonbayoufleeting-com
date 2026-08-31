import { useEffect, useRef, useState } from "react";
import "./styles/Location.css";
import { FACILITIES } from "../app/constants/facilities";
import { useReveal } from "../app/hooks/useReveal";

const buildEmbedSrc = (address) =>
  `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;

const buildMapsHref = (address) =>
  `https://maps.google.com/?q=${encodeURIComponent(address)}`;

const buildTelHref = (phone) => `tel:1${phone.replace(/[^0-9]/g, "")}`;

// Google Maps iframes are heavy, so they stay unmounted until the section is in
// view. Once mounted they stay mounted — remounting them on scroll costs far
// more than keeping them around. The margin starts the fetch a screen-and-a-bit
// early, so the map is usually there before the section is.
const rootMargin = "240px 0px";

// How long the plate waits for the map host before it stops waiting and offers
// the address instead.
const MAP_TIMEOUT_MS = 8000;
function useDeferredMount(rootRef) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    if (mounted) return;
    const el = rootRef.current;
    if (!el) return;
    if (typeof window === "undefined") return;

    if (!("IntersectionObserver" in window)) {
      setMounted(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setMounted(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [mounted, rootRef]);
  return mounted;
}

function FacilityCard({ facility, index, mapsMounted }) {
  // The plate stays until the map has actually painted, not until the iframe
  // has been mounted: the map host can take a second to answer, and the box
  // would sit empty for that second. It also stops waiting: a map that never
  // arrives becomes an address and a link rather than a plate that says
  // "loading" for as long as the tab is open.
  const [mapState, setMapState] = useState("loading");
  // Once the plate has finished fading it leaves the tree rather than sitting
  // hidden over the map, so nothing downstream has to reason about a box that
  // is still there and no longer means anything.
  const [plateRetired, setPlateRetired] = useState(false);
  useEffect(() => {
    if (!mapsMounted || mapState !== "loading") return undefined;
    const timer = setTimeout(() => setMapState("failed"), MAP_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [mapsMounted, mapState]);
  const openInquiry = (e) => {
    e.preventDefault();
    window.dispatchEvent(new Event("inquiry:open"));
  };
  const mapTitle = `Map of Dickinson Bayou Fleeting ${facility.name}, ${facility.address}`;
  return (
    <article className="facCard" id={facility.id} aria-label={facility.name}>
      <header className="facCard__header">
        <span className="facCard__code mono">
          F-{String(index + 1).padStart(2, "0")}
        </span>
        <span className="facCard__tag mono">
          <span className="signalDot" aria-hidden="true" />
          On-Site Crew
        </span>
      </header>

      <div className="facCard__body">
        <p className="facCard__region mono">{facility.region}</p>
        <h3 className="facCard__name">{facility.name}</h3>
        <p className="facCard__address">{facility.address}</p>
      </div>

      <dl className="facCard__specs">
        <div className="facCard__spec">
          <dt className="facCard__specLabel mono">Direct Line</dt>
          <dd className="facCard__specValue mono tabular">{facility.phone}</dd>
        </div>
        <div className="facCard__spec">
          <dt className="facCard__specLabel mono">Acreage</dt>
          <dd className="facCard__specValue mono tabular">
            {facility.acreage}
          </dd>
        </div>
      </dl>

      <div className="facCard__mapWrap" aria-busy={mapState === "loading"}>
        {/* The wrap holds --map-height-sm, then --map-height from 901px, so the
            box is at its final size before the embed measures anything. */}
        <span className="facCard__mapTickTL" aria-hidden="true" />
        <span className="facCard__mapTickTR" aria-hidden="true" />
        <span className="facCard__mapTickBL" aria-hidden="true" />
        <span className="facCard__mapTickBR" aria-hidden="true" />
        {mapsMounted ? (
          <iframe
            title={mapTitle}
            className="facCard__map"
            loading="lazy"
            allowFullScreen
            src={buildEmbedSrc(facility.address)}
            onLoad={() => setMapState("ready")}
            onError={() => setMapState("failed")}
          />
        ) : null}
        {plateRetired ? null : (
          <div
            className="facCard__mapPlaceholder"
            data-state={mapState}
            aria-hidden={mapState === "ready"}
            onTransitionEnd={(e) => {
              if (e.propertyName === "opacity" && mapState === "ready") {
                setPlateRetired(true);
              }
            }}
          >
            {mapState === "failed" ? (
              <a
                className="facCard__mapFallback"
                href={buildMapsHref(facility.address)}
                target="_blank"
                rel="noreferrer"
              >
                <span className="facCard__mapFallbackAddr">
                  {facility.address}
                </span>
                <span className="facCard__mapPlaceholderTag mono">
                  Open in Maps
                </span>
              </a>
            ) : (
              <span className="facCard__mapPlaceholderTag mono">
                Loading map · {facility.shortName}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="facCard__actions">
        <a
          className="btn btn--inline"
          href={buildMapsHref(facility.address)}
          target="_blank"
          rel="noreferrer"
        >
          Open in Maps
        </a>
        <a className="btn btn--inline" href={buildTelHref(facility.phone)}>
          Call Facility
        </a>
        <a className="btn btn--solid" href="#contact" onClick={openInquiry}>
          Lease Inquiry
        </a>
      </div>
    </article>
  );
}

function Location() {
  const rootRef = useRef(null);
  const headRef = useReveal();
  const bodyRef = useReveal();
  const mapsMounted = useDeferredMount(rootRef);

  return (
    <section
      ref={rootRef}
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
            San Leon sits on Galveston Bay; Freeport sits on the Gulf
            Intracoastal Waterway south of Houston. One desk dispatches both.
          </p>
        </div>

        <div
          className="location__grid reveal-on-scroll"
          ref={bodyRef}
          aria-label="Facility Roster"
        >
          {FACILITIES.map((facility, idx) => (
            <FacilityCard
              key={facility.id}
              facility={facility}
              index={idx}
              mapsMounted={mapsMounted}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Location;
