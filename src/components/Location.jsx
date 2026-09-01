import { useEffect, useRef, useState } from "react";
import { FACILITIES } from "../app/constants/facilities";
import Button from "./ui/Button";
import {
  BAND,
  CORNER_TICK,
  Container,
  MICRO_SM,
  Section,
  SectionHead,
} from "./ui/Layout";
import { Reveal } from "./ui/Reveal";

const buildEmbedSrc = (address) =>
  `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;

const buildMapsHref = (address) =>
  `https://maps.google.com/?q=${encodeURIComponent(address)}`;

const buildTelHref = (phone) => `tel:1${phone.replace(/[^0-9]/g, "")}`;

// Google Maps iframes are heavy, so they stay unmounted until the section is in
// view. Once mounted they stay mounted - remounting them on scroll costs far
// more than keeping them around. The margin starts the fetch a screen-and-a-bit
// early, so the map is usually there before the section is.
const rootMargin = "240px 0px";

// How long the plate waits for the map host before it stops waiting and offers
// the address instead.
const MAP_TIMEOUT_MS = 8000;

// One filter pass, applied once at mount. The paper band lightens it, because
// the dark grade reads as a hole in a light card.
const MAP_GRADE =
  "[filter:grayscale(1)_brightness(0.58)_contrast(1.22)_sepia(0.06)_hue-rotate(-10deg)] [[data-surface='light']_&]:[filter:grayscale(0.85)_brightness(0.96)_contrast(1.05)]";

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
    <article
      id={facility.id}
      aria-label={facility.name}
      className="relative flex min-w-0 flex-col gap-5 border border-border bg-surface px-5 py-6 transition-[border-color,transform] duration-settle ease-settle hover:-translate-y-1 motion-reduce:transition-none xs:px-6 xs:py-7"
    >
      <header className="flex items-center justify-between gap-3 border-b border-hairline pb-4">
        <span className="font-mono text-xs font-medium uppercase tracking-label text-highlight">
          F-{String(index + 1).padStart(2, "0")}
        </span>
        <span className={`${MICRO_SM} text-faint`}>On-Site Crew</span>
      </header>

      <div className="flex flex-col gap-1">
        <p className={`${MICRO_SM} text-highlight`}>{facility.region}</p>
        <h3 className="font-condensed text-h5 font-bold uppercase tracking-normal text-primary">
          {facility.name}
        </h3>
        <p className="font-body text-base text-secondary">{facility.address}</p>
      </div>

      <dl className="m-0 grid grid-cols-[minmax(0,1fr)] gap-3 border-t border-hairline pt-4 xs:grid-cols-2 xs:gap-4">
        <div className="m-0 flex flex-col gap-1">
          <dt className={`${MICRO_SM} m-0 text-faint`}>Direct Line</dt>
          <dd className="m-0 whitespace-nowrap font-mono text-md tabular-nums text-primary">
            {facility.phone}
          </dd>
        </div>
        <div className="m-0 flex flex-col gap-1">
          <dt className={`${MICRO_SM} m-0 text-faint`}>Acreage</dt>
          <dd className="m-0 whitespace-nowrap font-mono text-md tabular-nums text-primary">
            {facility.acreage}
          </dd>
        </div>
      </dl>

      {/* The wrap holds its short height, then the tall one from the medium
          step, so the box is at its final size before the embed measures
          anything. */}
      <div
        aria-busy={mapState === "loading"}
        className="relative h-map-sm overflow-hidden border border-border bg-bg-deep bg-hull bg-hull-grid [min-height:var(--map-height-sm)] md:h-map md:[min-height:var(--map-height)]"
      >
        {mapsMounted ? (
          <iframe
            title={mapTitle}
            loading="lazy"
            allowFullScreen
            src={buildEmbedSrc(facility.address)}
            onLoad={() => setMapState("ready")}
            onError={() => setMapState("failed")}
            className={`absolute inset-0 z-base block h-full w-full animate-arrive border-0 motion-reduce:animate-none ${MAP_GRADE}`}
          />
        ) : null}

        {plateRetired ? null : (
          <div
            data-placeholder
            data-state={mapState}
            aria-hidden={mapState === "ready"}
            onTransitionEnd={(e) => {
              if (e.propertyName === "opacity" && mapState === "ready") {
                setPlateRetired(true);
              }
            }}
            className="visible absolute inset-0 z-raised flex items-center justify-center gap-0 bg-bg-deep bg-hull bg-hull-grid text-faint opacity-100 transition-[opacity,visibility] duration-settle ease-settle data-[state=ready]:invisible data-[state=ready]:opacity-0 data-[state=ready]:delay-[0ms,280ms]"
          >
            {mapState === "failed" ? (
              <a
                href={buildMapsHref(facility.address)}
                target="_blank"
                rel="noreferrer"
                className="flex flex-col items-center gap-3 p-5 text-center text-secondary no-underline transition-colors duration-quick ease-settle hover:text-highlight focus-visible:shadow-focus focus-visible:outline-none active:scale-[0.99]"
              >
                <span className="max-w-prose-tight font-body text-sm leading-normal">
                  {facility.address}
                </span>
                <span className="font-mono text-xs font-medium uppercase tracking-label">
                  Open in Maps
                </span>
              </a>
            ) : (
              <span className="font-mono text-xs font-medium uppercase tracking-label">
                Loading map · {facility.shortName}
              </span>
            )}
          </div>
        )}

        <span
          aria-hidden="true"
          className={`${CORNER_TICK} z-overlay left-2 top-2 border-l border-t border-highlight`}
        />
        <span
          aria-hidden="true"
          className={`${CORNER_TICK} z-overlay right-2 top-2 border-r border-t border-highlight`}
        />
        <span
          aria-hidden="true"
          className={`${CORNER_TICK} z-overlay bottom-2 left-2 border-b border-l border-highlight`}
        />
        <span
          aria-hidden="true"
          className={`${CORNER_TICK} z-overlay bottom-2 right-2 border-b border-r border-highlight`}
        />
      </div>

      <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-hairline pt-4">
        <Button
          variant="inline"
          href={buildMapsHref(facility.address)}
          target="_blank"
          rel="noreferrer"
        >
          Open in Maps
        </Button>
        <Button variant="inline" href={buildTelHref(facility.phone)}>
          Call Facility
        </Button>
        <Button
          variant="solid"
          href="#contact"
          onClick={openInquiry}
          className="w-full xs:ml-auto xs:w-auto"
        >
          Lease Inquiry
        </Button>
      </div>
    </article>
  );
}

