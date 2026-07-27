import "./styles/Footer.css";
import { NAV_LINKS } from "../app/constants/navLinks";
import { FACILITIES } from "../app/constants/facilities";
import { PHONE_NUMBER } from "../app/constants/phoneNumber";
import { SERVICES } from "../app/constants/services";
import { Link } from "../app/router/Link";
import WaveDivider from "./WaveDivider";

const FOOTER_CREDENTIALS = [
  "Coastal Texas marine operator",
  "Gulf Intracoastal Waterway access",
  "Houston Ship Channel partner",
];

const FOOTER_SERVICES = SERVICES.slice(0, 6);

const FOOTER_HOURS = [
  { label: "Office", value: "Mon–Fri · 7a–5p CT" },
  { label: "Operations desk", value: "24 / 7 · On-call answered" },
];

function PhoneIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
    </svg>
  );
}

function Footer() {
  const year = new Date().getFullYear();
  const phoneDigits = PHONE_NUMBER.replace(/[^0-9]/g, "");
  const phoneHref = `tel:1${phoneDigits}`;
  return (
    <footer className="footer" id="footer">
      <div className="footer__contact" data-surface="light">
        <WaveDivider />
        <div className="container">
          <div className="footer__contactGrid">
            <div className="footer__contactCol">
              <p className="eyebrow eyebrow--strong mono">Contact</p>
              <h2 className="footer__contactTitle">Speak to the office.</h2>
              <p className="footer__contactBlurb">
                Direct line to the operations desk for barge fleeting, marine
                services and long-term dock leasing across the upper Texas Gulf
                Coast.
              </p>
            </div>
            <div className="footer__contactCol footer__contactCol--actions">
              <div className="footer__contactBlock">
                <span className="footer__contactLabel mono">Direct line</span>
                <a href={phoneHref} className="footer__phone tabular">
                  <span className="footer__phoneIcon" aria-hidden="true">
                    <PhoneIcon />
                  </span>
                  {PHONE_NUMBER}
                </a>
              </div>
              <Link to="/contact" className="btn btn--primary footer__cta">
                Request a quote
              </Link>
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
                aria-label="Dickinson Bayou Fleeting — home"
              >
                <img
                  src="/images/DBF-Logo-White.png"
                  alt="Dickinson Bayou Fleeting"
                  className="footer__logo footer__logo--dark"
                  width="240"
                  height="240"
                  loading="lazy"
                />
                <img
                  src="/images/DBF-Logo-Black.png"
                  alt="Dickinson Bayou Fleeting"
                  className="footer__logo footer__logo--light"
                  width="240"
                  height="240"
                  loading="lazy"
                />
              </Link>
              <p className="footer__tag">
                Coastal barge fleeting, marine services, mooring and long-term
                waterfront dock leasing on Galveston Bay, the Houston Ship
                Channel and the upper Texas Gulf Coast — serving San Leon,
                Dickinson, Texas City, Houston, League City, Kemah, Bacliff,
                Seabrook, La Marque, Galveston and the surrounding coastal
                Texas waterways.
              </p>
              <ul className="footer__credentials" aria-label="Capabilities">
                {FOOTER_CREDENTIALS.map((c) => (
                  <li key={c} className="footer__credential mono">
                    {c}
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer__cols">
              <div className="footer__col" aria-label="Pages">
                <div className="footer__title mono">Pages</div>
                <ul className="footer__list">
                  {NAV_LINKS.map((l) => (
                    <li key={l.to}>
                      <Link className="footer__link" to={l.to}>
                        <span>{l.label}</span>
                        <span className="footer__linkArrow mono" aria-hidden="true">
                          →
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="footer__col" aria-label="Services">
                <div className="footer__title mono">Services</div>
                <ul className="footer__list footer__list--compact">
                  {FOOTER_SERVICES.map((s) => (
                    <li key={s.id}>
                      <Link className="footer__sublink" to="/services">
                        <span className="footer__sublinkCode mono">
                          {s.code}
                        </span>
                        <span className="footer__sublinkName">{s.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="footer__col" aria-label="Facilities">
                <div className="footer__title mono">Facilities</div>
                <ul className="footer__list footer__list--locations">
                  {FACILITIES.map((facility, idx) => (
                    <li key={facility.id} className="footer__loc">
                      <span className="footer__locIdx mono">
                        F-{String(idx + 1).padStart(2, "0")}
                      </span>
                      <span className="footer__locName">{facility.name}</span>
                      <span className="footer__locRegion mono">
                        {facility.region.split(" · ")[0]}
                      </span>
                      <a
                        href={`https://maps.google.com/?q=${encodeURIComponent(facility.address)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="footer__locAddr"
                      >
                        {facility.address}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="footer__col" aria-label="Get in touch">
                <div className="footer__title mono">Get in touch</div>
                <ul className="footer__list footer__list--contact">
                  <li className="footer__contactRow">
                    <span className="footer__contactRowLabel mono">Phone</span>
                    <a href={phoneHref} className="footer__contactRowValue tabular">
                      {PHONE_NUMBER}
                    </a>
                  </li>
                  {FOOTER_HOURS.map((h) => (
                    <li key={h.label} className="footer__contactRow">
                      <span className="footer__contactRowLabel mono">
                        {h.label}
                      </span>
                      <span className="footer__contactRowValue footer__contactRowValue--muted">
                        {h.value}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
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
          <Link
            to="/"
            className="footer__topBtn mono"
            aria-label="Back to top"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="square"
              strokeLinejoin="miter"
              aria-hidden="true"
            >
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
            Top
          </Link>
        </div>
      </div>

      <div className="footer__credit" data-surface="dark">
        <a
          href="https://www.taylorurl.com"
          target="_blank"
          rel="noopener noreferrer"
          className="footer__creditLink"
        >
          <span className="footer__creditPrefix">Built by </span>
          <span className="footer__creditBrand">TaylorURL</span>
        </a>
      </div>
    </footer>
  );
}

export default Footer;
