import PagePlate from "../components/PagePlate";
import CtaStrip from "../components/CtaStrip";
import { NAV_LINKS } from "../app/constants/navLinks";
import { Link } from "../app/router/Link";
import { ArrowRightIcon } from "../components/Icons";
import "../components/styles/NotFound.css";
import { MAIN_ID } from "../app/constants/landmarks";
import { useSeoMeta } from "../app/hooks/useSeoMeta";

// Unknown paths serve this same app: vercel.json answers them with a 404
// status, and the noindex covers any host that rewrites them to 200 instead.
// The null canonical keeps a miss from claiming the home page's URL.
export const metadata = {
  title: "Page Not Found | Dickinson Bayou Fleeting",
  description:
    "The address you followed does not match a page on this site. Every page we publish is linked below, and the operations desk can point you the rest of the way.",
  canonical: null,
  robots: "noindex,follow",
  openGraph: {
    title: "Page Not Found | Dickinson Bayou Fleeting",
    description:
      "The address you followed does not match a page on this site. Every page we publish is linked below, and the operations desk can point you the rest of the way.",
    url: null,
  },
};

function NotFound() {
  useSeoMeta(metadata);
  return (
    <main id={MAIN_ID} tabIndex={-1}>
      <PagePlate
        eyebrow="404"
        title="That page is not at this dock."
        subtitle="The address does not match anything on the site. Everything we publish is one of the four below."
      >
        <Link className="btn btn--primary" to="/">
          Back to Home
        </Link>
        <Link className="btn btn--ghost" to="/contact">
          Contact the Desk
        </Link>
      </PagePlate>

      <section
        className="notFound section"
        data-surface="light"
        aria-label="Site Pages"
      >
        <div className="container">
          <div className="section__head">
            <p className="eyebrow eyebrow--strong mono">Where to go</p>
            <h2 className="section__title">Every page on the site.</h2>
          </div>
          <ul className="notFound__list" aria-label="Pages">
            {NAV_LINKS.map((link, idx) => (
              <li key={link.to} className="notFound__item">
                <Link className="notFound__link" to={link.to}>
                  <span className="notFound__idx mono" aria-hidden="true">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <span className="notFound__name">{link.label}</span>
                  <span className="notFound__arrow" aria-hidden="true">
                    <ArrowRightIcon />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaStrip
        eyebrow="Still stuck"
        title="Tell us what you were after."
        body="If a link sent you here, say where it was and we will fix it. The direct line is faster than the form."
      />
    </main>
  );
}

export default NotFound;
