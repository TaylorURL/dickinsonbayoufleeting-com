import "./styles/Footer.css";
import { NAV_LINKS } from "../app/constants/navLinks";
import { FACILITIES } from "../app/constants/facilities";
import { PHONE_NUMBER } from "../app/constants/phoneNumber";
import { Link } from "../app/router/Link";

const FOOTER_CREDENTIALS = [
  "Coastal Texas marine operator",
  "Gulf Intracoastal Waterway access",
  "Houston Ship Channel partner",
];

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer" id="footer">
      <div className="footer__contact" data-surface="light">
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
                <a
                  href={`tel:1${PHONE_NUMBER.replace(/[^0-9]/g, "")}`}
                  className="footer__phone tabular"
                >
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

      <div className="footer__main" data-surface="dark">
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
                        {l.label}
                        <span className="footer__linkArrow mono" aria-hidden="true">
                          →
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="footer__col" aria-label="Facilities">
                <div className="footer__title mono">Facilities</div>
                <ul className="footer__list">
                  {FACILITIES.map((facility, idx) => (
                    <li key={facility.name} className="footer__loc">
                      <span className="footer__locIdx mono">
                        F-{String(idx + 1).padStart(2, "0")}
                      </span>
                      <span className="footer__locName">{facility.name}</span>
                      <span className="footer__locAddr">{facility.address}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
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

      <div className="footer__credit mono" data-surface="dark">
        Site made by{" "}
        <a
          href="https://taylorurl.com"
          target="_blank"
          rel="noopener noreferrer"
          className="footer__creditLink"
        >
          TaylorURL.com
        </a>
      </div>
    </footer>
  );
}

export default Footer;
