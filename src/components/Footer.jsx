import { NAV_LINKS } from "../app/constants/navLinks";
import { FACILITIES } from "../app/constants/facilities";
import { PHONE_NUMBER } from "../app/constants/phoneNumber";
import { Link } from "../app/router/Link";
import { ArrowUpIcon, PhoneIcon } from "./Icons";
import Button from "./ui/Button";
import { Container, Eyebrow, HULL_PLATE, MICRO_SM } from "./ui/Layout";
import Logo from "./ui/Logo";
import { currentYear } from "../lib/localTime";

/* footer: ft1-mast-headed */

// The wordmark and its line anchor the band, with the destinations on one row
// beside them and the two yards below. There is no column-per-category index,
// because every destination this site has fits on one line and a column index
// would pad four of them out into a grid.
//
// Three bands: a light contact band, then the dark main band and the dark bar,
// with the shared rail mounted below them. The footer paints nothing itself;
// each band carries its own surface.

const FOOTER_CREDENTIALS = [
  "Coastal Texas marine operator",
  "Gulf Intracoastal Waterway access",
  "Houston Ship Channel partner",
];

const FOOTER_LEGAL = [
  { label: "Privacy", to: "/privacy" },
  { label: "Terms", to: "/terms" },
];

const FOOTER_HOURS = [
  { label: "Office", value: "Mon-Fri · 7a-5p CT" },
  { label: "Shore Crew", value: "24 / 7 · On-call answered" },
];

