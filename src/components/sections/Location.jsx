import { useEffect, useRef, useState } from "react";
import { FACILITIES } from "../../app/content/facilities";
import {
  buildEmbedSrc,
  buildMapsHref,
  telHref,
} from "../../app/content/phoneNumber";
import { openInquiry } from "../../app/openInquiry";
import Button from "../ui/Button";
import { CODE, Container, MICRO, Section, SectionHead } from "../ui/Layout";
import { Reveal } from "../ui/Reveal";

// Google Maps iframes are heavy, so they stay unmounted until the section is in
// view. Once mounted they stay mounted - remounting them on scroll costs far
// more than keeping them around. The margin starts the fetch a screen-and-a-bit
// early, so the map is usually there before the section is.
const rootMargin = "240px 0px";

// How long the plate waits for the map host before it stops waiting and offers
// the address instead.
const MAP_TIMEOUT_MS = 8000;

// One filter pass, applied once at mount. The light band lightens it, because
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

function FacilityCard({ facility, mapsMounted }) {
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

  const mapTitle = `Map of Dickinson Bayou Fleeting ${facility.name}, ${facility.address}`;

  return (
    <article
      id={facility.id}
      aria-label={facility.name}
      className="flex min-w-0 flex-col gap-5 rounded-md border border-border bg-surface p-6"
    >
      <header className="flex items-center justify-between gap-3 border-b border-border pb-[14px]">
        <span className={`${CODE} text-primary`}>{facility.code}</span>
        <span className={`${MICRO} text-faint`}>On-Site Crew</span>
      </header>

      <div className="flex flex-col gap-[6px]">
        <p className={`${CODE} m-0 text-faint`}>{facility.region}</p>
        <h3 className="m-0 text-h4 text-primary">{facility.name}</h3>
        <p className="m-0 font-body text-base text-secondary">
          {facility.address}
        </p>
      </div>

      {/* The two readings a caller compares yard to yard, both set in the mono
          face for that reason. */}
      <dl className="m-0 flex flex-wrap gap-x-6 gap-y-4 border-t border-border p-0 pt-[14px]">
        <div className="m-0 flex min-w-[160px] flex-1 flex-col gap-1">
          <dt className={`${MICRO} m-0 text-faint`}>Direct Line</dt>
          <dd className="m-0 whitespace-nowrap font-mono text-data tabular-nums text-primary">
            {facility.phone}
          </dd>
        </div>
        <div className="m-0 flex min-w-[160px] flex-1 flex-col gap-1">
          <dt className={`${MICRO} m-0 text-faint`}>Acreage</dt>
          <dd className="m-0 whitespace-nowrap font-mono text-data tabular-nums text-primary">
            {facility.acreage}
          </dd>
        </div>
      </dl>

      {/* The box holds its height before the embed measures anything, so the
          card is at its final size whether or not the map ever arrives. */}
      <div
        aria-busy={mapState === "loading"}
        className="relative h-map-sm overflow-hidden border border-border bg-bg-deep [min-height:var(--map-height-sm)]"
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
            className="visible absolute inset-0 z-raised flex items-center justify-center gap-0 bg-bg-deep text-faint opacity-100 transition-[opacity,visibility] duration-settle ease-settle data-[state=ready]:invisible data-[state=ready]:opacity-0 data-[state=ready]:delay-[0ms,280ms]"
          >
            {mapState === "failed" ? (
              <a
                href={buildMapsHref(facility.address)}
                target="_blank"
                rel="noreferrer"
                className="flex flex-col items-center gap-3 p-5 text-center text-secondary no-underline transition-colors duration-quick ease-settle hover:text-highlight focus-visible:shadow-focus focus-visible:outline-none"
              >
                <span className="font-body text-small">{facility.address}</span>
                <span className={CODE}>Open in Maps</span>
              </a>
            ) : (
              <span className={CODE}>Loading map · {facility.shortName}</span>
            )}
          </div>
        )}
      </div>

      <div className="mt-auto flex flex-wrap items-center justify-between gap-y-3 border-t border-border pt-4">
        <div className="flex min-w-[240px] items-center gap-3">
          <Button
            variant="inline"
            size="sm"
            href={buildMapsHref(facility.address)}
            target="_blank"
            rel="noreferrer"
          >
            Open in Maps
          </Button>
          <Button variant="inline" size="sm" href={telHref(facility.phone)}>
            Call Facility
          </Button>
        </div>
        <Button
          variant="primary"
          size="sm"
          href="#contact"
          onClick={openInquiry}
          className="min-w-[180px]"
        >
          Get Lease Terms
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
      <Container className="flex flex-col gap-7 md:gap-9">
        <Reveal>
          <SectionHead
            eyebrow="The yards"
            title="Two yards, one number."
            subtitle="Dickinson sits on Galveston Bay. Freeport sits on the Gulf Intracoastal Waterway, south of Houston. The same crew runs both."
          />
        </Reveal>

        <Reveal
          aria-label="Facility Roster"
          className="grid grid-cols-[minmax(0,1fr)] items-stretch gap-6 md:grid-cols-2"
        >
          {FACILITIES.map((facility) => (
            <FacilityCard
              key={facility.id}
              facility={facility}
              mapsMounted={mapsMounted}
            />
          ))}
        </Reveal>
      </Container>
    </Section>
  );
}

export default Location;
