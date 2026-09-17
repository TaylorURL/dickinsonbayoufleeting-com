import { useEffect, useState } from "react";
import { NAV_LINKS } from "../../app/content/navLinks";
import { openInquiry } from "../../app/openInquiry";
import { useScrolled } from "../../app/hooks/useScrolled";
import { useRouter, normalisePath } from "../../app/router/Router";
import { Link } from "../../app/router/Link";
import { PHONE_NUMBER, telHref } from "../../app/content/phoneNumber";
import Button from "../ui/Button";
import Logo from "../ui/Logo";
import { PhoneIcon } from "../ui/Icons";
import MobileDrawer from "./nav/MobileDrawer";
import NavMenuPanel from "./nav/NavMenuPanel";
import UtilityStrip from "./nav/UtilityStrip";
import { CHROME_ROW } from "./nav/chrome";

// A slab: solid ground, a hairline for an edge, the wordmark hard left, the
// destinations set in the body face, and one filled action hard right. It is
// the same language the rest of the site is set in - condensed caps, mono
// micro-labels, square corners - rather than the frosted body-face bar every
// marketing page reaches for first.
//
// No blur, no shadow, no rounded corner. Those vocabularies fight a slab, and
// a bar that is only translucent is unreadable the moment the blur is not
// understood.
//
// The bar adopts the surface of whatever band sits behind it, so the links stay
// legible as the page alternates between hull and foam.
//
// Four pieces of chrome, four files: the strip above the bar, the bar itself,
// the panel an entry with groups drops, and the drawer a phone opens. Only the
// open state is shared, and it lives here.

const HEADER = [
  "fixed inset-x-0 top-0 z-nav flex flex-col",
  "font-body text-primary",
  "transition-transform duration-settle ease-settle motion-reduce:transition-none",
  "data-[docked=true]:-translate-y-strip",
].join(" ");

const BAR = [
  "flex h-nav items-center gap-0",
  "border-b border-border-strong bg-bg",
  "transition-[background-color,border-color,color] duration-settle ease-settle",
  // Off the top of the page the ground drops a step, so the slab reads as
  // sitting over the content rather than in it.
  "data-[scrolled=true]:bg-bg-deep",
].join(" ");

// Laid out at full width and scaled, so the underline grows on the compositor
// instead of relaying out the row on every pointer crossing.
const LINK_RULE =
  "after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-highlight after:transition-transform after:duration-settle after:ease-settle after:content-[''] hover:after:scale-x-100 focus-visible:after:scale-x-100 motion-reduce:after:transition-none";

const LINK = [
  "relative inline-flex items-center",
  "font-body text-micro no-underline select-none",
  "transition-colors duration-quick ease-settle",
  "hover:text-primary focus-visible:text-primary focus-visible:outline-none",
].join(" ");

// All three bars sit on the middle line and are pushed apart by transform, so
// the morph into a cross runs entirely on the compositor.
const TOGGLE_BAR =
  "absolute left-1/2 top-1/2 h-px w-5 origin-center bg-primary transition-transform duration-settle ease-settle motion-reduce:transition-none";

// The width the mark actually draws at, which is its height times its own
// aspect: 26px high on a phone and 32 above the break.
const NAV_LOGO_SIZES = "(max-width: 899px) 85px, 104px";

