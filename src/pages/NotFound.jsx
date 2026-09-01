import PagePlate from "../components/PagePlate";
import CtaStrip from "../components/CtaStrip";
import { NAV_LINKS } from "../app/constants/navLinks";
import { Link } from "../app/router/Link";
import { ArrowRightIcon } from "../components/Icons";
import Button from "../components/ui/Button";
import { BAND, Container, Section, SectionHead } from "../components/ui/Layout";
import { MAIN_ID } from "../app/constants/landmarks";
import { useSeoMeta } from "../app/hooks/useSeoMeta";

// Unknown paths serve this same app: vercel.json answers them with a 404
// status, and the noindex covers any host that rewrites them to 200 instead.
// The null canonical keeps a miss from claiming the home page's URL.
export const metadata = {
  title: "Page Not Found | Dickinson Bayou Fleeting",
  description:
    "The address you followed does not match a page on this site. Every page we publish is linked below, and a call will point you the rest of the way.",
  canonical: null,
  robots: "noindex,follow",
  openGraph: {
    title: "Page Not Found | Dickinson Bayou Fleeting",
    description:
      "The address you followed does not match a page on this site. Every page we publish is linked below, and a call will point you the rest of the way.",
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
        <Button variant="primary" to="/">
          Back to Home
        </Button>
        <Button variant="ghost" to="/contact">
          Call the Yard
        </Button>
      </PagePlate>

      <Section surface="light" aria-label="Site Pages" seam={{ into: "dark" }}>
        <Container className={BAND}>
          <SectionHead title="Every page on the site." />
          <ul
            aria-label="Pages"
            className="m-0 list-none border-t border-border p-0"
          >
            {NAV_LINKS.map((link, idx) => (
              <li key={link.to} className="flex gap-0 border-b border-border">
                <Link
                  to={link.to}
                  className="group grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-5 px-3 py-6 text-secondary no-underline transition-[color,transform] duration-quick ease-settle hover:text-primary hover:[--arrow-live:1] focus-visible:text-primary focus-visible:shadow-focus focus-visible:outline-none focus-visible:[--arrow-live:1] active:scale-[0.97] active:opacity-80 xs:grid-cols-[theme(spacing.index)_minmax(0,1fr)_auto]"
                >
                  <span
                    aria-hidden="true"
                    className="hidden font-mono text-xs font-medium tracking-control text-muted xs:block"
                  >
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <span className="font-condensed text-h6 font-semibold uppercase tracking-normal [overflow-wrap:anywhere]">
                    {link.label}
                  </span>
                  <span
                    aria-hidden="true"
                    className="inline-flex items-center text-muted"
                  >
                    <ArrowRightIcon />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <CtaStrip
        title="Tell us what you were after."
        body="If a link sent you here, say where it was and we will fix it. The direct line is faster than the form."
      />
    </main>
  );
}

export default NotFound;
