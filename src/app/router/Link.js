import { forwardRef } from "react";
import { useRouter } from "./Router";

// An anchor that navigates through the router rather than reloading the
// document. A modifier or a middle click is left to the browser, so a reader
// who wants the page in a new tab still gets one.
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