function NavBar({ surface = "dark", onSearch }) {
  const [open, setOpen] = useState(false);
  // Which top-level entry has its panel down. One at a time, so opening a
  // second closes the first rather than stacking two panels over the page.
  const [openMenu, setOpenMenu] = useState(null);
  const scrolled = useScrolled(12);
  const { path } = useRouter();
  const activePath = normalisePath(path);

  // The drawer is always dark, so the bar goes dark with it while it is open.
  // Otherwise the bar adopts the surface of whatever band is directly beneath.
  const effectiveSurface = open ? "dark" : surface;

  // An open panel holds the strip down: retracting the header while a visitor
  // is reading the panel would take the whole thing out from under the pointer.
  const docked = scrolled && !openMenu;

  useEffect(() => {
    setOpen(false);
    setOpenMenu(null);
  }, [path]);

  // Escape closes a panel wherever focus is, and a pointer or focus landing
  // outside the header closes it too: a panel left down over the page is the
  // failure mode of every hover menu.
  useEffect(() => {
    if (!openMenu) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") setOpenMenu(null);
    };
    const onAway = (e) => {
      if (!e.target.closest?.("[data-nav]")) setOpenMenu(null);
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

  const closeMenu = () => setOpen(false);

  const requestInquiry = (e) => {
    closeMenu();
    openInquiry(e);
  };

  return (
    <>
      {/* The bar is the site's banner landmark and the row inside it is the
          navigation, so a reader jumping by landmark lands on the header and
          finds the destinations under it rather than the other way round. */}
      <header
        data-nav
        data-docked={docked}
        data-open={open}
        data-surface={effectiveSurface}
        className={`group/nav ${HEADER}`}
        onMouseLeave={() => setOpenMenu(null)}
      >
        <UtilityStrip onSearch={onSearch} />

        <div data-scrolled={scrolled || open} className={BAR}>
          <nav
            aria-label="Primary"
            className={`${CHROME_ROW} h-full flex-1 justify-between gap-6`}
          >
            <Link
              to="/"
              aria-label="Dickinson Bayou Fleeting, Home"
              onClick={closeMenu}
              className="inline-flex items-center no-underline focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-highlight"
            >
              {/* The mark is drawn small inside a square canvas, so the box is
                  set several times the bar's height and overflows it. Centring
                  is the flex line's job alone: a margin on top of that puts the
                  mark off the bar's centre line. */}
              <Logo
                tone="White"
                sizes={NAV_LOGO_SIZES}
                priority
                className="block h-nav-logo group-data-[surface=light]/nav:hidden"
              />
              <Logo
                tone="Black"
                sizes={NAV_LOGO_SIZES}
                priority
                className="hidden h-nav-logo group-data-[surface=light]/nav:block"
              />
            </Link>

            <ul
              data-nav-links
              className="m-0 hidden list-none items-center gap-7 p-0 md:flex"
            >
              {NAV_LINKS.map((l) => {
                const isActive = activePath === normalisePath(l.to);
                if (!l.groups) {
                  return (
                    <li key={l.to} className="flex gap-0">
                      <Link
                        to={l.to}
                        aria-current={isActive ? "page" : undefined}
                        className={`${LINK} ${LINK_RULE} ${
                          isActive
                            ? "text-primary after:scale-x-100"
                            : "text-secondary"
                        }`}
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
                    className="flex gap-0"
                    onMouseEnter={() => setOpenMenu(l.label)}
                  >
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={`nav-menu-${l.label.toLowerCase()}`}
                      onClick={() => setOpenMenu(isOpen ? null : l.label)}
                      className={`${LINK} ${LINK_RULE} gap-2 border-0 bg-transparent p-0 ${
                        isActive || isOpen
                          ? "text-primary after:scale-x-100"
                          : "text-secondary"
                      }`}
                    >
                      {l.label}
                      <span
                        aria-hidden="true"
                        className={`h-2 w-2 border-b border-r border-current transition-transform duration-settle ease-settle motion-reduce:transition-none ${
                          isOpen
                            ? "rotate-[225deg]"
                            : "-translate-y-px rotate-45"
                        }`}
                      />
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="flex items-center gap-5 md:gap-4">
              {/* The number is on the bar at phone widths because the drawer
                  is two taps away and a caller should not have to open it. */}
              <a
                href={telHref()}
                aria-label={`Call ${PHONE_NUMBER}`}
                className="inline-flex items-center text-primary transition-colors duration-quick ease-settle hover:text-highlight focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-highlight md:hidden"
              >
                <PhoneIcon size={18} />
              </a>

              {/* The bar ends in one loud action, and it is the only filled
                  control up here. */}
              <Button
                variant="primary"
                size="sm"
                href="#quote"
                onClick={requestInquiry}
                className="hidden md:inline-flex"
              >
                Request Quote
              </Button>

              <button
                type="button"
                aria-expanded={open}
                aria-controls="nav-mobile-drawer"
                aria-label={open ? "Close Menu" : "Open Menu"}
                onClick={() => setOpen((o) => !o)}
                className="relative -mr-1 inline-flex h-control-md w-control-md items-center justify-center rounded-sm border-0 bg-transparent p-0 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-highlight md:hidden"
              >
                <span
                  className={`${TOGGLE_BAR} ${
                    open
                      ? "-translate-x-1/2 rotate-45"
                      : "-translate-x-1/2 -translate-y-[5px]"
                  }`}
                />
                <span
                  className={`${TOGGLE_BAR} -translate-x-1/2 ${
                    open ? "opacity-0" : "opacity-100"
                  }`}
                />
                <span
                  className={`${TOGGLE_BAR} ${
                    open
                      ? "-translate-x-1/2 -rotate-45"
                      : "-translate-x-1/2 translate-y-[5px]"
                  }`}
                />
              </button>
            </div>
          </nav>
        </div>

        {NAV_LINKS.filter((l) => l.groups).map((l) => (
          <NavMenuPanel key={l.label} link={l} open={openMenu === l.label} />
        ))}
      </header>

      <MobileDrawer
        open={open}
        activePath={activePath}
        onClose={closeMenu}
        onSearch={onSearch}
        onInquiry={requestInquiry}
      />
    </>
  );
}

export default NavBar;
