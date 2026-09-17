import { NAV_LINKS } from "../../app/content/navLinks";
import { FACILITIES } from "../../app/content/facilities";
import {
  buildMapsHref,
  PHONE_NUMBER,
  telHref,
} from "../../app/content/phoneNumber";
import { HOURS } from "../../app/content/hours";
import { Link } from "../../app/router/Link";
import Button from "../ui/Button";
import { Container, MICRO } from "../ui/Layout";
import Logo from "../ui/Logo";
import { currentYear } from "../../lib/localTime";

// Four columns and two rules. The wordmark and what the operation is, the
// destinations, both yards with the address and number a directory reads, and
// the contact block that ends in the one written action.
//
// The column headings are the only mono eyebrows below the plates, and they are
// set above the list under them rather than below it: the build had the heading
// a size smaller than its own items, which reads as a caption on the first row.

// Four readings of the operation, each one a number or a place the rest of the
// site states somewhere else. Nothing here is an accreditation and nothing
// names a body that issued it, because none was.
const FOOTER_FACTS = [
  "Two yards, ten acres of frontage",
  "Galveston Bay and the GIWW",
  "Shore crew on site around the clock",
  "One number reaches both docks",
];

const FOOTER_LEGAL = [
  { label: "Privacy", to: "/privacy" },
  { label: "Terms", to: "/terms" },
];

const COVERAGE =
  "Galveston Bay · Houston Ship Channel · Gulf Intracoastal Waterway · Brazoria · Galveston · Harris";

const HEADING = "m-0 font-mono text-eyebrow text-faint";

const COLUMN_LINK =
  "inline-flex items-center font-body text-micro text-secondary no-underline transition-colors duration-quick ease-settle hover:text-primary focus-visible:text-primary focus-visible:outline-none";

const YARD_LINE =
  "font-mono text-data text-secondary no-underline transition-colors duration-quick ease-settle hover:text-primary focus-visible:text-primary focus-visible:outline-none";

function Footer({ children }) {
  const year = currentYear();
  const phoneHref = telHref();

  // The document scrolls, not a container, so this is the whole of it. Reduced
  // motion is honoured by the root's own scroll-behavior rather than by a
  // second check here.
  const toTop = () => window.scrollTo({ top: 0, left: 0 });

  return (
    <footer
      id="footer"
      data-surface="dark"
      className="relative bg-bg-deep text-secondary"
    >
      <Container className="grid grid-cols-[minmax(0,1fr)] gap-x-grid-gutter gap-y-10 pb-9 pt-11 md:grid-cols-2 md:pb-10 md:pt-12 lg:grid-cols-[1.4fr_0.5fr_1fr_0.875fr]">
        <div className="flex flex-col items-start gap-6">
          <Link
            to="/"
            aria-label="Dickinson Bayou Fleeting, Home"
            className="inline-flex focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-highlight"
          >
            <Logo
              tone="White"
              sizes="(max-width: 899px) 160px, 183px"
              className="h-footer-logo"
            />
          </Link>

          <p className="m-0 max-w-prose font-body text-small text-secondary">
            Coastal barge fleeting, marine services, mooring and long-term
            waterfront dock leasing on the upper Texas Gulf Coast.
          </p>

          <ul
            aria-label="The Operation"
            className="m-0 flex list-none flex-col gap-2 p-0"
          >
            {FOOTER_FACTS.map((fact) => (
              <li key={fact} className="flex items-start gap-3">
                <span
                  aria-hidden="true"
                  className="mt-3 inline-block h-px w-rule flex-none bg-border-strong"
                />
                <span className="font-body text-small text-faint">{fact}</span>
              </li>
            ))}
          </ul>
        </div>

        <nav aria-label="Pages" className="flex flex-col items-start gap-4">
          <p className={HEADING}>Pages</p>
          {[...NAV_LINKS, ...FOOTER_LEGAL].map((l) => (
            <Link key={l.to} to={l.to} className={COLUMN_LINK}>
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex min-w-0 flex-col gap-5">
          <p className={HEADING}>Facilities</p>
          <ul
            aria-label="Facilities"
            className="m-0 flex list-none flex-col gap-5 p-0"
          >
            {FACILITIES.map((facility) => (
              <li key={facility.id} className="flex min-w-0 flex-col gap-[6px]">
                <span className="font-mono text-code text-muted">
                  {facility.code} · {facility.waterway}
                </span>
                <span className="font-condensed text-h5 uppercase text-primary">
                  {facility.name}
                </span>
                {/* Address and phone are the same block, so the name, the
                    street and the number a directory reads sit together rather
                    than a column apart. */}
                <address className="flex flex-col items-start gap-0 not-italic">
                  <a
                    href={buildMapsHref(facility.address)}
                    target="_blank"
                    rel="noreferrer"
                    className={YARD_LINE}
                  >
                    {facility.address}
                  </a>
                  <a
                    href={telHref(facility.phone)}
                    className={`${YARD_LINE} tabular-nums`}
                  >
                    {facility.phone}
                  </a>
                </address>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex min-w-0 flex-col items-start gap-5">
          <p className={HEADING}>Contact</p>
          <p className="m-0 font-body text-small text-secondary">
            Direct line to the yard for barge fleeting, marine services and
            long-term dock leasing across the upper Texas Gulf Coast.
          </p>

          <div className="flex flex-col gap-[6px]">
            <span className={`${MICRO} text-faint`}>Direct Line</span>
            <a
              href={phoneHref}
              className="whitespace-nowrap font-mono text-figure-sm tabular-nums text-primary no-underline transition-colors duration-quick ease-settle hover:text-highlight focus-visible:text-highlight focus-visible:outline-none"
            >
              {PHONE_NUMBER}
            </a>
          </div>

          <dl aria-label="Hours" className="m-0 flex flex-col gap-3">
            {HOURS.map((h) => (
              <div key={h.label} className="flex flex-col gap-1">
                <dt className={`${MICRO} text-faint`}>{h.label}</dt>
                <dd className="m-0 font-body text-small text-secondary">
                  {h.value}
                </dd>
              </div>
            ))}
          </dl>

          <Button variant="ghost" size="sm" to="/contact">
            Get a Written Quote
          </Button>
        </div>
      </Container>

      <div className="border-t border-border">
        <Container className="py-5">
          <p
            aria-label="Coverage"
            className="m-0 font-mono text-code text-muted"
          >
            {COVERAGE}
          </p>
        </Container>
      </div>

      <div className="border-t border-border">
        <Container className="flex flex-col items-start justify-between gap-3 py-5 xs:flex-row xs:items-center xs:gap-6">
          <p className="m-0 font-body text-small text-muted">
            © {year} · Dickinson Bayou Fleeting · Texas Gulf Coast
          </p>
          <ul
            aria-label="Legal"
            className="m-0 flex list-none flex-wrap items-center gap-6 p-0"
          >
            {FOOTER_LEGAL.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className={COLUMN_LINK}>
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <button
                type="button"
                onClick={toTop}
                className={`${COLUMN_LINK} border-0 bg-transparent p-0`}
              >
                Back to Top
              </button>
            </li>
          </ul>
        </Container>
      </div>

      {children}
    </footer>
  );
}

export default Footer;
