import { SITE_ORIGIN } from "../constants/site";

// The public pages, and the head each one carries. The head lives here rather
// than in the view because the build has to reach it: one document is stamped
// per route before any of the views run, and a title that only the view knows
// is a title a crawler that executes nothing never sees.
//
// The canonical is built from the path rather than typed beside it, so the
// origin is stated once and a route cannot end up claiming another route's
// URL. Nothing carries an openGraph block: the share tags fall back to the
// title and the description, and stating them a second time is two strings to
// keep in step for no second reading.
function route({ path, title, description, ...rest }) {
  return {
    path,
    ...rest,
    meta: {
      title,
      description,
      canonical: `${SITE_ORIGIN}${path}`,
    },
  };
}

export const ROUTES = [
  route({
    path: "/",
    label: "Home",
    id: "home",
    title: "Gulf Coast Dock Space for Lease | Dickinson Bayou Fleeting",
    description:
      "Five-acre gated waterfront yards, long-term lease: Dickinson on Galveston Bay, Freeport on the GIWW. Bulkhead frontage, shore crew on site, from $4,100 a month.",
  }),
  // actions: the header carries a row of buttons under its lede. The route
  // placeholder reserves that row from here, so it holds the same box the
  // header will and nothing moves when the chunk lands.
  route({
    path: "/services",
    label: "Services",
    id: "services",
    actions: true,
    title: "Dock Lease Rates & Marine Services | Dickinson Bayou Fleeting",
    description:
      "Monthly lease rates for the Dickinson and Freeport yards, what each lease carries, and the seven jobs the shore crew covers on both docks.",
  }),
  route({
    path: "/about",
    label: "About",
    id: "about",
    actions: true,
    title: "Who Runs the Yards | Dickinson Bayou Fleeting",
    description:
      "Dickinson Bayou Fleeting is a small coastal fleeting company: two yards on the upper Texas Gulf Coast and a shore crew close enough to reach either dock.",
  }),
  route({
    path: "/contact",
    label: "Contact",
    id: "contact",
    title: "Ask About a Dock Lease | Dickinson Bayou Fleeting",
    description:
      "One number covers both barge fleeting yards, Dickinson and Freeport. Call 713-859-0169 or send the form for lease terms, a yard walk, or whether a slip is open.",
  }),
  route({
    path: "/privacy",
    label: "Privacy",
    id: "privacy",
    title: "Privacy Policy | Dickinson Bayou Fleeting",
    description:
      "An inquiry form, a page counter and an error log are everything this site collects. What each holds, how it is stored and how to have it removed.",
  }),
  route({
    path: "/terms",
    label: "Terms",
    id: "terms",
    title: "Terms of Use | Dickinson Bayou Fleeting",
    description:
      "These terms are the rules for use of this website. The lease itself is a separate agreement, signed for a slip or a yard at either facility.",
  }),
];

// Each route's head, by the id the view knows itself as, so a view asks for
// its own head rather than searching the table for itself.
export const ROUTE_META = Object.fromEntries(ROUTES.map((r) => [r.id, r.meta]));

// Unknown paths serve this same app: vercel.json answers them with a 404
// status, and the noindex covers any host that rewrites them to 200 instead.
// The null canonical keeps a miss from claiming the home page's URL.
export const NOT_FOUND_META = {
  title: "Page Not Found | Dickinson Bayou Fleeting",
  description:
    "The address you followed does not match a page on this site. Every page we publish is linked below, and a call will point you the rest of the way.",
  canonical: null,
  robots: "noindex,follow",
};

export function findRoute(pathname) {
  if (!pathname) return ROUTES[0];
  const clean =
    pathname.length > 1 && pathname.endsWith("/")
      ? pathname.slice(0, -1)
      : pathname;
  return ROUTES.find((r) => r.path === clean) || ROUTES[0];
}
