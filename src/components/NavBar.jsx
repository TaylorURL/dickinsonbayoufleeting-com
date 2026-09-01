import { useEffect, useState } from "react";
import { NAV_LINKS } from "../app/constants/navLinks";
import { PHONE_NUMBER } from "../app/constants/phoneNumber";
import { useScrolled } from "../app/hooks/useScrolled";
import { useRouter, normalisePath } from "../app/router/Router";
import { Link } from "../app/router/Link";
import { ArrowRightIcon, PhoneIcon } from "./Icons";
import Logo from "./ui/Logo";

/* nav: n7-brutal-slab */
/* panel: mm2-two-column-split */

// A slab: solid ground, a two-pixel rule for an edge, the wordmark hard left,
// the destinations tracked and uppercase, and one filled action hard right. It
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
const BAR = [
  "fixed inset-x-0 top-0 z-nav flex h-nav items-center gap-0",
  "border-b-2 border-border-strong bg-bg font-body text-primary",
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
  "font-mono text-xs font-medium uppercase tracking-control no-underline",
  "select-none",
  "transition-colors duration-quick ease-settle",
  "hover:text-primary focus-visible:text-primary focus-visible:outline-none active:scale-[0.97]",
].join(" ");

// All three bars sit on the middle line and are pushed apart by transform, so
// the morph into a cross runs entirely on the compositor.
const TOGGLE_BAR =
  "absolute left-1/2 top-6 h-[1.5px] w-tick origin-center transition-[transform,opacity,background-color] duration-settle ease-settle motion-reduce:transition-none";

const NAV_LOGO_SIZES = "(max-width: 720px) 140px, 200px";

