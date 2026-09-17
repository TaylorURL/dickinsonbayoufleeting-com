import { useEffect, useRef } from "react";

// What a dialog owes the keyboard, in one place. The site has two of them -
// the search palette and the inquiry panel - and they had two answers: one
// remembered what had focus and put it back on the way out, the other left the
// reader's place on the page wherever the dialog had taken it.
//
// What is shared is the behaviour rather than the shape. The palette is a card
// dropped over a tinted ground and the inquiry panel is a sheet behind a scrim
// of its own, so the component takes the ground and the panel as classes and
// the scrim as markup.

const FOCUSABLE = [
  "a[href]",
  "button",
  "input",
  "textarea",
  "select",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

/**
 * Escape, the tab trap, the scroll lock and the focus the dialog borrowed.
 *
 * @returns {object} The ref the panel has to carry: the trap is the panel's
 *   own subtree, so a dialog with nothing focusable in it traps nothing.
 */
export function useDialog({ open, onEscape, lockScroll = false }) {
  const panelRef = useRef(null);
  const returnTo = useRef(null);
  // Bound once for the life of the dialog, so the listener reaches the current
  // handler through a ref rather than being rebound on every key.
  const escape = useRef(onEscape);
  escape.current = onEscape;

  useEffect(() => {
    if (!open) return undefined;
    // Opening remembers what had focus so closing can put it back, which is
    // the difference between a dialog and a trapdoor. The panel is read here
    // rather than on the way out, because by then it may already have left.
    const panel = panelRef.current;
    returnTo.current = document.activeElement;
    const { overflow } = document.body.style;
    if (lockScroll) document.body.style.overflow = "hidden";
    return () => {
      if (lockScroll) document.body.style.overflow = overflow;
      const back = returnTo.current;
      if (!back || typeof back.focus !== "function") return;
      // Only if the dialog still had the mark. A panel that has just left
      // leaves focus on the body, which is the case this exists for; but
      // something that moved focus on the way out - a route landing on its
      // own main element - meant to have it, and taking it back would send
      // the reader somewhere they did not ask to go.
      const active = document.activeElement;
      const orphaned = !active || active === document.body;
      if (!orphaned && panel && !panel.contains(active)) return;
      back.focus();
    };
  }, [open, lockScroll]);

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        escape.current();
        return;
      }
      // Tab stays inside the panel: a dialog over a page whose focus walks out
      // behind it is a page the keyboard has lost.
      if (event.key !== "Tab" || !panelRef.current) return;
      const list = [...panelRef.current.querySelectorAll(FOCUSABLE)].filter(
        (el) => !el.disabled && el.getAttribute("aria-hidden") !== "true",
      );
      if (!list.length) return;
      const first = list[0];
      const last = list[list.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return panelRef;
}

// The layer and the panel inside it. The name sits on the panel rather than on
// the layer, because the layer is furniture: a name hung on it points at ids
// that a panel with more than one state cannot promise are still in the tree.
//
// Anything left over is spread onto the panel, which is how a host marks its
// own state on it.
export function Dialog({
  open,
  onEscape,
  lockScroll = false,
  label,
  labelledBy,
  className = "",
  panelClassName = "",
  onGroundMouseDown,
  scrim = null,
  children,
  ...panel
}) {
  const panelRef = useDialog({ open, onEscape, lockScroll });
  if (!open) return null;
  return (
    <div
      role="presentation"
      onMouseDown={onGroundMouseDown}
      className={`fixed inset-0 z-modal flex ${className}`.trim()}
    >
      {scrim}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        aria-labelledby={labelledBy}
        className={panelClassName}
        {...panel}
      >
        {children}
      </div>
    </div>
  );
}

export default Dialog;
