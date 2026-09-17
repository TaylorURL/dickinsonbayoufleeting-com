import { BAND, Container, Section } from "../ui/Layout";
import { Stagger, staggerChild } from "../ui/Reveal";

// Numbered prose sections with the same index-and-rule treatment the register
// uses, so a legal page reads as part of the site rather than a page borrowed
// from somewhere else.
//
// The measure is capped at 640 rather than run to the container. A legal
// section set across 1280 is a hundred and twenty characters to the line, which
// is the width at which a reader loses their place returning to the left edge.
function LegalBody({ sections, updated, label, id, surface = "light" }) {
  return (
    <Section surface={surface} id={id} aria-label={label}>
      <Container className={BAND}>
        <Stagger
          as="ol"
          aria-label="Sections"
          className="m-0 list-none border-t border-border p-0"
        >
          {sections.map((section, idx) => (
            <li
              key={section.id}
              id={section.id}
              className={`grid scroll-mt-anchor grid-cols-[minmax(0,1fr)] items-baseline gap-x-6 gap-y-3 border-b border-border py-7 sm:grid-cols-[theme(spacing.index)_minmax(0,1fr)] ${staggerChild(idx)}`}
            >
              <span
                aria-hidden="true"
                className="self-start font-mono text-code text-muted"
              >
                {String(idx + 1).padStart(2, "0")}
              </span>
              <h2 className="m-0 text-h4 text-primary">{section.heading}</h2>
              <div className="col-start-1 flex max-w-legal flex-col gap-4 font-body text-base text-secondary sm:col-start-2">
                {section.body.map((paragraph) => (
                  <p key={paragraph} className="m-0">
                    {paragraph}
                  </p>
                ))}
              </div>
            </li>
          ))}
        </Stagger>
        <p className="m-0 font-body text-small text-faint">
          Last updated · {updated}
        </p>
      </Container>
    </Section>
  );
}

export default LegalBody;
