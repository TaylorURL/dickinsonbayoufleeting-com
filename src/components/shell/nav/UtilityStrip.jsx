import { useEffect, useState } from "react";
import { FACILITIES } from "../../../app/content/facilities";
import { HOURS_SHORT } from "../../../app/content/hours";
import { PHONE_NUMBER, telHref } from "../../../app/content/phoneNumber";
import { shortcutLabel } from "../../../app/hooks/useSearchShortcut";
import { Link } from "../../../app/router/Link";
import { PhoneIcon, SearchIcon } from "../../ui/Icons";
import { CHROME_ROW } from "./chrome";

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
  "hidden h-strip items-center border-b border-border bg-bg-deep md:flex",
  "transition-[background-color,border-color] duration-settle ease-settle",
].join(" ");

const STRIP_ITEM = "font-mono text-code whitespace-nowrap text-muted";

const STRIP_LINK =
  "inline-flex items-center gap-2 whitespace-nowrap rounded-sm no-underline transition-colors duration-quick ease-settle hover:text-primary focus-visible:text-primary focus-visible:shadow-focus focus-visible:outline-none";

function UtilityStrip({ onSearch }) {
  // Read once on mount rather than at render, so the server-rendered markup and
  // the first client paint agree on which vocabulary the shortcut is printed in.
  const [shortcut, setShortcut] = useState("Ctrl K");
  useEffect(() => setShortcut(shortcutLabel()), []);

  return (
    // Where the yards are, when somebody answers, and the number. None of it
    // is a destination, which is why none of it is in the bar.
    <div
      data-utility-bar
      aria-label="Contact and hours"
      className={UTILITY_STRIP}
    >
      <div className={`${CHROME_ROW} justify-between gap-6`}>
        <ul className="m-0 flex list-none items-center gap-6 p-0">
          {FACILITIES.map((facility) => (
            <li key={facility.id} className="flex gap-0">
              <Link
                to={`/contact#${facility.id}`}
                className={`${STRIP_LINK} font-mono text-code text-secondary`}
              >
                <span
                  aria-hidden="true"
                  className="inline-block h-px w-rule flex-none bg-border-strong"
                />
                {facility.shortName}
                <span className="text-muted">{facility.waterway}</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-6">
          <p className={`${STRIP_ITEM} m-0 hidden lg:block`}>{HOURS_SHORT}</p>
          <a
            href={telHref()}
            aria-label={`Call ${PHONE_NUMBER}`}
            className={`${STRIP_LINK} font-mono text-data text-secondary`}
          >
            <PhoneIcon size={14} className="flex-none" />
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
            className={`${STRIP_LINK} border-0 bg-transparent p-0 font-body text-micro text-secondary`}
          >
            <SearchIcon size={14} className="flex-none" />
            <span className="hidden lg:inline">Search</span>
            <kbd className="hidden whitespace-nowrap rounded-xs border border-border px-2 py-px text-center font-mono text-code tabular-nums text-muted lg:inline-block">
              {shortcut}
            </kbd>
          </button>
        </div>
      </div>
    </div>
  );
}

export default UtilityStrip;
