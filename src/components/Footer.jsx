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
      <div className="footer__container">
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
            waterfront dock leasing on Galveston Bay, the Houston Ship Channel
            and the upper Texas Gulf Coast — serving San Leon, Dickinson, Texas
            City, Houston, League City, Kemah, Bacliff, Seabrook, La Marque,
            Galveston and the surrounding coastal Texas waterways.
          </p>
          <div className="footer__contactBlock">
            <div className="footer__contactItem">
              <span className="footer__contactLabel">Direct Line</span>
              <a
                href={`tel:1${PHONE_NUMBER.replace(/[^0-9]/g, "")}`}
                className="footer__phone tabular"
              >
                {PHONE_NUMBER}
              </a>
            </div>
            <a
              href="#contact"
              className="footer__button"
              onClick={openInquiry}
            >
              Request a Quote
            </a>
          </div>
          <ul className="footer__credentials" aria-label="Capabilities">
            {FOOTER_CREDENTIALS.map((c) => (
              <li key={c} className="footer__credential">
                {c}
              </li>
            ))}
          </ul>
        </div>
        <div className="footer__cols">
          <div className="footer__col" aria-label="Navigation">
            <div className="footer__title">Navigation</div>
            <ul className="footer__list">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <a className="footer__link" href={l.href}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="footer__col" aria-label="Locations">
            <div className="footer__title">Facilities</div>
            <ul className="footer__list">
              {FACILITIES.map((facility) => (
                <li key={facility.name} className="footer__loc">
                  <span className="footer__locName">{facility.name}</span>
                  <span className="footer__locAddr">{facility.address}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="footer__bar">
        <div className="footer__barInner">
          <div className="footer__copy">
            © {year} Dickinson Bayou Fleeting · Texas Gulf Coast Marine
            Operations
          </div>
          <a
            href="#overview"
            className="footer__topBtn"
            aria-label="Back to top"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m18 15-6-6-6 6" />
            </svg>
            Back to Top
          </a>
        </div>
      </div>
      <div className="footer__credit">
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
