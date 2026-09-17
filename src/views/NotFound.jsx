import PagePlate from "../components/page/PagePlate";
import CtaStrip from "../components/page/CtaStrip";
import { NAV_LINKS } from "../app/content/navLinks";
import { Link } from "../app/router/Link";
import { ArrowRightIcon } from "../components/ui/Icons";
import Button from "../components/ui/Button";
import { Container, Section, SectionHead } from "../components/ui/Layout";
import { MAIN_ID } from "../app/constants/landmarks";
import { useSeoMeta } from "../app/hooks/useSeoMeta";
import { NOT_FOUND_META } from "../app/router/routes";

function NotFound() {
  useSeoMeta(NOT_FOUND_META);
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
          Contact the Yard
        </Button>
      </PagePlate>

      <Section surface="light" aria-label="Site Pages">
        <Container className="flex flex-col gap-7 md:gap-9">
          <SectionHead title="Every page on the site." />
          {/* Four rows, because that is what the lede says and what the
              navigation holds. The arrow is the desktop row's own mark; on a
              phone the whole row is the tap target and there is nothing for it
              to point past. */}
          <ul
            aria-label="Pages"
            className="m-0 list-none border-t border-border p-0"
          >
            {NAV_LINKS.map((link, idx) => (
              <li key={link.to} className="flex gap-0 border-b border-border">
                <Link
                  to={link.to}
                  className="group grid w-full grid-cols-[theme(spacing.7)_minmax(0,1fr)] items-center gap-4 py-5 text-secondary no-underline transition-colors duration-quick ease-settle hover:text-primary hover:[--arrow-live:1] focus-visible:text-primary focus-visible:shadow-focus focus-visible:outline-none focus-visible:[--arrow-live:1] md:grid-cols-[theme(spacing.9)_minmax(0,1fr)_auto] md:gap-6 md:py-6"
                >
                  <span
                    aria-hidden="true"
                    className="font-mono text-code text-muted"
                  >
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <span className="font-condensed text-h4 uppercase text-primary [overflow-wrap:anywhere]">
                    {link.label}
                  </span>
                  <span
                    aria-hidden="true"
                    className="hidden items-center text-faint md:inline-flex"
                  >
                    <ArrowRightIcon size={16} />
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