function Footer({ children }) {
  const year = currentYear();
  const phoneDigits = PHONE_NUMBER.replace(/[^0-9]/g, "");
  const phoneHref = `tel:1${phoneDigits}`;

  // The document scrolls, not a container, so this is the whole of it. Reduced
  // motion is honoured by the root's own scroll-behavior rather than by a
  // second check here.
  const toTop = () => window.scrollTo({ top: 0, left: 0 });

  return (
    <footer id="footer" className="relative text-secondary">
      <div data-surface="light" className="relative">
        <div className="border-b border-border bg-bg py-9">
          <Container>
            <div className="grid grid-cols-[minmax(0,1fr)] items-end gap-8 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:gap-9">
              <div className="flex flex-col gap-4">
                <Eyebrow strong>Contact</Eyebrow>
                <h2 className="text-h2 text-primary">Speak to the office.</h2>
                <p className="max-w-prose-tight text-lead text-secondary">
                  Direct line to the yard for barge fleeting, marine services
                  and long-term dock leasing across the upper Texas Gulf Coast.
                </p>
              </div>

              <div className="flex flex-col items-stretch gap-5 md:items-start">
                <div className="flex w-full flex-col gap-1 border-t border-border py-3">
                  <span
                    className={`font-body text-xs font-semibold text-faint`}
                  >
                    Direct Line
                  </span>
                  <a
                    href={phoneHref}
                    className="inline-flex items-center gap-3 whitespace-nowrap font-condensed text-h3 uppercase tabular-nums text-primary no-underline transition-[color,background-color,border-color,transform,opacity] duration-quick ease-settle hover:text-highlight focus-visible:text-highlight focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-highlight-ring active:opacity-70"
                  >
                    <span
                      aria-hidden="true"
                      className="inline-flex h-control-sm w-control-sm items-center justify-center border border-border text-highlight"
                    >
                      <PhoneIcon />
                    </span>
                    {PHONE_NUMBER}
                  </a>
                </div>

                <ul
                  aria-label="Hours"
                  className="m-0 flex list-none flex-col gap-2 p-0"
                >
                  {FOOTER_HOURS.map((h) => (
                    <li
                      key={h.label}
                      className="grid grid-cols-[minmax(0,1fr)] gap-1 xs:grid-cols-[theme(spacing.label)_minmax(0,1fr)] xs:items-baseline xs:gap-3"
                    >
                      <span className={`${MICRO_SM} text-faint`}>
                        {h.label}
                      </span>
                      <span className="font-body text-sm text-secondary">
                        {h.value}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button variant="solid" to="/contact" className="self-stretch">
                  Get a Written Quote
                </Button>
              </div>
            </div>
          </Container>
        </div>
      </div>

      {/* The seam between the paper band above and the hull band below. Two
          surfaces meeting with nothing drawn between them read as a rendering
          fault rather than as two bands. */}
      <div
        data-surface="dark"
        className={`relative border-t border-border pb-9 pt-10 ${HULL_PLATE}`}
      >
        <Container>
          <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-9 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,2.6fr)] xl:gap-10">
            <div className="flex flex-col items-start gap-5">
              <Link
                to="/"
                aria-label="Dickinson Bayou Fleeting, Home"
                className="inline-flex transition-transform duration-settle ease-settle hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-highlight motion-reduce:transition-none active:opacity-70"
              >
                <Logo
                  tone="White"
                  sizes="(max-width: 1000px) 240px, 320px"
                  className="h-footer-logo"
                />
              </Link>

              <p className="max-w-prose-tight text-md leading-relaxed text-secondary">
                Coastal barge fleeting, marine services, mooring and long-term
                waterfront dock leasing on the upper Texas Gulf Coast.
              </p>

              <ul
                aria-label="Capabilities"
                className="relative m-0 flex w-full list-none flex-wrap gap-0 pt-px before:absolute before:left-0 before:right-0 before:top-0 before:h-px before:bg-hairline before:content-['']"
              >
                {FOOTER_CREDENTIALS.map((c) => (
                  <li
                    key={c}
                    className={`${MICRO_SM} mr-6 inline-flex items-center py-3 font-normal text-secondary`}
                  >
                    {c}
                  </li>
                ))}
              </ul>
            </div>

            {/* The band the wordmark anchors: destinations, then the yards. */}
            <div className="flex min-w-0 flex-col gap-7">
              {/* One row of destinations, not a column of them. */}
              <nav
                aria-label="Pages"
                className="flex flex-wrap items-center gap-x-6 gap-y-2"
              >
                {NAV_LINKS.map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    className="inline-flex min-h-control-sm min-w-control-sm items-center font-body text-sm font-medium text-secondary no-underline transition-[color,transform] duration-quick ease-settle hover:text-primary focus-visible:text-primary focus-visible:outline-none active:opacity-70"
                  >
                    {l.label}
                  </Link>
                ))}
              </nav>

              <ul
                aria-label="Facilities"
                className="m-0 grid list-none grid-cols-[minmax(0,1fr)] gap-6 border-t border-hairline p-0 pt-6 xs:grid-cols-2"
              >
                {FACILITIES.map((facility, idx) => (
                  <li
                    key={facility.id}
                    className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-1 border-b border-hairline pb-3 last:border-b-0"
                  >
                    <span
                      className={`${MICRO_SM} row-span-4 self-start pt-1 text-highlight`}
                    >
                      F-{String(idx + 1).padStart(2, "0")}
                    </span>
                    <span className="font-body text-base font-semibold text-primary">
                      {facility.name}
                    </span>
                    <span className="font-body text-3xs font-semibold text-faint">
                      {facility.region.split(" · ")[0]}
                    </span>
                    {/* Address and phone are the same block, so the name, the
                        street and the number a directory reads sit together
                        rather than a column apart. The two lines sit flush: the
                        phone link carries its own tap-target height, which is
                        what holds them apart. */}
                    <address className="flex flex-col items-start gap-0 not-italic">
                      <a
                        href={`https://maps.google.com/?q=${encodeURIComponent(facility.address)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex min-h-control-sm items-center font-body text-sm text-secondary no-underline transition-[color,background-color,border-color,transform,opacity] duration-quick ease-settle hover:text-highlight focus-visible:text-highlight focus-visible:outline-none active:opacity-70"
                      >
                        {facility.address}
                      </a>
                      <a
                        href={`tel:1${facility.phone.replace(/[^0-9]/g, "")}`}
                        className="inline-flex min-h-control-sm items-center font-mono text-xs font-medium tabular-nums text-faint no-underline transition-[color,background-color,border-color,transform,opacity] duration-quick ease-settle hover:text-highlight focus-visible:text-highlight focus-visible:outline-none active:opacity-70"
                      >
                        {facility.phone}
                      </a>
                    </address>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div
            aria-label="Coverage"
            className="mt-9 flex flex-wrap items-baseline gap-3 border-t border-hairline px-0 pb-0 pt-4"
          >
            <span className={`${MICRO_SM} text-highlight`}>Coverage</span>
            <span className="font-body text-sm text-secondary">
              Galveston Bay · Houston Ship Channel · Gulf Intracoastal Waterway
              · Brazoria · Galveston · Harris
            </span>
          </div>
        </Container>
      </div>

      <div data-surface="dark" className="border-t border-hairline">
        <div className="mx-auto flex w-full max-w-container flex-col items-start justify-between gap-3 px-gutter py-5 xs:flex-row xs:items-center xs:gap-4">
          <div className="font-body text-sm text-faint">
            © {year} · Dickinson Bayou Fleeting · Texas Gulf Coast
          </div>
          <ul
            aria-label="Legal"
            className="m-0 flex list-none flex-wrap items-center gap-5 p-0"
          >
            {FOOTER_LEGAL.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="inline-flex min-h-control-sm min-w-control-sm items-center justify-center font-body text-xs font-semibold text-faint no-underline transition-[color,background-color,border-color,transform,opacity] duration-quick ease-settle hover:text-highlight focus-visible:text-highlight focus-visible:shadow-focus focus-visible:outline-none active:opacity-70"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={toTop}
            className="inline-flex min-h-control-sm items-center gap-2 rounded-sm px-3 py-2 font-body text-sm font-medium text-secondary shadow-edge transition-colors duration-quick ease-settle hover:bg-layer-2 hover:text-primary focus-visible:shadow-focus focus-visible:outline-none active:opacity-70"
          >
            <ArrowUpIcon size={12} />
            Back to Top
          </button>
        </div>
      </div>

      {children}
    </footer>
  );
}

export default Footer;
