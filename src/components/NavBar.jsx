import React, { useEffect, useState } from "react";
import "./styles/NavBar.css";
import { NAV_LINKS } from "../app/constants/navLinks";
import { SECTION_IDS } from "../app/constants/sectionIds";
import { useScrolled } from "../app/hooks/useScrolled";
import { useActiveSection } from "../app/hooks/useActiveSection";

function NavBar() {
  const [open, setOpen] = useState(false);
  const scrolled = useScrolled(12);
  const [active, setActive] = useActiveSection(SECTION_IDS);

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
              alt="Dickinson Bayou Fleeting — barge fleeting and dock leasing, Galveston Bay & Houston Ship Channel"
              className="nav__logo nav__logo--dark"
            />
            <img
              src="/images/DBF-Logo-Black.png"
              alt="Dickinson Bayou Fleeting — barge fleeting and dock leasing, Galveston Bay & Houston Ship Channel"
              className="nav__logo nav__logo--light"
            />
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
            <li className="nav__item nav__cta">
              <a href="#rates" className="nav__action" onClick={openInquiry}>
                Get Quote
              </a>
            </li>
          </ul>

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
          <li className="nav__drawerItem">
            <a
              href="#rates"
              className="nav__action nav__drawerCta"
              onClick={openInquiry}
            >
              Get Quote
            </a>
          </li>
        </ul>
      </div>
    </>
  );
}

export default NavBar;
