import {
  ABOUT_STORY,
  ABOUT_TIMELINE,
  ABOUT_VALUES,
} from "../../app/content/about";
import { CODE, Container, Section } from "../ui/Layout";
import { Reveal, Stagger, staggerChild } from "../ui/Reveal";

// The three bands the about page is built from. They share a heading step and
// a rule weight and nothing else, because each one is a different kind of
// reading: an argument, a list of commitments, and a record of dates.

// The one heading on the site that is not flush left. Set in the margin
// against its own paragraph, it does the work a margin note does - naming the
// passage beside it rather than opening a band - and the right edge is what
// binds the two columns together across the gap.
function Story() {
  return (
    <Section surface="light" id="story" aria-label="How we got here">
      <Container className="flex flex-col gap-8 md:gap-10">
        {ABOUT_STORY.map((block) => (
          <Reveal
            key={block.heading}
            className="flex flex-col gap-[14px] md:grid md:grid-cols-12 md:gap-x-grid-gutter"
          >
            <h2 className="m-0 min-w-0 text-h4 text-primary md:col-span-4 md:text-right">
              {block.heading}
            </h2>
            <p className="m-0 min-w-0 font-body text-base text-secondary md:col-span-7 md:text-lead">
              {block.body}
            </p>
          </Reveal>
        ))}
      </Container>
    </Section>
  );
}

// Four cards reading across rather than down, so the codes run 01, 02 along
// the first row and 03, 04 along the second. Each opens on a rule of its own,
// which is what makes the grid a set of four entries rather than two columns
// of two.
function Values() {
  return (
    <Section surface="dark" id="values" aria-label="How we work">
      <Container className="flex flex-col gap-7 md:gap-9">
        <Reveal>
          <h2 className="m-0 text-h2-mobile text-primary md:max-w-[900px] md:text-h2">
            Four things we hold to.
          </h2>
        </Reveal>

        <Stagger className="grid grid-cols-[minmax(0,1fr)] gap-x-9 md:grid-cols-2">
          {ABOUT_VALUES.map((v, i) => (
            <div
              key={v.code}
              className={`flex min-w-0 flex-col gap-4 border-t border-border py-7 ${staggerChild(i)}`}
            >
              <p className={`${CODE} m-0 text-faint`}>{v.code}</p>
              <h3 className="m-0 text-h3 text-primary">{v.title}</h3>
              <p className="m-0 font-body text-small text-secondary">
                {v.body}
              </p>
            </div>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}

// A ledger against one continuous rule. The period stands in a column of its
// own so the four entries can be read down the left edge alone, and the square
// on the rule is what fixes each entry to a point on it.
function Timeline() {
  return (
    <Section surface="light" id="timeline" aria-label="The yards over time">
      <Container className="flex flex-col gap-7 md:gap-9">
        <Reveal>
          <h2 className="m-0 text-h2-mobile text-primary md:max-w-[900px] md:text-h2">
            The yards over time.
          </h2>
        </Reveal>

        <Stagger
          as="ul"
          className="m-0 flex list-none flex-col border-l border-border p-0"
        >
          {ABOUT_TIMELINE.map((entry, i) => (
            <li
              key={entry.period}
              className={`relative flex min-w-0 flex-col gap-3 py-6 pl-6 before:absolute before:left-[-4px] before:top-[30px] before:h-[7px] before:w-[7px] before:bg-highlight before:content-[''] md:flex-row md:gap-8 md:py-[28px] md:pl-8 md:before:top-[34px] ${staggerChild(i)}`}
            >
              <p className="m-0 font-body text-micro text-faint md:w-[200px] md:flex-none">
                {entry.period}
              </p>
              <div className="flex min-w-0 flex-1 flex-col gap-3">
                <h3 className="m-0 text-h5 text-primary">{entry.title}</h3>
                <p className="m-0 font-body text-small text-secondary">
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
