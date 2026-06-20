import { useEffect, useState } from "react";
import "./styles/NavBar.css";
import { NAV_LINKS } from "../app/constants/navLinks";
import { PHONE_NUMBER } from "../app/constants/phoneNumber";
import { useScrolled } from "../app/hooks/useScrolled";
import { useRouter, normalisePath } from "../app/router/Router";
import { Link } from "../app/router/Link";

function NavBar({ surface = "dark", overHero = true }) {
  const [open, setOpen] = useState(false);
  const scrolled = useScrolled(12);
  const { path } = useRouter();
  const activePath = normalisePath(path);

  /* While at the very top of the home page the nav floats over the
   * dark hero. Anywhere else (or once scrolled past it) the nav adopts
   * the surface of whatever section is currently behind it. */
  const effectiveSurface = open ? "dark" : overHero ? "dark" : surface;

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  /* Close the drawer on every route change. */
  useEffect(() => {
    setOpen(false);
  }, [path]);

  const phoneHref = `tel:1${PHONE_NUMBER.replace(/[^0-9]/g, "")}`;

  const closeMenu = () => setOpen(false);

  const openInquiry = (e) => {
    e.preventDefault();
    closeMenu();
    window.dispatchEvent(new Event("inquiry:open"));
  };

  return (
    <>
      <nav
        className={`nav${scrolled || open ? " nav--scrolled" : ""}${open ? " nav--open" : ""}`}
        data-surface={effectiveSurface}
        aria-label="Primary"
      >
        <div className="nav__inner">
          <Link
            to="/"
            className="nav__brand"
            aria-label="Dickinson Bayou Fleeting — home"
            onClick={closeMenu}
          >
            <img
              src="/images/DBF-Logo-White.png"
              alt="Dickinson Bayou Fleeting"
              className="nav__logo nav__logo--dark"
              width="240"
              height="240"
            />
            <img
              src="/images/DBF-Logo-Black.png"
              alt="Dickinson Bayou Fleeting"
              className="nav__logo nav__logo--light"
              width="240"
              height="240"
            />
            <span className="nav__brandText">
              <span className="nav__brandName">Dickinson Bayou Fleeting</span>
              <span className="nav__brandTag">
                Coastal barge fleeting · Texas Gulf Coast
              </span>
            </span>
          </Link>

          <ul className="nav__links">
            {NAV_LINKS.map((l) => {
              const isActive = activePath === normalisePath(l.to);
              return (
                <li key={l.to} className="nav__item">
                  <Link
                    className={`nav__link${isActive ? " nav__link--active" : ""}`}
                    to={l.to}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {l.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="nav__actions">
            <a className="nav__phone tabular" href={phoneHref}>
              <svg
                className="nav__phoneIcon"
                viewBox="0 0 24 24"
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
              </svg>
              <span className="nav__phoneNumber">{PHONE_NUMBER}</span>
            </a>
            <a href="#quote" className="nav__action" onClick={openInquiry}>
              Get a Quote
            </a>
          </div>

          <button
            type="button"
            className="nav__toggle"
            aria-expanded={open}
            aria-controls="nav-mobile-drawer"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
          >
            <span className="nav__toggleBar" />
            <span className="nav__toggleBar" />
            <span className="nav__toggleBar" />
          </button>
        </div>
      </nav>

      <div
        className={`nav__scrim${open ? " nav__scrim--visible" : ""}`}
        onClick={closeMenu}
        aria-hidden="true"
      />

      <div
        id="nav-mobile-drawer"
        className={`nav__drawer${open ? " nav__drawer--open" : ""}`}
        data-surface="dark"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <ul className="nav__drawerLinks">
          {NAV_LINKS.map((l) => {
            const isActive = activePath === normalisePath(l.to);
            return (
              <li key={l.to} className="nav__drawerItem">
                <Link
                  className={`nav__drawerLink${isActive ? " nav__drawerLink--active" : ""}`}
                  to={l.to}
                  onClick={closeMenu}
                  aria-current={isActive ? "page" : undefined}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
          <li className="nav__drawerItem nav__drawerItem--phone">
            <a className="nav__drawerPhone tabular" href={phoneHref}>
              <span className="nav__drawerPhoneLabel">Direct line</span>
              <span className="nav__drawerPhoneNumber">{PHONE_NUMBER}</span>
            </a>
          </li>
          <li className="nav__drawerItem">
            <a
              href="#quote"
              className="nav__action nav__drawerCta"
              onClick={openInquiry}
            >
              Get a Quote
            </a>
          </li>
        </ul>
      </div>
    </>
  );
}

export default NavBar;
