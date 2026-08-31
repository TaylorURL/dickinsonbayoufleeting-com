import { useState } from "react";
import { LEASE_OPTIONS } from "../app/constants/leaseOptions";
import Button from "./ui/Button";
import { BAND, Container, MICRO, Section, SectionHead } from "./ui/Layout";
import { Reveal, rise } from "./ui/Reveal";

// Written out rather than built from the index: Tailwind reads these files as
// text, so a class name assembled at runtime is a class name it never sees.
// The tick beside the selected facility, laid out at its full run and scaled
// from nothing so the mark arrives without the row moving.
const SWITCH_TICK =
  "before:absolute before:-left-2 before:top-1/2 before:h-accent before:w-tick before:origin-left before:-translate-y-1/2 before:bg-highlight before:transition-transform before:duration-settle before:ease-swell before:content-['']";

function LeasePackage() {
  const [locationId, setLocationId] = useState(LEASE_OPTIONS[0].id);
  const loc = LEASE_OPTIONS.find((l) => l.id === locationId);

  const openInquiry = (e) => {
    e.preventDefault();
    window.dispatchEvent(new Event("inquiry:open"));
  };

  return (
    <Section surface="light" id="rates" aria-label="Pricing">
      <Container className={BAND}>
        <Reveal>
          <SectionHead
            eyebrow="Lease rates"
            title="Coastal barge fleeting & dock lease options."
            subtitle="Fixed monthly rates for five-acre waterfront yards on Galveston Bay and the Gulf Intracoastal Waterway. Pick a facility to see what is included."
          />
        </Reveal>

        <Reveal
          aria-label="Lease Options Selector"
          className="relative grid grid-cols-[minmax(0,1fr)] gap-8 border-t border-border pt-8 before:absolute before:-top-px before:left-0 before:h-accent before:w-rule-long before:bg-highlight before:content-[''] lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)] lg:gap-9"
        >
          <div
            role="tablist"
            aria-label="Select Facility"
            className="flex flex-col gap-4 self-start lg:sticky lg:top-[calc(theme(spacing.nav)+theme(spacing.6))]"
          >
            <span className={`${MICRO} text-faint`}>Facility</span>
            {/* Rows are separated by their own hairline, not by space. */}
            <div className="flex flex-col gap-0 border-t border-border">
              {LEASE_OPTIONS.map((l, idx) => {
                const active = l.id === locationId;
                return (
                  <button
                    key={l.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setLocationId(l.id)}
                    className={`group relative grid min-h-control select-none appearance-none grid-cols-[auto_minmax(0,1fr)] items-center gap-4 border-0 border-b border-hairline bg-transparent py-5 font-body transition-[color,transform] duration-quick ease-settle hover:text-primary focus-visible:text-primary focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-highlight-ring active:scale-[0.99] motion-reduce:before:transition-none ${SWITCH_TICK} ${
                      active
                        ? "text-primary before:scale-x-100"
                        : "text-secondary before:scale-x-0"
                    }`}
                  >
                    <span
                      className={`font-mono text-xs font-medium tracking-control transition-colors duration-quick ease-settle ${
                        active ? "text-highlight" : "text-muted"
                      }`}
                    >
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <span className="select-none text-left font-condensed text-xl font-semibold uppercase tracking-normal">
                      {l.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div
            aria-live="polite"
            className="grid grid-cols-[minmax(0,1fr)] items-start gap-7 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-x-9 lg:gap-y-8"
          >
            <div className="flex flex-col gap-5">
              <p className={`${MICRO} text-faint`}>MO/USD · Monthly Lease</p>
              <p
                key={loc.id}
                className="flex animate-rise items-baseline gap-2 motion-reduce:animate-none"
              >
                <span className="self-start pt-2 font-condensed text-h4 font-semibold leading-none text-faint">
                  $
                </span>
                <span className="font-condensed text-figure-sm tabular-nums text-primary xs:text-figure">
                  {loc.price.toLocaleString()}
                </span>
                <span className={`${MICRO} ml-2 text-sm text-faint`}>/ MO</span>
              </p>
              <p className="max-w-prose border-t border-hairline pt-3 font-body text-sm tracking-normal text-secondary">
                {loc.acreage} · {loc.subtitle}
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <p className={`${MICRO} text-faint`}>Included with the Lease</p>
              {/* Keyed on the facility so the list re-enters when the reader
                  changes it, which is what says the panel answered. */}
              <ul
                key={loc.id}
                className="relative m-0 flex list-none flex-col gap-0 pb-1 pt-px before:absolute before:left-0 before:right-0 before:top-0 before:h-px before:bg-hairline before:content-['']"
              >
                {loc.included.map((feature, idx) => (
                  <li
                    key={feature}
                    className={`relative grid ${rise(Math.min(idx + 1, 4))} grid-cols-[theme(spacing[control-sm])_minmax(0,1fr)] items-baseline gap-4 py-4 transition-transform duration-settle ease-settle before:absolute before:bottom-0 before:left-0 before:right-0 before:h-px before:bg-hairline before:content-[''] hover:translate-x-2 motion-reduce:animate-none motion-reduce:transition-none`}
                  >
                    <span className="font-mono text-xs font-medium tracking-control text-accent">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <span className="font-body text-md leading-normal text-secondary">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-full flex flex-col gap-3 border-t border-border py-5">
              <Button
                variant="solid"
                block
                href="#contact"
                onClick={openInquiry}
              >
                Start Lease Inquiry
              </Button>
              <p className="max-w-prose font-body text-sm tracking-normal text-faint">
                No hidden fees · Long-term agreements · Direct facility access
              </p>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}

export default LeasePackage;
