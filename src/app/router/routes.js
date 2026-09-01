export const ROUTES = [
  { path: "/", label: "Home", id: "home" },
  // actions: the header carries a row of buttons under its lede. The route
  // placeholder reserves that row from here, so it holds the same box the
  // header will and nothing moves when the chunk lands.
  { path: "/services", label: "Services", id: "services", actions: true },
  { path: "/about", label: "About", id: "about", actions: true },
  { path: "/contact", label: "Contact", id: "contact" },
  { path: "/privacy", label: "Privacy", id: "privacy" },
  { path: "/terms", label: "Terms", id: "terms" },
];

export function findRoute(pathname) {
  if (!pathname) return ROUTES[0];
  const clean =
    pathname.length > 1 && pathname.endsWith("/")
      ? pathname.slice(0, -1)
      : pathname;
  return ROUTES.find((r) => r.path === clean) || ROUTES[0];
}
