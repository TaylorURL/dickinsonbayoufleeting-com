import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { SEARCH_DEFAULTS, searchSite } from "../app/constants/searchIndex";
import { useRouter } from "../app/router/Router";
import { ArrowRightIcon, SearchIcon } from "./Icons";

// The matched span, marked by weight and ink rather than by a highlighter. A
// <mark> arrives with a yellow ground on it, which is a colour this palette
// does not have and would be the only one on the site.
function Marked({ text, query }) {
  const needle = query.trim();
  if (!needle) return text;
  const at = text.toLowerCase().indexOf(needle.toLowerCase());
  if (at < 0) return text;
  return (
    <>
      {text.slice(0, at)}
      <span className="font-bold text-primary group-data-[active=true]:text-on-accent">
        {text.slice(at, at + needle.length)}
      </span>
      {text.slice(at + needle.length)}
    </>
  );
}

// The site's own index, opened on the command pair or a bare slash.
//
// Drawn on paper over the page rather than in the page's own ink: a dark panel
// on a dark ground has nothing to sit on, and with no hue to spend, tone is
// what separates an object from the thing behind it. The rows are inset inside
// the card and carry their own corners, so the one under the cursor is a shape
// rather than a band running edge to edge.
function SiteSearch({ open, onClose }) {
  const { navigate } = useRouter();
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const panelRef = useRef(null);
  const returnTo = useRef(null);
  const labelId = useId();
  const listId = useId();

  const results = useMemo(
    () => (query.trim() ? searchSite(query) : SEARCH_DEFAULTS),
    [query],
  );

  const go = useCallback(
    (entry) => {
      if (!entry) return;
      onClose();
      if (entry.href) {
        window.location.href = entry.href;
        return;
      }
      navigate(entry.to);
    },
    [navigate, onClose],
  );

  // Opening remembers what had focus so closing can put it back, which is the
  // difference between a palette and a trapdoor.
  useEffect(() => {
    if (!open) return undefined;
    returnTo.current = document.activeElement;
    setQuery("");
    setCursor(0);
    const id = window.requestAnimationFrame(() => inputRef.current?.focus());
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      window.cancelAnimationFrame(id);
      document.body.style.overflow = overflow;
      const back = returnTo.current;
      if (back && typeof back.focus === "function") back.focus();
    };
  }, [open]);

  useEffect(() => {
    setCursor(0);
  }, [query]);

  useEffect(() => {
    if (!open) return;
    listRef.current
      ?.querySelector('[data-active="true"]')
      ?.scrollIntoView({ block: "nearest" });
  }, [cursor, open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        if (!results.length) return;
        const step = event.key === "ArrowDown" ? 1 : -1;
        setCursor((c) => (c + step + results.length) % results.length);
        return;
      }
      if (event.key === "Enter") {
        event.preventDefault();
        go(results[cursor]);
        return;
      }
      // Tab stays inside the panel: a palette over a page whose focus walks out
      // behind it is a page the keyboard has lost.
      if (event.key === "Tab" && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll(
          'a[href],button:not([disabled]),input,[tabindex]:not([tabindex="-1"])',
        );
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, results, cursor, go, onClose]);

  if (!open) return null;

  return (
    <div
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-modal flex items-start justify-center bg-overlay-scrim px-4 pb-8 pt-[10dvh]"
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelId}
        data-surface="light"
        className="flex max-h-full w-full max-w-palette animate-rise flex-col overflow-hidden rounded-md bg-surface shadow-raise outline outline-1 -outline-offset-1 outline-border-strong motion-reduce:animate-none"
      >
        <h2 id={labelId} className="sr-only">
          Search this site
        </h2>

        <div className="flex h-control shrink-0 items-center gap-3 border-b border-hairline bg-field-surface px-4">
          <SearchIcon
            size={16}
            className="flex-none text-faint"
            aria-hidden="true"
          />
          {/* Sixteen pixels, which is the floor below which a phone zooms the
              page to meet the field and leaves it zoomed once the dialog has
              gone. */}
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls={listId}
            aria-autocomplete="list"
            aria-label="Search this site"
            placeholder="A yard, a rate, a service, a question"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-full min-w-0 flex-1 border-0 bg-transparent p-0 font-body text-base text-primary outline-none placeholder:text-faint"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="hidden shrink-0 cursor-pointer rounded-sm px-1.5 py-1 font-body text-3xs font-medium leading-none text-faint shadow-edge transition-colors duration-quick ease-settle hover:bg-layer-2 hover:text-primary focus-visible:shadow-focus focus-visible:outline-none sm:inline-block active:opacity-70"
          >
            Esc
          </button>
        </div>

        <div
          ref={listRef}
          id={listId}
          role="listbox"
          aria-label="Search results"
          className="flex min-h-0 flex-col overflow-y-auto overscroll-contain p-2"
        >
          {results.length === 0 ? (
            <p className="m-0 px-5 py-10 text-center text-sm leading-relaxed text-muted">
              Nothing matches that. The line answers anything the site would
              have told you.
            </p>
          ) : (
            results.map((entry, index) => (
              // One highlight, moved by whichever of the pointer and the arrow
              // keys touched it last. A row lit under the pointer while a
              // different row stays lit for Enter gives the reader two answers
              // to what a press will open.
              <button
                key={entry.id}
                type="button"
                role="option"
                aria-selected={index === cursor}
                data-active={index === cursor}
                onMouseMove={() => setCursor(index)}
                onClick={() => go(entry)}
                className="group flex min-h-control-sm w-full items-center gap-3 rounded-sm bg-transparent px-3 py-2 text-left transition-colors duration-quick ease-settle focus-visible:shadow-focus focus-visible:outline-none data-[active=false]:hover:bg-layer-2 data-[active=true]:bg-accent active:opacity-70"
              >
                {/* The code stands where a drawing would, at one width, so a
                    list of mixed kinds reads as one column rather than two. */}
                <span
                  className="w-code-sm flex-none font-mono text-2xs font-medium tracking-code tabular-nums text-muted group-data-[active=true]:text-on-accent group-data-[active=true]:opacity-70"
                  aria-hidden="true"
                >
                  {entry.code}
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="truncate text-md font-semibold leading-snug text-primary group-data-[active=true]:text-on-accent">
                    <Marked text={entry.label} query={query} />
                  </span>
                  <span className="truncate text-2xs font-normal leading-snug text-muted group-data-[active=true]:text-on-accent group-data-[active=true]:opacity-80">
                    {entry.hint}
                  </span>
                </span>
                <ArrowRightIcon
                  size={16}
                  className="shrink-0 text-on-accent opacity-0 transition-opacity duration-quick group-data-[active=true]:opacity-100"
                />
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default SiteSearch;
