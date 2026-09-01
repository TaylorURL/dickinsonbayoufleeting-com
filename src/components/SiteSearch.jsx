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
import { ArrowRightIcon } from "./Icons";
import { MICRO_SM } from "./ui/Layout";

// The site's own index, opened on the command pair or a bare slash. It is the
// one piece of chrome that reaches every page, so it is built out of the same
// parts the pages are: hairlines, a code in the gutter, tabular figures, and
// the chevron that grows into an arrow on the row under the pointer.
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

  // The active row is kept in view as the cursor walks past the fold, so a long
  // list does not leave the selection somewhere the reader cannot see.
  useEffect(() => {
    if (!open) return;
    const el = listRef.current?.querySelector('[data-active="true"]');
    el?.scrollIntoView({ block: "nearest" });
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
      className="fixed inset-0 z-modal flex items-start justify-center bg-overlay-scrim px-gutter pb-gutter pt-[12vh] backdrop-blur-sm"
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelId}
        data-surface="dark"
        className="flex w-[min(640px,100%)] animate-rise flex-col overflow-hidden rounded-md border border-border-strong bg-bg shadow-lg motion-reduce:animate-none"
      >
        <h2 id={labelId} className="sr-only">
          Search this site
        </h2>

        <div className="flex items-center gap-4 border-b border-border px-5">
          <span aria-hidden="true" className={`${MICRO_SM} text-faint`}>
            Find
          </span>
          <input
            ref={inputRef}
            type="search"
            role="combobox"
            aria-expanded="true"
            aria-controls={listId}
            aria-autocomplete="list"
            aria-label="Search this site"
            placeholder="A yard, a rate, a service, a question"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="min-h-control w-full flex-1 border-0 bg-transparent p-0 font-body text-lg text-primary outline-none placeholder:text-muted [&::-webkit-search-cancel-button]:appearance-none"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className={`${MICRO_SM} shrink-0 rounded-xs border border-border-strong px-2 py-1 text-faint transition-[color,border-color,transform,opacity] duration-quick ease-settle hover:border-highlight hover:text-primary focus-visible:shadow-focus focus-visible:outline-none active:scale-[0.95] active:opacity-80`}
          >
            Esc
          </button>
        </div>

        <div
          ref={listRef}
          id={listId}
          role="listbox"
          aria-label="Search results"
          className="max-h-[min(52vh,420px)] overflow-y-auto overscroll-contain"
        >
          {results.length === 0 ? (
            <p className="m-0 px-5 py-8 text-md text-secondary">
              Nothing here matches that. The line answers anything the site
              would have told you.
            </p>
          ) : (
            results.map((entry, index) => (
              <button
                key={entry.id}
                type="button"
                role="option"
                aria-selected={index === cursor}
                data-active={index === cursor}
                onMouseMove={() => setCursor(index)}
                onClick={() => go(entry)}
                className="group flex w-full items-start gap-4 border-b border-hairline bg-transparent px-5 py-4 text-left transition-colors duration-quick ease-settle data-[active=true]:bg-layer-2 data-[active=true]:[--arrow-live:1]"
              >
                {/* The code says which kind of thing the row is - a page, a
                    service, a yard, a question - which is what a heading over
                    a group would have said, without needing the list to be
                    ordered by kind rather than by how well it matches. */}
                <span
                  className={`${MICRO_SM} mt-[0.25em] w-[42px] shrink-0 tabular-nums text-muted group-data-[active=true]:text-accent`}
                >
                  {entry.code}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-condensed text-h6 font-bold uppercase leading-tight text-primary">
                    {entry.label}
                  </span>
                  <span className="mt-1 line-clamp-2 block text-sm text-muted">
                    {entry.hint}
                  </span>
                </span>
                <ArrowRightIcon
                  size={16}
                  className="mt-[0.35em] shrink-0 text-faint group-data-[active=true]:text-primary"
                />
              </button>
            ))
          )}
        </div>

        <p
          className={`${MICRO_SM} m-0 flex flex-wrap items-center gap-x-5 gap-y-1 border-t border-border px-5 py-3 text-faint`}
        >
          <span>Up Down to move</span>
          <span>Enter to open</span>
          <span>Esc to close</span>
        </p>
      </div>
    </div>
  );
}

export default SiteSearch;
