import React, { useEffect, useState } from "react";
import "./styles/NavBar.css";
import { NAV_LINKS } from "../app/constants/navLinks";
import { SECTION_IDS } from "../app/constants/sectionIds";
import { PHONE_NUMBER } from "../app/constants/phoneNumber";
import { useScrolled } from "../app/hooks/useScrolled";
import { useActiveSection } from "../app/hooks/useActiveSection";

function NavBar({ surface = "dark", overHero = true }) {
  const [open, setOpen] = useState(false);
  const scrolled = useScrolled(12);
  const [active, setActive] = useActiveSection(SECTION_IDS);

  /* When the user is at the very top, the nav is transparent over the
   * dark cinematic hero — its dark token set always applies there.
   * Once scrolled past the hero, the nav adopts the surface of whatever
   * section is now underneath it so links stay legible on light bands. */
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

  const links = NAV_LINKS.filter((l) => SECTION_IDS.includes(l.id));
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
          <a
            href="#overview"
            className="nav__brand"
            aria-label="Dickinson Bayou Fleeting"
            onClick={closeMenu}
          >
            <img
              src="/images/DBF-Logo-White.png"
              alt="Dickinson Bayou Fleeting — coastal barge fleeting, marine services & dock leasing, Galveston Bay & Houston Ship Channel"
              className="nav__logo nav__logo--dark"
            />
            <img
              src="/images/DBF-Logo-Black.png"
              alt="Dickinson Bayou Fleeting — coastal barge fleeting, marine services & dock leasing, Galveston Bay & Houston Ship Channel"
              className="nav__logo nav__logo--light"
            />
            <span className="nav__brandText">
              <span className="nav__brandName">Dickinson Bayou Fleeting</span>
              <span className="nav__brandTag">
                Coastal Barge Fleeting · Texas Gulf Coast
              </span>
            </span>
          </a>

          <ul className="nav__links">
            {links.map((l) => (
              <li key={l.href} className="nav__item">
                <a
                  className={`nav__link${active === l.id ? " nav__link--active" : ""}`}
                  href={l.href}
                  onClick={() => setActive(l.id)}
                >
                  {l.label}
                </a>
              </li>
            ))}
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
            <a href="#rates" className="nav__action" onClick={openInquiry}>
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
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <ul className="nav__drawerLinks">
          {links.map((l) => (
            <li key={l.href} className="nav__drawerItem">
              <a
                className={`nav__drawerLink${active === l.id ? " nav__drawerLink--active" : ""}`}
                href={l.href}
                onClick={() => {
                  setActive(l.id);
                  closeMenu();
                }}
              >
                {l.label}
              </a>
            </li>
          ))}
          <li className="nav__drawerItem nav__drawerItem--phone">
            <a className="nav__drawerPhone tabular" href={phoneHref}>
              <span className="nav__drawerPhoneLabel">Direct Line</span>
              <span className="nav__drawerPhoneNumber">{PHONE_NUMBER}</span>
            </a>
          </li>
          <li className="nav__drawerItem">
            <a
              href="#rates"
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
