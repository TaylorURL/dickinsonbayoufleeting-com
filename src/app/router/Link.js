import { forwardRef } from "react";
import { useRouter } from "./Router";

/* Drop-in <a> replacement that pushes through the router instead of
 * triggering a full document load. Modifier-clicks (cmd/ctrl/shift/middle)
 * fall through to the browser so users keep open-in-new-tab. */
export const Link = forwardRef(function Link(
  { to, onClick, replace = false, scroll = true, children, ...rest },
  ref,
) {
  const { navigate } = useRouter();

  const handle = (e) => {
    if (typeof onClick === "function") onClick(e);
    if (e.defaultPrevented) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (e.button !== 0 && e.button !== undefined) return;
    e.preventDefault();
    navigate(to, { replace, scroll });
  };

  return (
    <a ref={ref} href={to} onClick={handle} {...rest}>
      {children}
    </a>
  );
});