// Both yards sit side by side as static cards, each with its own map and
// actions, rather than sharing one frame behind a tab switch. There is no
// state, no rotator and no transition timeline here: animating between two live
// Google Maps iframes pins the compositor on weaker devices.
function Location() {
  const rootRef = useRef(null);
  const mapsMounted = useDeferredMount(rootRef);

  return (
    <Section ref={rootRef} surface="dark" id="location" aria-label="Facilities">
      <Container className={BAND}>
        <Reveal>
          <SectionHead
            eyebrow="Facilities"
            title="Two yards, one number."
            subtitle="Dickinson sits on Galveston Bay. Freeport sits on the Gulf Intracoastal Waterway, south of Houston. The same crew runs both."
          />
        </Reveal>

        <Reveal
          aria-label="Facility Roster"
          className="relative grid grid-cols-[minmax(0,1fr)] items-stretch gap-6 border-t border-border pt-8 before:absolute before:-top-px before:left-0 before:h-accent before:w-rule-long before:bg-highlight before:content-[''] md:grid-cols-2 md:gap-7"
        >
          {FACILITIES.map((facility, idx) => (
            <FacilityCard
              key={facility.id}
              facility={facility}
              index={idx}
              mapsMounted={mapsMounted}
            />
          ))}
        </Reveal>
      </Container>
    </Section>
  );
}

export default Location;
