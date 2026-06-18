import "./styles/Footer.css";
import { NAV_LINKS } from "../app/constants/navLinks";
import { FACILITIES } from "../app/constants/facilities";
import { PHONE_NUMBER } from "../app/constants/phoneNumber";

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
              alt="Dickinson Bayou Fleeting"
              className="footer__logo footer__logo--dark"
            />
            <img
              src="/images/DBF-Logo-Black.png"
              alt="Dickinson Bayou Fleeting"
              className="footer__logo footer__logo--light"
            />
          </a>
          <p className="footer__tag">
            Long-term waterfront acreage with dedicated slip access and
            essential dockside infrastructure.
          </p>
          <div className="footer__actions">
            <a
              href={`tel:1${PHONE_NUMBER.replace(/[^0-9]/g, "")}`}
              className="footer__phone"
            >
              {PHONE_NUMBER}
            </a>
            <a href="#contact" className="footer__button" onClick={openInquiry}>
              Lease Inquiry
            </a>
          </div>
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
            <div className="footer__title">Locations</div>
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
          <div className="footer__copy">© {year} Dickinson Bayou Fleeting</div>
          <a
            href="#overview"
            className="footer__topBtn"
            aria-label="Back to top"
          >
            Top
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
