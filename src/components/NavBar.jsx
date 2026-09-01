import { useEffect, useState } from "react";
import { NAV_LINKS } from "../app/constants/navLinks";
import { PHONE_NUMBER } from "../app/constants/phoneNumber";
import { HOURS_SHORT } from "../app/constants/hours";
import { FACILITIES } from "../app/constants/facilities";
import { useScrolled } from "../app/hooks/useScrolled";
import { useRouter, normalisePath } from "../app/router/Router";
import { Link } from "../app/router/Link";
import { ArrowRightIcon, PhoneIcon, SearchIcon } from "./Icons";
import { shortcutLabel } from "../app/hooks/useSearchShortcut";
import Logo from "./ui/Logo";

/* nav: n7-brutal-slab */
/* panel: mm3-grouped-columns */

// A slab: solid ground, a two-pixel rule for an edge, the wordmark hard left,
// the destinations set in the body face, and one filled action hard right. It
// is the same language the rest of the site is set in - condensed caps, mono
// micro-labels, square corners - rather than the frosted body-face bar every
// marketing page reaches for first.
//
// No blur, no shadow, no rounded corner. Those vocabularies fight a slab, and
// a bar that is only translucent is unreadable the moment the blur is not
// understood.
//
// The centre column is a grid track rather than free space between two flex
// items, so the destinations stay put as the wordmark and the action change
// width across breakpoints.
//
// The bar adopts the surface of whatever band sits behind it, so the links stay
// legible as the page alternates between hull and foam. The drawer stays a
// full-screen dark overlay whatever the bar is wearing: a drawer that changed
// colour with the page behind it would make the brand read differently every
// time it opened.

// Two yards, a working day and a number are what a caller needs and what the
// bar was carrying instead of destinations. They sit in a strip above it, so
// the bar itself holds the destinations and one action and nothing else.
//
// The strip is the first thing off the top of the page: past the first scroll
// the whole header lifts by exactly the strip's height, docking the bar to the
// edge. It is a transform on the header rather than a height on the strip,
// because animating a height reflows everything underneath it on every frame.
//
// Below the bar's own breakpoint the strip is not drawn at all and its height
// token is zero - a phone already carries the number on the fixed call bar at
// the bottom of the screen, which is the end of the thumb's reach rather than
// the far end of it.
const UTILITY_STRIP = [
  "hidden h-rail items-center border-b border-hairline bg-bg-deep md:flex",
  "transition-[background-color,border-color] duration-settle ease-settle",
].join(" ");

const STRIP_ITEM =
  "inline-flex items-center gap-2 whitespace-nowrap font-body text-3xs font-semibold text-muted";

const STRIP_LINK =
  "inline-flex items-center gap-2 whitespace-nowrap rounded-sm font-body text-3xs font-semibold text-secondary no-underline transition-[color,transform,opacity] duration-quick ease-settle hover:text-primary focus-visible:text-primary focus-visible:shadow-focus focus-visible:outline-none";

const HEADER = [
  "fixed inset-x-0 top-0 z-nav flex flex-col",
  "font-body text-primary",
  "transition-transform duration-settle ease-settle motion-reduce:transition-none",
  "data-[docked=true]:-translate-y-rail",
].join(" ");

const BAR = [
  "flex h-nav items-center gap-0",
  "border-b-2 border-border-strong bg-bg",
  "transition-[background-color,border-color,color] duration-settle ease-settle",
  // Off the top of the page the ground drops a step, so the slab reads as
  // sitting over the content rather than in it.
  "data-[scrolled=true]:bg-bg-deep",
].join(" ");

// Laid out at full width and scaled, so the underline grows on the compositor
// instead of relaying out the row on every pointer crossing.
const LINK_RULE =
  "after:absolute after:bottom-0.5 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-highlight after:transition-transform after:duration-settle after:ease-settle after:content-[''] hover:after:scale-x-100 focus-visible:after:scale-x-100 motion-reduce:after:transition-none";

const LINK = [
  "relative inline-flex min-h-control-sm items-center px-1",
  "font-body text-sm font-medium no-underline",
  "select-none",
  "transition-colors duration-quick ease-settle",
  "hover:text-primary focus-visible:text-primary focus-visible:outline-none",
].join(" ");

// The panel runs the full width of the bar and drops from its lower edge, so
// it reads as the bar opening rather than as a box hung off one word. Laid out
// at all times and switched on opacity, transform and visibility, so opening
// it composites rather than relaying out the page underneath.
//
// Opaque, with no blur: it covers a page of type with a page of type, and
// anything showing through puts the two on top of each other at the moment a
// visitor is reading to choose where to go.
const MENU_PANEL = [
  "invisible absolute inset-x-0 top-full hidden -translate-y-1.5 opacity-0",
  "border-b-2 border-border-strong bg-surface shadow-lg",
  "transition-[opacity,transform,visibility] delay-[0ms,0ms,280ms] duration-settle ease-settle",
  "data-[open=true]:visible data-[open=true]:translate-y-0 data-[open=true]:opacity-100 data-[open=true]:delay-0",
  "motion-reduce:transition-none md:block",
].join(" ");

