import "./styles/Breadcrumbs.css";
import { Link } from "../app/router/Link";
import { ROUTES } from "../app/router/routes";
import { useRouter, normalisePath } from "../app/router/Router";
import { useBreadcrumbSchema } from "../app/hooks/useBreadcrumbSchema";

// Home, then the page. Two levels is the whole depth of this site, so a
// longer trail would be describing a hierarchy that is not there.
//
// A path that matches no route renders nothing: the 404 shares this header,
// and a trail ending in a page that does not exist is worse than no trail.
function Breadcrumbs() {
  const { path } = useRouter();
  const current = ROUTES.find(
    (route) => route.path !== "/" && route.path === normalisePath(path),
  );
  useBreadcrumbSchema(current);
  if (!current) return null;

  return (
    <nav className="crumbs" aria-label="Breadcrumb">
      <ol className="crumbs__list">
        <li className="crumbs__item">
          <Link className="crumbs__link mono" to="/">
            Home
          </Link>
        </li>
        <li className="crumbs__item">
          <span className="crumbs__sep" aria-hidden="true" />
          <span className="crumbs__current mono" aria-current="page">
            {current.label}
          </span>
        </li>
      </ol>
    </nav>
  );
}

export default Breadcrumbs;
