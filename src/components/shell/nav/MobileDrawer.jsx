import { useEffect } from "react";
import { NAV_LINKS } from "../../../app/content/navLinks";
import { PHONE_NUMBER, telHref } from "../../../app/content/phoneNumber";
import { Link } from "../../../app/router/Link";
import { normalisePath } from "../../../app/router/Router";
import Button from "../../ui/Button";
import { SearchIcon } from "../../ui/Icons";
import { useDialog } from "../../ui/Dialog";

// The whole tree on one screen, over the page rather than beside it. It stays
// a full-screen dark overlay whatever the bar is wearing: a drawer that
// changed colour with the page behind it would make the brand read
// differently every time it opened.
//
// It is a dialog and it behaves like one - Escape closes it, the page behind
// it does not scroll, the keyboard stays inside it, and focus goes back to the
// control that opened it.
//
// Long enough for the switch from hidden to visible to have been applied.
const OPEN_SETTLE_MS = 40;

const DRAWER =
  "invisible fixed inset-0 z-drawer block -translate-y-3 overflow-y-auto overscroll-contain bg-bg-deep pt-nav opacity-0 outline-none transition-[opacity,transform,visibility] delay-[0ms,0ms,280ms] duration-settle ease-swell data-[open=true]:visible data-[open=true]:translate-y-0 data-[open=true]:opacity-100 data-[open=true]:delay-0 motion-reduce:transition-none md:hidden";

const ROW = "border-b border-border py-5";

function MobileDrawer({ open, activePath, onClose, onSearch, onInquiry }) {
  const drawerRef = useDialog({ open, onEscape: onClose, lockScroll: true });

  // The panel itself takes the mark rather than its first destination, so a
  // reader who opened it lands on the thing that opened and reads down from
  // the top of it. It waits for the switch to land: the drawer is laid out at
  // all times and hidden by visibility, and an element the browser still has
  // as hidden takes no focus at all.
  useEffect(() => {
    if (!open) return undefined;
    const timer = setTimeout(() => drawerRef.current?.focus(), OPEN_SETTLE_MS);
    return () => clearTimeout(timer);
  }, [open, drawerRef]);

  return (
    <>
      {/* A real button, so the drawer can be dismissed from the keyboard as
          well as by tapping beside it. Nothing is written inside it, so its
          name lives on the element rather than in the markup. */}
      <button
        type="button"
        data-visible={open}
        onClick={onClose}
        tabIndex={open ? 0 : -1}
        aria-label="Close Menu"
        className="pointer-events-none fixed inset-0 z-scrim appearance-none border-0 bg-overlay-scrim p-0 opacity-0 transition-opacity duration-quick ease-settle focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-highlight data-[visible=true]:pointer-events-auto data-[visible=true]:opacity-100"
      />

      <div
        ref={drawerRef}
        id="nav-mobile-drawer"
        tabIndex={-1}
        data-open={open}
        data-surface="dark"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation"
        className={DRAWER}
      >
        <ul className="mx-auto flex h-full max-w-container list-none flex-col gap-0 px-gutter pb-7 pt-2">
          {NAV_LINKS.map((l) => {
            const isActive = activePath === normalisePath(l.to);
            return (
              <li key={l.to} className={`flex flex-col gap-3 ${ROW}`}>
                <Link
                  to={l.to}
                  onClick={onClose}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex w-full select-none items-center justify-between gap-4 text-h4 no-underline transition-colors duration-quick ease-settle hover:text-highlight focus-visible:text-highlight focus-visible:outline-none ${
                    isActive ? "text-highlight" : "text-primary"
                  }`}
                >
                  {l.label}
                </Link>
                {/* In the drawer the same tree is simply indented under its
                    entry; a phone has the height for it and no room for a
                    hover panel. */}
                {l.groups ? (
                  <ul className="m-0 flex list-none flex-col gap-2 p-0 pl-4">
                    {l.groups.flatMap((group) =>
                      group.items.map((item) => (
                        <li key={item.to}>
                          <Link
                            to={item.to}
                            onClick={onClose}
                            className="flex min-h-control-md items-center rounded-sm font-body text-small text-secondary no-underline transition-colors duration-quick ease-settle hover:text-primary focus-visible:shadow-focus focus-visible:outline-none"
                          >
                            {item.label}
                          </Link>
                        </li>
                      )),
                    )}
                  </ul>
                ) : null}
              </li>
            );
          })}

          <li className="flex flex-col items-start gap-4 pt-6">
            {/* The strip that carries the index on a wide screen is not drawn
                here, so the drawer is where a phone reaches it. */}
            <button
              type="button"
              onClick={() => {
                onClose();
                onSearch?.();
              }}
              className="inline-flex min-h-control-md items-center gap-3 rounded-sm border-0 bg-transparent p-0 font-body text-micro text-secondary transition-colors duration-quick ease-settle hover:text-primary focus-visible:shadow-focus focus-visible:outline-none"
            >
              <SearchIcon className="flex-none" />
              Search This Site
            </button>

            <a
              href={telHref()}
              className="flex flex-col gap-1 no-underline transition-colors duration-quick ease-settle hover:text-highlight focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-highlight-ring"
            >
              <span className="font-body text-micro text-faint">
                Direct Line
              </span>
              <span className="whitespace-nowrap font-mono text-figure-sm tabular-nums text-primary">
                {PHONE_NUMBER}
              </span>
            </a>

            <Button
              variant="primary"
              href="#quote"
              onClick={onInquiry}
              className="w-full"
            >
              Request Quote
            </Button>
          </li>
        </ul>
      </div>
    </>
  );
}

export default MobileDrawer;
