import { useEffect, useRef } from "react";

// Whether the key that was pressed is going into something the reader is
// writing in. A bare slash is the fastest way to open a search and the worst
// possible thing to steal, because the character it eats is one somebody meant
// to type into the message field.
function isTyping(target) {
  if (!target) return false;
  if (target.isContentEditable) return true;
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
}

// Opens the palette on the two shortcuts a reader already knows: the command
// pair, and a bare slash. The pair is deliberately not guarded against typing -
// a reader who hits it inside a field meant to open the search - and the slash
// is, because there it is just a character.
//
// The handler is bound once and reads the callback through a ref, so a parent
// re-rendering does not tear the listener down and put an identical one back.
export function useSearchShortcut(onOpen) {
  const open = useRef(onOpen);
  open.current = onOpen;

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const onKeyDown = (event) => {
      const pair = (event.metaKey || event.ctrlKey) && event.key === "k";
      const slash = event.key === "/" && !isTyping(event.target);
      if (!pair && !slash) return;
      if (event.altKey) return;
      event.preventDefault();
      open.current?.();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
}

// The label the pill wears. A Mac reader is shown the command glyph and
// everyone else Ctrl, because a shortcut printed in the wrong vocabulary reads
// as a shortcut for somebody else's machine.
export function shortcutLabel() {
  if (typeof navigator === "undefined") return "Ctrl K";
  const mac = /Mac|iPhone|iPad|iPod/i.test(
    navigator.platform || navigator.userAgent || "",
  );
  return mac ? "\u2318K" : "Ctrl K";
}
