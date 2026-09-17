import { PHONE_NUMBER, telHref } from "../../../app/content/phoneNumber";
import { Link } from "../../../app/router/Link";
import { ArrowRightIcon, PhoneIcon } from "../../ui/Icons";
import { CHROME_ROW, PANEL_HEADING } from "./chrome";

// The panel runs the full width of the bar and drops from its lower edge, so
// it reads as the bar opening rather than as a box hung off one word. Laid out
// at all times and switched on opacity, transform and visibility, so opening
// it composites rather than relaying out the page underneath.
//
// Opaque, with no blur: it covers a page of type with a page of type, and
// anything showing through puts the two on top of each other at the moment a
// visitor is reading to choose where to go.
const MENU_PANEL = [
  "invisible absolute inset-x-0 top-full hidden -translate-y-1 opacity-0",
  "border-b border-border-strong bg-surface shadow-lg",
  "transition-[opacity,transform,visibility] delay-[0ms,0ms,280ms] duration-quick ease-settle",
  "data-[open=true]:visible data-[open=true]:translate-y-0 data-[open=true]:opacity-100 data-[open=true]:delay-0",
  "motion-reduce:transition-none md:block",
].join(" ");

// One panel body per entry that has groups, laid out under the whole bar. The
// columns are the design: a visitor reads three headings and knows which one
// is theirs before reading a destination.
//
// A closed panel is still in the document, so everything inside it is taken
// out of the tab order until it is down.
function NavMenuPanel({ link, open }) {
  const stop = open ? undefined : -1;
  return (
    <div
      id={`nav-menu-${link.label.toLowerCase()}`}
      data-open={open}
      data-surface="dark"
      className={MENU_PANEL}
    >
      <div className={`${CHROME_ROW} flex-col items-stretch gap-7 py-7`}>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,15rem),1fr))] gap-x-9 gap-y-7">
          {link.groups.map((group) => (
            <section key={group.heading} className="flex flex-col gap-4">
              <p className={PANEL_HEADING}>{group.heading}</p>
              <ul className="m-0 flex list-none flex-col gap-0 p-0">
                {group.items.map((item) => (
                  <li key={item.to} className="flex gap-0">
                    <Link
                      to={item.to}
                      tabIndex={stop}
                      className="flex w-full flex-col gap-1 rounded-sm px-3 py-3 no-underline transition-colors duration-quick ease-settle hover:bg-bg focus-visible:shadow-focus focus-visible:outline-none"
                    >
                      <span className="font-body text-micro text-primary">
                        {item.label}
                      </span>
                      {/* One line is the whole budget. The panel only has to
                          say which of the seven this is. */}
                      <span className="font-body text-small text-faint [overflow-wrap:anywhere]">
                        {item.hint}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        {/* The panel closes on the two things a visitor who did not find
            their column still wants: the whole list, and a person. */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-5">
          <Link
            to={link.footTo}
            tabIndex={stop}
            className="inline-flex items-center gap-2 rounded-sm font-body text-micro text-primary no-underline transition-colors duration-quick ease-settle hover:[--arrow-live:1] focus-visible:shadow-focus focus-visible:outline-none"
          >
            {link.footLabel}
            <ArrowRightIcon />
          </Link>
          <a
            href={telHref()}
            tabIndex={stop}
            className="inline-flex items-center gap-2 rounded-sm font-mono text-data tabular-nums text-secondary no-underline transition-colors duration-quick ease-settle hover:text-primary focus-visible:shadow-focus focus-visible:outline-none"
          >
            <PhoneIcon size={14} className="flex-none" />
            {PHONE_NUMBER}
          </a>
        </div>
      </div>
    </div>
  );
}

export default NavMenuPanel;