function NavBar({ surface = "dark" }) {
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
      if (!e.target.closest?.("[data-nav-links]")) setOpenMenu(null);
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
        data-scrolled={scrolled || open}
        data-open={open}
        data-surface={effectiveSurface}
        className={`group/nav ${BAR}`}
      >
        <nav
          aria-label="Primary"
          className="relative mx-auto flex h-full w-full max-w-container flex-1 items-center justify-between gap-6 px-gutter md:grid md:grid-cols-[1fr_auto_1fr]"
        >
          <Link
            to="/"
            aria-label="Dickinson Bayou Fleeting, Home"
            onClick={closeMenu}
            className="inline-flex h-control-sm items-center no-underline transition-transform duration-settle ease-settle hover:-translate-y-px focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-highlight active:scale-[0.99] motion-reduce:transition-none md:justify-self-start"
          >
            {/* The mark is drawn small inside a square canvas, so the box is set
                several times the bar's height and overflows it. Centring is the
                flex line's job alone: a margin on top of that puts the mark off
                the bar's centre line. */}
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
              if (!l.items) {
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
                  className="group/menu relative flex gap-0"
                  onMouseEnter={() => setOpenMenu(l.label)}
                  onMouseLeave={() => setOpenMenu(null)}
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`nav-menu-${l.label.toLowerCase()}`}
                    onClick={() => setOpenMenu(isOpen ? null : l.label)}
                    className={`${LINK} ${LINK_RULE} gap-2 border-0 bg-transparent ${
                      isActive
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

                  {/* Laid out at all times and switched on opacity, transform
                      and visibility, so opening it composites rather than
                      relaying out the row underneath. */}
                  <div
                    id={`nav-menu-${l.label.toLowerCase()}`}
                    data-open={isOpen}
                    className="invisible absolute left-1/2 top-[calc(100%+theme(spacing.2))] hidden w-max max-w-[min(44rem,calc(100vw-theme(spacing.8)))] -translate-x-1/2 -translate-y-1.5 border border-border bg-surface p-4 opacity-0 shadow-lg transition-[opacity,transform,visibility] delay-[0ms,0ms,280ms] duration-settle ease-settle data-[open=true]:visible data-[open=true]:translate-y-0 data-[open=true]:opacity-100 data-[open=true]:delay-0 motion-reduce:transition-none md:block"
                  >
                    <ul className="m-0 grid list-none grid-cols-2 gap-0 gap-x-4 p-0">
                      {l.items.map((item) => (
                        <li key={item.to}>
                          <Link
                            to={item.to}
                            tabIndex={isOpen ? undefined : -1}
                            className="flex flex-col gap-1 px-3 pb-4 pt-3 no-underline transition-colors duration-quick ease-settle hover:bg-bg focus-visible:shadow-focus focus-visible:outline-none active:scale-[0.98]"
                          >
                            <span className="font-condensed text-md font-semibold uppercase tracking-normal text-primary">
                              {item.label}
                            </span>
                            {/* Two lines is the whole budget. The summaries are
                                written for the services page, where they have a
                                column to themselves; here they only have to say
                                which of the seven this is. */}
                            <span className="line-clamp-2 font-body text-2xs leading-normal text-faint [overflow-wrap:anywhere]">
                              {item.hint}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <Link
                      to={l.footTo}
                      tabIndex={isOpen ? undefined : -1}
                      className="mt-4 inline-flex w-full items-center gap-2 border-t border-hairline px-3 py-2 font-mono text-2xs font-medium uppercase tracking-label text-highlight no-underline transition-colors duration-quick ease-settle hover:text-primary hover:[--arrow-live:1] focus-visible:shadow-focus focus-visible:outline-none focus-visible:[--arrow-live:1] active:scale-[0.98]"
                    >
                      {l.footLabel}
                      <ArrowRightIcon size={12} />
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-0 md:justify-self-end md:gap-4">
            <a
              href={phoneHref}
              aria-label={`Call ${PHONE_NUMBER}`}
              className="inline-flex min-h-control-sm min-w-control-sm items-center justify-center gap-2 whitespace-nowrap font-mono text-xs font-medium uppercase tracking-control text-secondary no-underline transition-colors duration-quick ease-settle hover:text-highlight focus-visible:text-highlight focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-highlight-ring active:scale-[0.98] md:justify-start"
            >
              <PhoneIcon size={14} className="flex-none text-highlight" />
              <span className="hidden tabular-nums md:inline">
                {PHONE_NUMBER}
              </span>
            </a>

            {/* The bar ends in one loud action, and it is the only place the
                safety orange is spent up here. */}
            <a
              href="#quote"
              onClick={openInquiry}
              className="relative hidden min-h-control-sm select-none items-center justify-center gap-3 rounded-none border border-transparent bg-highlight px-5 font-mono text-xs font-medium uppercase tracking-control text-on-highlight no-underline transition-[background-color,color,border-color,transform,box-shadow] duration-quick ease-settle hover:bg-highlight-hover focus-visible:shadow-focus-accent focus-visible:outline-none active:scale-[0.98] md:inline-flex"
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
            className="relative inline-flex h-control-sm w-control-sm items-center justify-center rounded-none border border-border-strong bg-transparent p-0 transition-[border-color,transform] duration-quick ease-settle hover:border-highlight focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-highlight active:scale-[0.96] md:hidden"
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
        className="pointer-events-none fixed inset-0 z-scrim appearance-none border-0 bg-bg-deep p-0 opacity-0 transition-opacity duration-settle ease-settle hover:opacity-[0.68] focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-highlight active:opacity-[0.72] data-[visible=true]:pointer-events-auto data-[visible=true]:opacity-60"
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
                  className={`group/row flex min-h-control w-full select-none items-center justify-between gap-4 py-4 font-condensed text-h3 font-semibold uppercase tracking-normal no-underline transition-colors duration-quick ease-settle hover:text-highlight focus-visible:text-highlight focus-visible:outline-none active:scale-[0.99] ${
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
                {/* In the drawer the same tree is simply indented; a phone has
                    the height for it and no room for a hover panel. */}
                {l.items ? (
                  <ul className="m-0 flex list-none flex-col gap-1 border-l border-hairline pb-4 pl-5">
                    {l.items.map((item) => (
                      <li key={item.to}>
                        <Link
                          to={item.to}
                          onClick={closeMenu}
                          className="flex min-h-control-sm items-center gap-2 font-body text-sm text-secondary no-underline transition-colors duration-quick ease-settle hover:text-primary focus-visible:shadow-focus focus-visible:outline-none active:scale-[0.98]"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            );
          })}

          <li className="mt-6 flex gap-0 border-t border-hairline">
            <a
              href={phoneHref}
              className="flex w-full flex-col gap-1 py-4 no-underline transition-colors duration-quick ease-settle hover:text-highlight focus-visible:text-highlight focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-highlight-ring active:scale-[0.99]"
            >
              <span className="font-mono text-xs font-medium uppercase tracking-label text-faint">
                Direct Line
              </span>
              <span className="whitespace-nowrap font-mono text-xl font-medium tabular-nums text-primary">
                {PHONE_NUMBER}
              </span>
            </a>
          </li>

          <li className="flex gap-0">
            <a
              href="#quote"
              onClick={openInquiry}
              className="relative mt-4 inline-flex w-full select-none items-center justify-center gap-3 rounded-none border border-transparent bg-highlight px-6 py-5 font-body text-xs font-semibold tracking-normal text-on-highlight no-underline transition-[background-color,transform,box-shadow] duration-quick ease-settle hover:bg-highlight-hover focus-visible:shadow-focus-accent focus-visible:outline-none active:scale-[0.98]"
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
