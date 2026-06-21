import { useEffect, useRef, useState } from "react";
import "./styles/Location.css";
import { FACILITIES } from "../app/constants/facilities";
import { useReveal } from "../app/hooks/useReveal";

const buildEmbedSrc = (address) =>
  `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;

const buildMapsHref = (address) =>
  `https://maps.google.com/?q=${encodeURIComponent(address)}`;

const buildTelHref = (phone) => `tel:1${phone.replace(/[^0-9]/g, "")}`;

/* Defer the (heavy) Google Maps iframes until the section enters the
 * viewport. Both maps then mount once and stay mounted — no rotation,
 * no swap, no toggle, no animation driving layout. Pure static cards. */
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
      { rootMargin: "240px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [mounted, rootRef]);
  return mounted;
}

function FacilityCard({ facility, index, mapsMounted }) {
  const openInquiry = (e) => {
    e.preventDefault();
    window.dispatchEvent(new Event("inquiry:open"));
  };
  return (
    <article className="facCard" aria-label={facility.name}>
      <header className="facCard__header">
        <span className="facCard__code mono">
          F-{String(index + 1).padStart(2, "0")}
        </span>
        <span className="facCard__tag mono">
          <span className="signalDot" aria-hidden="true" />
          On-site crew
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
          <dd className="facCard__specValue mono tabular">{facility.acreage}</dd>
        </div>
      </dl>

      <div className="facCard__mapWrap">
        <span className="facCard__mapTickTL" aria-hidden="true" />
        <span className="facCard__mapTickTR" aria-hidden="true" />
        <span className="facCard__mapTickBL" aria-hidden="true" />
        <span className="facCard__mapTickBR" aria-hidden="true" />
        {mapsMounted ? (
          <iframe
            title={`Map of Dickinson Bayou Fleeting ${facility.name} — ${facility.address}`}
            className="facCard__map"
            loading="lazy"
            allowFullScreen
            src={buildEmbedSrc(facility.address)}
          />
        ) : (
          <div className="facCard__mapPlaceholder" aria-hidden="true">
            <span className="facCard__mapPlaceholderTag mono">
              Loading map · {facility.shortName}
            </span>
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
        <a
          className="btn btn--primary"
          href="#contact"
          onClick={openInquiry}
        >
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
            San Leon sits on Galveston Bay near Dickinson and Texas City;
            Freeport sits on the Gulf Intracoastal Waterway south of Houston.
            One desk dispatches both — addresses, direct lines and live maps
            for each yard below.
          </p>
        </div>

        <div
          className="location__grid reveal-on-scroll"
          ref={bodyRef}
          aria-label="Facility roster"
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
