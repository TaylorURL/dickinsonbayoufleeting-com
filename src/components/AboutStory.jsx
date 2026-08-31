import {
  ABOUT_STORY,
  ABOUT_VALUES,
  ABOUT_TIMELINE,
} from "../app/constants/about";
import { BAND, Container, Section, SectionHead } from "./ui/Layout";
import { Reveal, Stagger, staggerChild } from "./ui/Reveal";

// The rule over a block draws itself in from the left as the pointer arrives.
// The rule sits on the list's own top border, so the mark reads as that border
// lighting up rather than as a second line above it.
const TOP_RULE =
  "before:absolute before:-top-[calc(theme(spacing.8)+1px)] before:left-0 before:h-accent before:w-rule before:origin-left before:scale-x-0 before:bg-highlight before:transition-transform before:duration-settle before:ease-swell before:content-[''] hover:before:scale-x-100 motion-reduce:before:transition-none";

const CARD_RULE =
  "after:absolute after:left-0 after:top-0 after:h-accent after:w-full after:origin-left after:scale-x-0 after:bg-highlight after:transition-transform after:duration-settle after:ease-swell after:content-[''] hover:after:scale-x-100 motion-reduce:after:transition-none";

const LIFT =
  "transition-transform duration-settle ease-settle hover:-translate-y-1 motion-reduce:transition-none";

function AboutStory() {
  return (
    <>
      <Section surface="light" id="story" aria-label="Our Story">
        <Container className={BAND}>
          <Reveal>
            <SectionHead
              eyebrow="Who we are"
              title="Two yards, and the people who run them."
              subtitle="A small operation that works to be a good neighbor on the water, to customers, regulators and the communities along Dickinson Bayou."
            />
          </Reveal>

          <Stagger className="grid grid-cols-[minmax(0,1fr)] gap-7 border-t border-border pt-8 md:grid-cols-3">
            {ABOUT_STORY.map((b, idx) => (
              <div key={b.heading} className={staggerChild(idx)}>
                <article
                  className={`relative flex h-full flex-col gap-3 pr-4 ${TOP_RULE}`}
                >
                  <span className="font-mono text-xs font-medium tracking-control text-highlight">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <h3 className="m-0 text-h5 font-bold text-primary">
                    {b.heading}
                  </h3>
                  <p className="max-w-prose-tight text-base leading-relaxed text-secondary">
                    {b.body}
                  </p>
                </article>
              </div>
            ))}
          </Stagger>
        </Container>
      </Section>

      <Section surface="dark" id="values" aria-label="What We Stand For">
        <Container className={BAND}>
          <Reveal>
            <SectionHead
              eyebrow="How we work"
              title="Four rules the crew works to."
              plate="towboat"
            />
          </Reveal>

          <Stagger
            as="ul"
            aria-label="Operating Principles"
            className="m-0 grid list-none grid-cols-[minmax(0,1fr)] gap-0 border border-border bg-surface p-0 sm:grid-cols-2 lg:grid-cols-4"
          >
            {ABOUT_VALUES.map((v, idx) => (
              <li
                key={v.code}
                className={`border-b border-border last:border-b-0 sm:border-r sm:last:border-b sm:last:border-r-0 ${staggerChild(idx)}`}
              >
                <div
                  className={`relative flex h-full flex-col gap-3 overflow-hidden px-6 py-7 ${CARD_RULE} ${LIFT}`}
                >
                  <span className="font-mono text-xs font-medium uppercase tracking-label text-highlight">
                    {v.code}
                  </span>
                  <h3 className="m-0 text-h6 font-bold text-primary">
                    {v.title}
                  </h3>
                  <p className="text-md text-secondary">{v.body}</p>
                </div>
              </li>
            ))}
          </Stagger>
        </Container>
      </Section>

      <Section surface="light" id="timeline" aria-label="Where We Have Been">
        <Container className={BAND}>
          <Reveal>
            <SectionHead
              eyebrow="Where we have been"
              title="From one slip to a coastal operation."
            />
          </Reveal>

          {/* Rust rather than the highlight: a timeline is a tier-two mark, and
              spending safety orange here would put it against the CTA. */}
          <Stagger
            as="ol"
            aria-label="Company History"
            className="m-0 grid list-none grid-cols-[minmax(0,1fr)] gap-6 border-t border-border p-0 pt-8 sm:grid-cols-2 lg:grid-cols-4"
          >
            {ABOUT_TIMELINE.map((t, idx) => (
              <li key={t.title} className={staggerChild(idx)}>
                <div
                  className={`group grid h-full grid-cols-[auto_minmax(0,1fr)_auto] gap-x-3 gap-y-2 border-t-2 border-rust pt-4 ${LIFT}`}
                >
                  <span className="font-mono text-xs font-medium uppercase tracking-label text-rust transition-colors duration-quick ease-settle group-hover:text-highlight">
                    {t.period}
                  </span>
                  <span
                    aria-hidden="true"
                    className="mx-2 h-px self-center bg-hairline"
                  />
                  <span className="font-mono text-xs font-medium tracking-control text-faint">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <h3 className="col-span-3 m-0 text-h6 text-primary">
                    {t.title}
                  </h3>
                  <p className="col-span-3 text-md text-secondary">{t.body}</p>
                </div>
              </li>
            ))}
          </Stagger>
        </Container>
      </Section>
    </>
  );
}

export default AboutStory;
