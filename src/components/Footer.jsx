import { NAV_LINKS } from "../app/constants/navLinks";
import { FACILITIES } from "../app/constants/facilities";
import { PHONE_NUMBER } from "../app/constants/phoneNumber";
import { Link } from "../app/router/Link";
import WaveDivider from "./WaveDivider";
import { ArrowUpIcon, PhoneIcon } from "./Icons";
import Button from "./ui/Button";
import { Container, Eyebrow, HULL_PLATE } from "./ui/Layout";

/* footer: ft1-mast-headed */

// The wordmark and its line anchor the band, with the destinations on one row
// beside them and the two yards below. There is no column-per-category index,
// because every destination this site has fits on one line and a column index
// would pad four of them out into a grid.
//
// Three bands: a light contact band, then the dark main band and the dark bar,
// with the shared rail mounted below them. The light band is why the footer
// opens with a wave, since the seam has to read as a waterline against whatever
// section sits above it. The footer paints nothing itself; each band carries
// its own surface.

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
  { label: "Operations Desk", value: "24 / 7 · On-call answered" },
];

const MICRO = "font-mono text-2xs font-medium uppercase tracking-label";

const LOGO_SRCSET = (tone) =>
  `/images/DBF-Logo-${tone}-120.png 120w, /images/DBF-Logo-${tone}-240.png 240w, /images/DBF-Logo-${tone}.png 500w`;

function Footer({ children }) {
  const year = new Date().getFullYear();
  const phoneDigits = PHONE_NUMBER.replace(/[^0-9]/g, "");
  const phoneHref = `tel:1${phoneDigits}`;

  return (
    <footer id="footer" className="relative text-secondary">
      {/* The wrapper holds the wave and the band together and carries no
          surface, so the wave is free to overhang the section above without
          hanging off a panel. */}
      <div data-surface="light" className="relative bg-none">
        <WaveDivider className="-mt-wave" />
        <div className="border-b border-border bg-bg py-9">
          <Container>
            <div className="grid grid-cols-[minmax(0,1fr)] items-end gap-8 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:gap-9">
              <div className="flex flex-col gap-4">
                <Eyebrow strong>Contact</Eyebrow>
                <h2 className="text-h2 font-bold text-primary">
                  Speak to the office.
                </h2>
                <p className="max-w-prose-tight text-lead text-secondary">
                  Direct line to the operations desk for barge fleeting, marine
                  services and long-term dock leasing across the upper Texas
                  Gulf Coast.
                </p>
              </div>

              <div className="flex flex-col items-stretch gap-5 md:items-start">
                <div className="flex w-full flex-col gap-1 border-t border-border py-3">
                  <span
                    className={`font-mono text-xs font-medium uppercase tracking-label text-faint`}
                  >
                    Direct Line
                  </span>
                  <a
                    href={phoneHref}
                    className="inline-flex items-center gap-3 whitespace-nowrap font-condensed text-h3 font-bold uppercase tabular-nums tracking-normal text-primary no-underline transition-colors duration-quick ease-settle hover:text-highlight focus-visible:text-highlight focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-highlight-ring active:scale-[0.99]"
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
                      <span className={`${MICRO} text-faint`}>{h.label}</span>
                      <span className="font-body text-sm text-secondary">
                        {h.value}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button variant="solid" to="/contact" className="self-stretch">
                  Request a Quote
                </Button>
              </div>
            </div>
          </Container>
        </div>
      </div>

      <div data-surface="dark" className={`relative pb-9 pt-10 ${HULL_PLATE}`}>
        <Container>
          <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-9 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,2.6fr)] xl:gap-10">
            <div className="flex flex-col items-start gap-5">
              <Link
                to="/"
                aria-label="Dickinson Bayou Fleeting, Home"
                className="inline-flex transition-transform duration-settle ease-settle hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-highlight active:scale-[0.99] motion-reduce:transition-none"
              >
                <img
                  src="/images/DBF-Logo-White.png"
                  srcSet={LOGO_SRCSET("White")}
                  sizes="(max-width: 700px) 96px, 120px"
                  alt="Dickinson Bayou Fleeting"
                  width="240"
                  height="240"
                  loading="lazy"
                  decoding="async"
                  className="h-footer-logo w-auto object-contain"
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
                    className={`${MICRO} mr-5 inline-flex items-center gap-2 py-3 pr-4 text-secondary before:text-3xs before:text-highlight before:content-['◇']`}
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
                    className="inline-flex min-h-control-sm min-w-control-sm items-center font-condensed text-lg font-semibold uppercase tracking-normal text-secondary no-underline transition-[color,transform] duration-quick ease-settle hover:text-primary focus-visible:text-primary focus-visible:outline-none active:scale-[0.99]"
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
                      className={`${MICRO} row-span-4 self-start pt-1 tracking-control text-highlight`}
                    >
                      F-{String(idx + 1).padStart(2, "0")}
                    </span>
                    <span className="font-condensed text-base font-semibold uppercase tracking-normal text-primary">
                      {facility.name}
                    </span>
                    <span className="font-mono text-3xs font-medium uppercase tracking-label text-faint">
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
                        className="inline-flex min-h-control-sm items-center font-body text-sm text-secondary no-underline transition-colors duration-quick ease-settle hover:text-highlight focus-visible:text-highlight focus-visible:outline-none active:scale-[0.99]"
                      >
                        {facility.address}
                      </a>
                      <a
                        href={`tel:1${facility.phone.replace(/[^0-9]/g, "")}`}
                        className="inline-flex min-h-control-sm items-center font-mono text-xs font-medium tracking-label tabular-nums text-faint no-underline transition-colors duration-quick ease-settle hover:text-highlight focus-visible:text-highlight focus-visible:outline-none"
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
            <span className={`${MICRO} text-highlight`}>Coverage</span>
            <span className="font-mono text-xs font-medium tracking-normal text-secondary">
              Galveston Bay · Houston Ship Channel · Gulf Intracoastal Waterway
              · Brazoria · Galveston · Harris
            </span>
          </div>
        </Container>
      </div>

      <div data-surface="dark" className="border-t border-hairline">
        <div className="mx-auto flex w-full max-w-container flex-col items-start justify-between gap-3 px-gutter py-5 xs:flex-row xs:items-center xs:gap-4">
          <div className="font-mono text-xs font-medium tracking-control text-faint">
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
                  className="inline-flex min-h-control-sm items-center font-mono text-xs font-medium uppercase tracking-label text-faint no-underline transition-colors duration-quick ease-settle hover:text-highlight focus-visible:text-highlight focus-visible:shadow-focus focus-visible:outline-none active:scale-[0.98]"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            to="/"
            aria-label="Back to Top"
            className="inline-flex min-h-control-sm items-center gap-2 border border-field-border px-4 py-2 font-mono text-xs font-medium uppercase tracking-control text-secondary no-underline transition-[color,border-color,transform] duration-quick ease-settle hover:border-highlight focus-visible:border-highlight focus-visible:shadow-focus focus-visible:outline-none active:scale-[0.97]"
          >
            <ArrowUpIcon size={12} />
            Top
          </Link>
        </div>
      </div>

      {children}
    </footer>
  );
}

export default Footer;
