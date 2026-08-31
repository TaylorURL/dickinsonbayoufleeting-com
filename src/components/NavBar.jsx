import { useEffect, useState } from "react";
import "./styles/NavBar.css";
import { NAV_LINKS } from "../app/constants/navLinks";
import { PHONE_NUMBER } from "../app/constants/phoneNumber";
import { useScrolled } from "../app/hooks/useScrolled";
import { useRouter, normalisePath } from "../app/router/Router";
import { Link } from "../app/router/Link";
import { ArrowRightIcon, PhoneIcon } from "./Icons";

function NavBar({ surface = "dark", overHero = true }) {
  const [open, setOpen] = useState(false);
  // Which top-level entry has its panel down. One at a time, so opening a
  // second closes the first rather than stacking two panels over the page.
  const [openMenu, setOpenMenu] = useState(null);
  const scrolled = useScrolled(12);
  const { path } = useRouter();
  const activePath = normalisePath(path);

  // While at the very top of the home page the nav floats over the
  // dark hero. Anywhere else (or once scrolled past it) the nav adopts
  // the surface of whatever section is currently behind it.
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

  useEffect(() => {
    setOpen(false);
    setOpenMenu(null);
  }, [path]);

  // Escape closes a panel wherever focus is, and a pointer or focus landing
  // outside the row closes it too: a panel left down over the page is the
  // failure mode of every hover menu.
  useEffect(() => {
    if (!openMenu) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") setOpenMenu(null);
    };
    const onAway = (e) => {
      if (!e.target.closest?.(".nav__links")) setOpenMenu(null);
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onAway);
    document.addEventListener("focusin", onAway);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onAway);
      document.removeEventListener("focusin", onAway);
    };
  }, [openMenu]);

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
        className="nav"
        data-scrolled={scrolled || open}
        data-open={open}
        data-over-hero={overHero}
        data-surface={effectiveSurface}
        aria-label="Primary"
      >
        <div className="nav__inner">
          <Link
            to="/"
            className="nav__brand"
            aria-label="Dickinson Bayou Fleeting, Home"
            onClick={closeMenu}
          >
            <img
              src="/images/DBF-Logo-White.png"
              srcSet="/images/DBF-Logo-White-120.png 120w, /images/DBF-Logo-White-240.png 240w, /images/DBF-Logo-White.png 500w"
              sizes="(max-width: 700px) 96px, 120px"
              alt="Dickinson Bayou Fleeting"
              className="nav__logo nav__logo--dark"
              width="240"
              height="240"
              fetchPriority="high"
            />
            <img
              src="/images/DBF-Logo-Black.png"
              srcSet="/images/DBF-Logo-Black-120.png 120w, /images/DBF-Logo-Black-240.png 240w, /images/DBF-Logo-Black.png 500w"
              sizes="(max-width: 700px) 96px, 120px"
              alt="Dickinson Bayou Fleeting"
              className="nav__logo nav__logo--light"
              width="240"
              height="240"
              fetchPriority="high"
            />
          </Link>

          <ul className="nav__links">
            {NAV_LINKS.map((l) => {
              const isActive = activePath === normalisePath(l.to);
              if (!l.items) {
                return (
                  <li key={l.to} className="nav__item">
                    <Link
                      className="nav__link"
                      data-active={isActive}
                      to={l.to}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {l.label}
                    </Link>
                  </li>
                );
              }
              const isOpen = openMenu === l.label;
              return (
                <li
                  key={l.to}
                  className="nav__item nav__item--menu"
                  data-open={isOpen}
                  onMouseEnter={() => setOpenMenu(l.label)}
                  onMouseLeave={() => setOpenMenu(null)}
                >
                  <button
                    type="button"
                    className="nav__link nav__link--trigger"
                    data-active={isActive}
                    aria-expanded={isOpen}
                    aria-controls={`nav-menu-${l.label.toLowerCase()}`}
                    onClick={() => setOpenMenu(isOpen ? null : l.label)}
                  >
                    {l.label}
                    <span className="nav__caret" aria-hidden="true" />
                  </button>

                  <div
                    id={`nav-menu-${l.label.toLowerCase()}`}
                    className="nav__panel"
                    data-open={isOpen}
                  >
                    <ul className="nav__panelGrid">
                      {l.items.map((item) => (
                        <li key={item.to}>
                          <Link
                            className="nav__panelItemLink"
                            to={item.to}
                            tabIndex={isOpen ? undefined : -1}
                          >
                            <span className="nav__panelItemName">
                              {item.label}
                            </span>
                            <span className="nav__panelItemHint">
                              {item.hint}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <Link
                      className="nav__panelFoot"
                      to={l.footTo}
                      tabIndex={isOpen ? undefined : -1}
                    >
                      {l.footLabel}
                      <ArrowRightIcon size={12} />
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="nav__actions">
            <a className="nav__phone tabular" href={phoneHref}>
              <PhoneIcon className="nav__phoneIcon" size={14} />
              <span className="nav__phoneNumber">{PHONE_NUMBER}</span>
            </a>
            <a href="#quote" className="nav__action" onClick={openInquiry}>
              Request Quote
            </a>
          </div>

          <button
            type="button"
            className="nav__toggle"
            aria-expanded={open}
            aria-controls="nav-mobile-drawer"
            aria-label={open ? "Close Menu" : "Open Menu"}
            onClick={() => setOpen((o) => !o)}
          >
            <span className="nav__toggleBar" />
            <span className="nav__toggleBar" />
            <span className="nav__toggleBar" />
          </button>
        </div>
      </nav>

      <button
        type="button"
        className="nav__scrim"
        data-visible={open}
        onClick={closeMenu}
        tabIndex={open ? 0 : -1}
        aria-label="Close Menu"
      />

      <div
        id="nav-mobile-drawer"
        className="nav__drawer"
        data-open={open}
        data-surface="dark"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation"
      >
        <ul className="nav__panelLinks">
          {NAV_LINKS.map((l) => {
            const isActive = activePath === normalisePath(l.to);
            return (
              <li key={l.to} className="nav__panelItem">
                <Link
                  className="nav__panelLink"
                  data-active={isActive}
                  to={l.to}
                  onClick={closeMenu}
                  aria-current={isActive ? "page" : undefined}
                >
                  {l.label}
                </Link>
                {l.items && (
                  <ul className="nav__panelSub">
                    {l.items.map((item) => (
                      <li key={item.to}>
                        <Link
                          className="nav__panelSubLink"
                          to={item.to}
                          onClick={closeMenu}
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
          <li className="nav__panelItem nav__panelItem--phone">
            <a className="nav__panelPhone tabular" href={phoneHref}>
              <span className="nav__panelPhoneLabel">Direct Line</span>
              <span className="nav__panelPhoneNumber">{PHONE_NUMBER}</span>
            </a>
          </li>
          <li className="nav__panelItem">
            <a
              href="#quote"
              className="nav__action nav__panelCta"
              onClick={openInquiry}
            >
              Request Quote
            </a>
          </li>
        </ul>
      </div>
    </>
  );
}

export default NavBar;
