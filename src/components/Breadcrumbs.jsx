import { Link } from "../app/router/Link";
import { ROUTES } from "../app/router/routes";
import { useRouter, normalisePath } from "../app/router/Router";
import { useBreadcrumbSchema } from "../app/hooks/useBreadcrumbSchema";

// Home, then the page. Two levels is the whole depth of this site, so a longer
// trail would be describing a hierarchy that is not there.
//
// A path that matches no route renders nothing: the 404 shares this header, and
// a trail ending in a page that does not exist is worse than no trail.
//
// The trail sits above the page's eyebrow and reads as the smallest label on
// the plate, so it orients without competing with the heading under it. The
// separator is a rule rather than a glyph, matching the ticks the rest of the
// layout is drawn with.
const LABEL = "font-mono text-2xs font-medium uppercase tracking-control";

function Breadcrumbs() {
  const { path } = useRouter();
  const current = ROUTES.find(
    (route) => route.path !== "/" && route.path === normalisePath(path),
  );
  useBreadcrumbSchema(current);
  if (!current) return null;

  return (
    <nav className="self-start" aria-label="Breadcrumb">
      <ol className="m-0 flex list-none flex-wrap items-center gap-3 p-0">
        <li className="inline-flex items-center gap-3">
          <Link
            to="/"
            className={`${LABEL} text-faint no-underline transition-colors duration-quick ease-settle hover:text-highlight focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-highlight active:scale-[0.98]`}
          >
            Home
          </Link>
        </li>
        <li className="inline-flex items-center gap-3">
          <span
            aria-hidden="true"
            className="h-px w-tick flex-none bg-border-strong"
          />
          <span className={`${LABEL} text-secondary`} aria-current="page">
            {current.label}
          </span>
        </li>
      </ol>
    </nav>
  );
}

export default Breadcrumbs;
