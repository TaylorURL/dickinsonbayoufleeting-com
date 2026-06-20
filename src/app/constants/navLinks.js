/* Top-level nav now drives the page router, not in-page anchors.
 * The Home page still has its own internal anchors, but the global
 * nav is page-to-page. */
export const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Services", to: "/services" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];
