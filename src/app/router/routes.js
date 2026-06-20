export const ROUTES = [
  { path: "/", label: "Home", id: "home" },
  { path: "/services", label: "Services", id: "services" },
  { path: "/about", label: "About", id: "about" },
  { path: "/contact", label: "Contact", id: "contact" },
];

export function findRoute(pathname) {
  if (!pathname) return ROUTES[0];
  const clean = pathname.length > 1 && pathname.endsWith("/")
    ? pathname.slice(0, -1)
    : pathname;
  return ROUTES.find((r) => r.path === clean) || ROUTES[0];
}