const PANEL_HEADING = "m-0 font-body text-3xs font-semibold text-muted";

// All three bars sit on the middle line and are pushed apart by transform, so
// the morph into a cross runs entirely on the compositor.
const TOGGLE_BAR =
  "absolute left-1/2 top-6 h-[1.5px] w-tick origin-center transition-[transform,opacity,background-color] duration-settle ease-settle motion-reduce:transition-none";

const NAV_LOGO_SIZES = "(max-width: 720px) 140px, 200px";

const CHROME_ROW = "mx-auto flex w-full max-w-container items-center px-gutter";

function NavBar({ surface = "dark", onSearch }) {
  const [open, setOpen] = useState(false);
  // Read once on mount rather than at render, so the server-rendered markup and
  // the first client paint agree on which vocabulary the shortcut is printed in.
  const [shortcut, setShortcut] = useState("Ctrl K");
  useEffect(() => setShortcut(shortcutLabel()), []);
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

  const phoneHref = `tel:1${PHONE_NUMBER.replace(/[^0-9]/g, "")}`;
  const closeMenu = () => setOpen(false);

  const openInquiry = (e) => {
    e.preventDefault();
    closeMenu();
    window.dispatchEvent(new Event("inquiry:open"));
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
        {/* Where the yards are, when somebody answers, and the number. None of
            it is a destination, which is why none of it is in the bar. */}
        <div
          data-utility-bar
          aria-label="Contact and hours"
          className={UTILITY_STRIP}
        >
          <div className={`${CHROME_ROW} justify-between gap-6`}>
            <ul className="m-0 flex list-none items-center gap-5 p-0">
              {FACILITIES.map((facility) => (
                <li key={facility.id} className="flex gap-0">
                  <Link to={`/contact#${facility.id}`} className={STRIP_LINK}>
                    <span
                      aria-hidden="true"
                      className="inline-block h-px w-icon-sm flex-none bg-highlight"
                    />
                    {facility.shortName}
                    <span className="text-muted">{facility.waterway}</span>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-6">
              <p className={`${STRIP_ITEM} m-0 hidden lg:inline-flex`}>
                {HOURS_SHORT}
              </p>
              <a
                href={phoneHref}
                aria-label={`Call ${PHONE_NUMBER}`}
                className={STRIP_LINK}
              >
                <PhoneIcon size={12} className="flex-none text-highlight" />
                <span className="tabular-nums">{PHONE_NUMBER}</span>
              </a>
              {/* The index reaches every page, so it belongs with the other
                  things the bar was carrying that are not destinations. The
                  trigger prints its own shortcut, which is the whole reason a
                  reader ever learns there is one. */}
              <button
                type="button"
                onClick={onSearch}
                aria-label="Search this site"
                aria-keyshortcuts="Meta+K Control+K"
                className={`${STRIP_LINK} group border-0 bg-transparent p-0`}
              >
                <SearchIcon size={12} className="flex-none" />
                <span className="hidden lg:inline">Search</span>
                <span className="hidden rounded-xs border border-border px-1.5 tabular-nums text-muted transition-colors duration-quick group-hover:border-border-strong lg:inline">
                  {shortcut}
                </span>
              </button>
            </div>
          </div>
        </div>

        <div data-scrolled={scrolled || open} className={BAR}>
          <nav
            aria-label="Primary"
            className={`${CHROME_ROW} h-full flex-1 justify-between gap-6 md:grid md:grid-cols-[1fr_auto_1fr]`}
          >
            <Link
              to="/"
              aria-label="Dickinson Bayou Fleeting, Home"
              onClick={closeMenu}
              className="inline-flex h-control-sm items-center no-underline transition-transform duration-settle ease-settle hover:-translate-y-px focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-highlight motion-reduce:transition-none md:justify-self-start"
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
              className="m-0 hidden list-none items-center p-0 md:flex md:justify-self-center md:gap-7"
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
                      className={`${LINK} ${LINK_RULE} gap-2 border-0 bg-transparent ${
                        isActive || isOpen
                          ? "text-primary after:scale-x-100"
                          : "text-secondary"
                      }`}
                    >
                      {l.label}
                      <span
                        aria-hidden="true"
                        className={`h-[6px] w-[6px] border-b-[1.5px] border-r-[1.5px] border-current opacity-50 transition-transform duration-settle ease-settle motion-reduce:transition-none ${
                          isOpen
                            ? "translate-y-px rotate-[225deg]"
                            : "-translate-y-0.5 rotate-45"
                        }`}
                      />
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="flex items-center gap-0 md:justify-self-end md:gap-4">
              {/* The bar ends in one loud action, and it is the only filled
                  control up here. */}
              <a
                href="#quote"
                onClick={openInquiry}
                className="relative hidden min-h-control-sm select-none items-center justify-center gap-3 rounded-sm border border-transparent bg-highlight px-5 font-body text-xs font-semibold text-on-highlight no-underline transition-[background-color,color,border-color,transform,box-shadow] duration-quick ease-settle hover:bg-highlight-hover focus-visible:shadow-focus-accent focus-visible:outline-none md:inline-flex"
              >
                Request Quote
              </a>
            </div>

            <button
              type="button"
              aria-expanded={open}
              aria-controls="nav-mobile-drawer"
              aria-label={open ? "Close Menu" : "Open Menu"}
              onClick={() => setOpen((o) => !o)}
              className="relative inline-flex h-control-sm w-control-sm items-center justify-center rounded-sm border border-border-strong bg-transparent p-0 transition-[border-color,transform] duration-quick ease-settle hover:border-highlight focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-highlight md:hidden"
            >
              <span
                className={`${TOGGLE_BAR} ${
                  open
                    ? "-translate-x-1/2 rotate-45 bg-highlight"
                    : "-translate-x-1/2 -translate-y-1.5 bg-primary"
                }`}
              />
              <span
                className={`${TOGGLE_BAR} -translate-x-1/2 ${
                  open ? "bg-highlight opacity-0" : "bg-primary opacity-100"
                }`}
              />
              <span
                className={`${TOGGLE_BAR} ${
                  open
                    ? "-translate-x-1/2 -rotate-45 bg-highlight"
                    : "-translate-x-1/2 translate-y-1.5 bg-primary"
                }`}
              />
            </button>
          </nav>
        </div>

        {/* One panel body per entry that has groups, laid out under the whole
            bar. The columns are the design: a visitor reads three headings and
            knows which one is theirs before reading a destination. */}
        {NAV_LINKS.filter((l) => l.groups).map((l) => {
          const isOpen = openMenu === l.label;
          return (
            <div
              key={l.label}
              id={`nav-menu-${l.label.toLowerCase()}`}
              data-open={isOpen}
              data-surface="dark"
              className={MENU_PANEL}
            >
              <div
                className={`${CHROME_ROW} flex-col items-stretch gap-8 py-8`}
              >
                <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,15rem),1fr))] gap-x-9 gap-y-8">
                  {l.groups.map((group) => (
                    <section
                      key={group.heading}
                      className="flex flex-col gap-4"
                    >
                      <h2 className={PANEL_HEADING}>{group.heading}</h2>
                      <ul className="m-0 flex list-none flex-col gap-0 p-0">
                        {group.items.map((item) => (
                          <li key={item.to} className="flex gap-0">
                            <Link
                              to={item.to}
                              tabIndex={isOpen ? undefined : -1}
                              className="flex w-full flex-col gap-1 rounded-sm px-3 py-3 no-underline transition-[background-color,transform,opacity] duration-quick ease-settle hover:bg-bg focus-visible:shadow-focus focus-visible:outline-none"
                            >
                              <span className="font-body text-base font-semibold text-primary">
                                {item.label}
                              </span>
                              {/* One line is the whole budget. The panel only
                                  has to say which of the seven this is. */}
                              <span className="font-body text-2xs leading-normal text-faint [overflow-wrap:anywhere]">
                                {item.hint}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </section>
                  ))}
                </div>

                {/* The panel closes on the two things a visitor who did not
                    find their column still wants: the whole list, and a
                    person. */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-t border-hairline pt-5">
                  <Link
                    to={l.footTo}
                    tabIndex={isOpen ? undefined : -1}
                    className="inline-flex items-center gap-2 rounded-sm font-body text-2xs font-semibold text-highlight no-underline transition-[color,transform,opacity] duration-quick ease-settle hover:text-primary focus-visible:shadow-focus focus-visible:outline-none"
                  >
                    {l.footLabel}
                    <ArrowRightIcon size={12} />
                  </Link>
                  <a
                    href={phoneHref}
                    tabIndex={isOpen ? undefined : -1}
                    className="inline-flex items-center gap-2 rounded-sm font-body text-2xs font-semibold tabular-nums text-secondary no-underline transition-[color,transform,opacity] duration-quick ease-settle hover:text-primary focus-visible:shadow-focus focus-visible:outline-none"
                  >
                    <PhoneIcon size={12} className="flex-none text-highlight" />
                    {PHONE_NUMBER}
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </header>

      {/* A real button, so the drawer can be dismissed from the keyboard as
          well as by tapping beside it. Nothing is written inside it, so its
          name lives on the element rather than in the markup. */}
      <button
        type="button"
        data-visible={open}
        onClick={closeMenu}
        tabIndex={open ? 0 : -1}
        aria-label="Close Menu"
        className="pointer-events-none fixed inset-0 z-scrim appearance-none border-0 bg-bg-deep p-0 opacity-0 transition-opacity duration-settle ease-settle hover:opacity-[0.68] focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-highlight data-[visible=true]:pointer-events-auto data-[visible=true]:opacity-60"
      />

      <div
        id="nav-mobile-drawer"
        data-open={open}
        data-surface="dark"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation"
        className="invisible fixed inset-0 z-drawer block translate-y-[-12px] overflow-y-auto overscroll-contain border-t border-border bg-bg-deep bg-hull bg-hull-grid pt-nav opacity-0 shadow-lg transition-[opacity,transform,visibility] delay-[0ms,0ms,280ms] duration-settle ease-settle data-[open=true]:visible data-[open=true]:translate-y-0 data-[open=true]:opacity-100 data-[open=true]:delay-0 motion-reduce:transition-none md:hidden"
      >
        <ul className="mx-auto flex h-full max-w-container list-none flex-col gap-0 px-gutter pb-9 pt-8">
          {NAV_LINKS.map((l) => {
            const isActive = activePath === normalisePath(l.to);
            return (
              <li
                key={l.to}
                className="flex flex-col gap-0 border-b border-hairline"
              >
                <Link
                  to={l.to}
                  onClick={closeMenu}
                  aria-current={isActive ? "page" : undefined}
                  className={`group/row flex min-h-control w-full select-none items-center justify-between gap-4 py-4 font-condensed text-h3 uppercase no-underline transition-colors duration-quick ease-settle hover:text-highlight focus-visible:text-highlight focus-visible:outline-none ${
                    isActive ? "text-highlight" : "text-primary"
                  }`}
                >
                  {l.label}
                  <ArrowRightIcon
                    size={18}
                    className={`flex-none text-faint transition-transform duration-settle ease-settle group-hover/row:translate-x-2 motion-reduce:transition-none ${
                      isActive ? "translate-x-2" : ""
                    }`}
                  />
                </Link>
                {/* In the drawer the same tree is simply indented under its
                    headings; a phone has the height for it and no room for a
                    hover panel. */}
                {l.groups ? (
                  <div className="flex flex-col gap-5 border-l border-hairline pb-5 pl-5">
                    {l.groups.map((group) => (
                      <div key={group.heading} className="flex flex-col gap-2">
                        <p className={PANEL_HEADING}>{group.heading}</p>
                        <ul className="m-0 flex list-none flex-col gap-1 p-0">
                          {group.items.map((item) => (
                            <li key={item.to}>
                              <Link
                                to={item.to}
                                onClick={closeMenu}
                                className="flex min-h-control-sm items-center gap-2 rounded-sm font-body text-sm text-secondary no-underline transition-[color,transform,opacity] duration-quick ease-settle hover:text-primary focus-visible:shadow-focus focus-visible:outline-none"
                              >
                                {item.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : null}
              </li>
            );
          })}

          <li className="mt-6 flex flex-col gap-4">
            {/* The strip that carries the index on a wide screen is not drawn
                here, so the drawer is where a phone reaches it. */}
            <button
              type="button"
              onClick={() => {
                closeMenu();
                onSearch?.();
              }}
              className="flex w-full items-center gap-3 rounded-sm border border-border bg-transparent px-4 py-4 font-body text-xs font-semibold text-secondary transition-[color,border-color,transform,opacity] duration-quick ease-settle hover:border-border-strong hover:text-primary focus-visible:shadow-focus focus-visible:outline-none"
            >
              <SearchIcon size={14} className="flex-none" />
              Search This Site
            </button>
            <div className="flex gap-0 border-t border-hairline">
              <a
                href={phoneHref}
                className="flex w-full flex-col gap-1 py-4 no-underline transition-colors duration-quick ease-settle hover:text-highlight focus-visible:text-highlight focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-highlight-ring"
              >
                <span className="font-body text-xs font-semibold text-faint">
                  Direct Line
                </span>
                <span className="whitespace-nowrap font-mono text-xl font-medium tabular-nums text-primary">
                  {PHONE_NUMBER}
                </span>
              </a>
            </div>
            <a
              href="#quote"
              onClick={openInquiry}
              className="relative inline-flex w-full select-none items-center justify-center gap-3 rounded-sm border border-transparent bg-highlight px-6 py-5 font-body text-xs font-semibold text-on-highlight no-underline transition-[background-color,transform,box-shadow] duration-quick ease-settle hover:bg-highlight-hover focus-visible:shadow-focus-accent focus-visible:outline-none"
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
