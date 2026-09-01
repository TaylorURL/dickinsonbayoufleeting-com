import {
  ABOUT_STORY,
  ABOUT_TIMELINE,
  ABOUT_VALUES,
} from "../app/constants/about";
import { BAND, Container, MICRO_SM, Section } from "./ui/Layout";
import { Reveal, Stagger, staggerChild } from "./ui/Reveal";

// Set as an essay with its headings in the margin. The prose keeps one measure
// the whole way down instead of being cut into three columns, which is what
// lets it be read as an argument rather than scanned as three more blurbs.
function Story() {
  return (
    <Section
      surface="light"
      id="story"
      aria-label="How we got here"
      seam={{ into: "dark" }}
    >
      <Container>
        <div className="flex flex-col gap-12">
          {ABOUT_STORY.map((block) => (
            <Reveal
              key={block.heading}
              className="grid grid-cols-[minmax(0,1fr)] gap-4 lg:grid-cols-[minmax(0,0.34fr)_minmax(0,1fr)] lg:gap-12"
            >
              <h2 className="m-0 font-condensed text-h4 font-bold uppercase leading-none text-primary lg:sticky lg:top-anchor lg:self-start lg:text-right">
                {block.heading}
              </h2>
              <p className="m-0 max-w-prose text-lead text-secondary">
                {block.body}
              </p>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}

// A quadrant with the rules crossing through the middle of it, which is the
// register-mark motif the plates are trimmed with, held at section size. Four
// values is exactly the count that shape wants, and it is the only place on the
// site where a rule crosses another one.
function Values() {
  return (
    <Section
      surface="dark"
      id="values"
      aria-label="How we work"
      seam={{ into: "light" }}
    >
      <Container className={BAND}>
        <Reveal className="max-w-head">
          <h2 className="m-0 max-w-title text-h2 text-primary">
            Four things we hold to.
          </h2>
        </Reveal>

        <Stagger className="grid grid-cols-[minmax(0,1fr)] md:grid-cols-2">
          {ABOUT_VALUES.map((v, i) => (
            <div
              key={v.code}
              className={`min-w-0 border-t border-border py-9 first:border-t-0 md:py-12 md:px-10 md:first:border-t-0 md:[&:nth-child(2)]:border-t-0 md:[&:nth-child(odd)]:pl-0 md:[&:nth-child(even)]:border-l md:[&:nth-child(even)]:border-border md:[&:nth-child(even)]:pr-0 ${staggerChild(i)}`}
            >
              <p className={`${MICRO_SM} m-0 tabular-nums text-faint`}>
                {v.code}
              </p>
              <h3 className="m-0 mt-4 font-condensed text-h3 font-bold uppercase leading-none text-primary">
                {v.title}
              </h3>
              <p className="m-0 mt-5 max-w-prose-tight text-md text-secondary">
                {v.body}
              </p>
            </div>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}

// A ledger. The period is the entry's index and sits in the gutter at display
// size, so the column can be read down the left edge alone; the rule that runs
// beside it is the one continuous thing holding the four entries together.
function Timeline() {
  return (
    <Section
      surface="light"
      id="timeline"
      aria-label="The yards over time"
      seam={{ shape: "fade", into: "gray" }}
    >
      <Container className={BAND}>
        <Reveal>
          <h2 className="m-0 max-w-title text-h2 text-primary">
            The yards over time.
          </h2>
        </Reveal>

        <Stagger className="m-0 flex list-none flex-col border-l border-border p-0">
          {ABOUT_TIMELINE.map((entry, i) => (
            <li
              key={entry.period}
              className={`relative grid min-w-0 grid-cols-[minmax(0,1fr)] gap-2 py-8 pl-7 before:absolute before:left-[-4px] before:top-[38px] before:h-[7px] before:w-[7px] before:bg-accent before:content-[''] lg:grid-cols-[minmax(0,0.4fr)_minmax(0,1fr)] lg:gap-10 lg:pl-10 ${staggerChild(i)}`}
            >
              <p className="m-0 font-condensed text-h4 font-bold uppercase leading-none text-primary">
                {entry.period}
              </p>
              <div className="min-w-0">
                <h3 className={`${MICRO_SM} m-0 text-faint`}>{entry.title}</h3>
                <p className="m-0 mt-3 max-w-prose text-md text-secondary">
                  {entry.body}
                </p>
              </div>
            </li>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}

function AboutStory() {
  return (
    <>
      <Story />
      <Values />
      <Timeline />
    </>
  );
}

export default AboutStory;
