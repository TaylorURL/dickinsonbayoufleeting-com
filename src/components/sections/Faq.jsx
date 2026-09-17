import { useId, useState } from "react";
import { FAQ_ITEMS } from "../../app/content/faq";
import { PHONE_NUMBER, telHref } from "../../app/content/phoneNumber";
import { Container, Eyebrow, Section } from "../ui/Layout";
import { Reveal, Stagger, staggerChild } from "../ui/Reveal";

// Seven questions as a disclosure list, one open at a time. Printed open, the
// seven answers are nine hundred words of body copy the page ends on, and the
// questions themselves - which are the part a reader is scanning for - are
// buried in it. The first is open on arrival so the shape of an answer is
// visible without asking for one.

// The mark. A plus whose upright turns a quarter and fades as the row opens,
// which leaves the crossbar behind rather than the cross a rotated plus would
// give.
function Mark({ open }) {
  const bar = "absolute bg-faint";
  return (
    <span
      aria-hidden="true"
      className="relative mt-[5px] h-icon-sm w-icon-sm flex-none"
    >
      <span className={`${bar} left-0 top-1/2 h-px w-full -translate-y-1/2`} />
      <span
        className={`${bar} left-1/2 top-0 h-full w-px -translate-x-1/2 transition-[transform,opacity] duration-quick ease-settle motion-reduce:transition-none ${
          open ? "rotate-90 opacity-0" : "rotate-0 opacity-100"
        }`}
      />
    </span>
  );
}

function Faq({ surface = "light" }) {
  const [openIndex, setOpenIndex] = useState(0);
  const baseId = useId();

  return (
    <Section surface={surface} id="faq" aria-label="Common questions">
      <Container className="flex flex-col gap-7 md:gap-9">
        <Reveal className="grid grid-cols-[minmax(0,1fr)] gap-6 border-b border-border-strong pb-6 md:grid-cols-12 md:items-end md:gap-x-grid-gutter">
          <div className="flex min-w-0 flex-col gap-5 md:col-span-7">
            <Eyebrow tone="quiet">Common questions</Eyebrow>
            <h2 className="m-0 text-h2-mobile text-primary md:text-h2">
              Straight answers.
            </h2>
          </div>

          {/* The line beside the head, for the question the list does not
              answer. The number is set as a figure rather than as a link with
              a label, because the number is the thing being offered. */}
          <div className="flex min-w-0 flex-col items-start gap-2 md:col-span-5 md:items-end md:text-right">
            <p className="m-0 text-small text-muted">
              Anything not here, ask on the line.
            </p>
            <a
              href={telHref()}
              className="inline-flex items-center rounded-sm font-mono text-figure-sm tabular-nums text-primary no-underline transition-colors duration-quick ease-settle hover:text-highlight focus-visible:shadow-focus focus-visible:outline-none"
            >
              {PHONE_NUMBER}
            </a>
          </div>
        </Reveal>

        <Stagger as="ul" className="m-0 list-none p-0">
          {FAQ_ITEMS.map((item, i) => {
            const open = openIndex === i;
            const questionId = `${baseId}-question-${i}`;
            const answerId = `${baseId}-answer-${i}`;

            return (
              <li
                key={item.q}
                className={`border-b border-border pb-6 ${staggerChild(i)}`}
              >
                <h3 className="m-0">
                  <button
                    type="button"
                    id={questionId}
                    aria-expanded={open}
                    aria-controls={answerId}
                    onClick={() => setOpenIndex(open ? -1 : i)}
                    className="flex w-full items-start justify-between gap-6 rounded-sm pt-6 text-left font-condensed text-h5 uppercase text-primary transition-colors duration-quick ease-settle hover:text-highlight focus-visible:shadow-focus focus-visible:outline-none"
                  >
                    <span className="min-w-0">{item.q}</span>
                    <Mark open={open} />
                  </button>
                </h3>

                {/* The panel is measured in grid rows rather than in pixels, so
                    it can travel between nothing and its own height without
                    anything having to read that height first. It is taken out
                    of the tree while it is closed, because a collapsed row is
                    not something a reader has asked for. */}
                <div
                  id={answerId}
                  role="region"
                  aria-labelledby={questionId}
                  inert={!open || undefined}
                  className={`grid transition-[grid-template-rows,opacity] duration-settle ease-settle motion-reduce:transition-none ${
                    open
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="m-0 pt-3 text-small text-secondary">
                      {item.a}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </Stagger>
      </Container>
    </Section>
  );
}

export default Faq;
