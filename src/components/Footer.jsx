import "./styles/Footer.css";
import { NAV_LINKS } from "../app/constants/navLinks";
import { FACILITIES } from "../app/constants/facilities";
import { PHONE_NUMBER } from "../app/constants/phoneNumber";
import { Link } from "../app/router/Link";
import WaveDivider from "./WaveDivider";
import { ArrowUpIcon, PhoneIcon } from "./Icons";

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

function Footer({ children }) {
  const year = new Date().getFullYear();
  const phoneDigits = PHONE_NUMBER.replace(/[^0-9]/g, "");
  const phoneHref = `tel:1${phoneDigits}`;
  return (
    <footer className="footer" id="footer">
      <div className="footer__contact" data-surface="light">
        <WaveDivider />
        <div className="footer__contactBand">
          <div className="container">
            <div className="footer__contactGrid">
              <div className="footer__contactCol">
                <p className="eyebrow eyebrow--strong mono">Contact</p>
                <h2 className="footer__contactTitle">Speak to the office.</h2>
                <p className="footer__contactBlurb">
                  Direct line to the operations desk for barge fleeting, marine
                  services and long-term dock leasing across the upper Texas
                  Gulf Coast.
                </p>
              </div>
              <div className="footer__contactCol footer__contactCol--actions">
                <div className="footer__contactBlock">
                  <span className="footer__contactLabel mono">Direct Line</span>
                  <a href={phoneHref} className="footer__phone tabular">
                    <span className="footer__phoneIcon" aria-hidden="true">
                      <PhoneIcon />
                    </span>
                    {PHONE_NUMBER}
                  </a>
                </div>
                <ul className="footer__hours" aria-label="Hours">
                  {FOOTER_HOURS.map((h) => (
                    <li key={h.label} className="footer__hoursRow">
                      <span className="footer__hoursLabel mono">{h.label}</span>
                      <span className="footer__hoursValue">{h.value}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/contact" className="btn btn--solid footer__cta">
                  Request a Quote
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer__main hullPlate" data-surface="dark">
        <div className="container">
          <div className="footer__mainGrid">
            <div className="footer__brand">
              <Link
                to="/"
                className="footer__logoLink"
                aria-label="Dickinson Bayou Fleeting, Home"
              >
                <img
                  src="/images/DBF-Logo-White.png"
                  srcSet="/images/DBF-Logo-White-120.png 120w, /images/DBF-Logo-White-240.png 240w, /images/DBF-Logo-White.png 500w"
                  sizes="(max-width: 700px) 96px, 120px"
                  alt="Dickinson Bayou Fleeting"
                  className="footer__logo footer__logo--dark"
                  width="240"
                  height="240"
                  loading="lazy"
                  decoding="async"
                />
                <img
                  src="/images/DBF-Logo-Black.png"
                  srcSet="/images/DBF-Logo-Black-120.png 120w, /images/DBF-Logo-Black-240.png 240w, /images/DBF-Logo-Black.png 500w"
                  sizes="(max-width: 700px) 96px, 120px"
                  alt="Dickinson Bayou Fleeting"
                  className="footer__logo footer__logo--light"
                  width="240"
                  height="240"
                  loading="lazy"
                  decoding="async"
                />
              </Link>
              <p className="footer__tag">
                Coastal barge fleeting, marine services, mooring and long-term
                waterfront dock leasing on the upper Texas Gulf Coast.
              </p>
              <ul className="footer__credentials" aria-label="Capabilities">
                {FOOTER_CREDENTIALS.map((c) => (
                  <li key={c} className="footer__credential mono">
                    {c}
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer__mast">
              <nav className="footer__pages" aria-label="Pages">
                {NAV_LINKS.map((l) => (
                  <Link key={l.to} className="footer__link" to={l.to}>
                    {l.label}
                  </Link>
                ))}
              </nav>

              <ul className="footer__locs" aria-label="Facilities">
                {FACILITIES.map((facility, idx) => (
                  <li key={facility.id} className="footer__loc">
                    <span className="footer__locIdx mono">
                      F-{String(idx + 1).padStart(2, "0")}
                    </span>
                    <span className="footer__locName">{facility.name}</span>
                    <span className="footer__locRegion mono">
                      {facility.region.split(" · ")[0]}
                    </span>
                    <address className="footer__locAddress">
                      <a
                        href={`https://maps.google.com/?q=${encodeURIComponent(facility.address)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="footer__locAddr"
                      >
                        {facility.address}
                      </a>
                      <a
                        href={`tel:1${facility.phone.replace(/[^0-9]/g, "")}`}
                        className="footer__locPhone tabular"
                      >
                        {facility.phone}
                      </a>
                    </address>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="footer__coverage" aria-label="Coverage">
            <span className="footer__coverageLabel mono">Coverage</span>
            <span className="footer__coverageList mono">
              Galveston Bay · Houston Ship Channel · Gulf Intracoastal Waterway
              · Brazoria · Galveston · Harris
            </span>
          </div>
        </div>
      </div>

      <div className="footer__bar" data-surface="dark">
        <div className="footer__barInner">
          <div className="footer__copy mono">
            © {year} · Dickinson Bayou Fleeting · Texas Gulf Coast
          </div>
          <ul className="footer__legal" aria-label="Legal">
            {FOOTER_LEGAL.map((l) => (
              <li key={l.to}>
                <Link className="footer__legalLink mono" to={l.to}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link to="/" className="footer__topBtn mono" aria-label="Back to Top">
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
