import "./styles/Footer.css";
import { NAV_LINKS } from "../app/constants/navLinks";
import { FACILITIES } from "../app/constants/facilities";
import { PHONE_NUMBER } from "../app/constants/phoneNumber";

const FOOTER_CREDENTIALS = [
  "Coastal Texas Marine Operator",
  "Gulf Intracoastal Waterway Access",
  "Houston Ship Channel Operator",
];

function Footer() {
  const year = new Date().getFullYear();
  const openInquiry = (e) => {
    e.preventDefault();
    window.dispatchEvent(new Event("inquiry:open"));
  };
  return (
    <footer className="footer" id="contact">
      <div className="footer__contact" data-surface="light">
        <div className="container">
          <div className="footer__contactGrid">
            <div className="footer__contactCol">
              <p className="eyebrow eyebrow--strong mono">
                ◇ Section 05 — Contact
              </p>
              <h2 className="footer__contactTitle">
                Speak to operations.
              </h2>
              <p className="footer__contactBlurb">
                Direct line to the operations desk for barge fleeting, marine
                services and long-term dock leasing across the upper Texas Gulf
                Coast.
              </p>
            </div>
            <div className="footer__contactCol footer__contactCol--actions">
              <div className="footer__contactBlock">
                <span className="footer__contactLabel mono">Direct Line</span>
                <a
                  href={`tel:1${PHONE_NUMBER.replace(/[^0-9]/g, "")}`}
                  className="footer__phone tabular"
                >
                  {PHONE_NUMBER}
                </a>
              </div>
              <a
                href="#contact"
                className="btn btn--primary footer__cta"
                onClick={openInquiry}
              >
                Request a Quote
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="footer__main" data-surface="dark">
        <div className="container">
          <div className="footer__mainGrid">
            <div className="footer__brand">
              <a
                href="#overview"
                className="footer__logoLink"
                aria-label="Dickinson Bayou Fleeting"
              >
                <img
                  src="/images/DBF-Logo-White.png"
                  alt="Dickinson Bayou Fleeting — coastal barge fleeting, marine services and waterfront dock leasing on Galveston Bay and the Houston Ship Channel"
                  className="footer__logo footer__logo--dark"
                />
                <img
                  src="/images/DBF-Logo-Black.png"
                  alt="Dickinson Bayou Fleeting — coastal barge fleeting, marine services and waterfront dock leasing on Galveston Bay and the Houston Ship Channel"
                  className="footer__logo footer__logo--light"
                />
              </a>
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
              <div className="footer__col" aria-label="Navigation">
                <div className="footer__title mono">Navigation</div>
                <ul className="footer__list">
                  {NAV_LINKS.map((l) => (
                    <li key={l.href}>
                      <a className="footer__link" href={l.href}>
                        {l.label}
                        <span className="footer__linkArrow mono" aria-hidden="true">
                          →
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="footer__col" aria-label="Locations">
                <div className="footer__title mono">Facilities</div>
                <ul className="footer__list">
                  {FACILITIES.map((facility, idx) => (
                    <li key={facility.name} className="footer__loc">
                      <span className="footer__locIdx mono">
                        F-{String(idx + 1).padStart(2, "0")}
                      </span>
                      <span className="footer__locName">{facility.name}</span>
                      <span className="footer__locAddr">{facility.address}</span>
                      {facility.coords && (
                        <span className="footer__locCoords mono">
                          {facility.coords.lat.toFixed(4)}° N ·{" "}
                          {Math.abs(facility.coords.lng).toFixed(4)}° W
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer__bar">
        <div className="footer__barInner">
          <div className="footer__copy mono">
            © {year} · Dickinson Bayou Fleeting · Texas Gulf Coast Marine Operations
          </div>
          <a
            href="#overview"
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
          </a>
        </div>
      </div>

      <div className="footer__credit mono">
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
