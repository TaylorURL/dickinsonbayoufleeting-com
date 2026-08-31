import { BAND, Container, Section } from "./ui/Layout";
import { Stagger, staggerChild } from "./ui/Reveal";

// Numbered prose sections with the same rule-and-index treatment the services
// and capability lists use, so a legal page reads as part of the site rather
// than a page borrowed from somewhere else.
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
              className={`relative grid scroll-mt-anchor grid-cols-[minmax(0,1fr)] items-baseline gap-x-6 gap-y-2 border-b border-border py-8 sm:grid-cols-[theme(spacing.index)_minmax(0,1fr)] sm:gap-y-3 ${staggerChild(idx)}`}
            >
              <span
                aria-hidden="true"
                className="self-start pt-2 font-mono text-xs font-medium tracking-control text-muted"
              >
                {String(idx + 1).padStart(2, "0")}
              </span>
              <h2 className="m-0 text-h6 text-primary">{section.heading}</h2>
              <div className="col-start-1 flex max-w-prose flex-col gap-4 text-md leading-relaxed text-secondary sm:col-start-2">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </li>
          ))}
        </Stagger>
        <p className="block font-mono text-xs font-medium tracking-normal text-faint">
          Last updated · {updated}
        </p>
      </Container>
    </Section>
  );
}

export default LegalBody;
