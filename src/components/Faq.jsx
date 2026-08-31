import { useState } from "react";
import { FAQ_ITEMS } from "../app/constants/faq";
import { ChevronDownIcon } from "./Icons";
import { BAND, Container, Section, SectionHead } from "./ui/Layout";
import { Reveal, Stagger, staggerChild } from "./ui/Reveal";

// The rule between two questions belongs to the row, not the button: the
// buttons stand back from it so two stacked targets keep a gap between them and
// a thumb landing near the line opens the question it was aimed at.
const TOGGLE = [
  "group grid w-full items-center gap-5 border-0 bg-transparent font-body text-primary",
  "grid-cols-[minmax(0,1fr)_auto] sm:grid-cols-[theme(spacing.index)_minmax(0,1fr)_auto]",
  "my-1 py-5 pl-3 pr-4",
  "transition-transform duration-settle ease-settle hover:translate-x-1 active:scale-[0.99] motion-reduce:transition-none",
  "focus-visible:outline focus-visible:outline-1 focus-visible:-outline-offset-1 focus-visible:outline-highlight-ring",
].join(" ");

function Faq({ surface = "light" }) {
  const [open, setOpen] = useState(0);

  return (
    <Section surface={surface} id="faq" aria-label="Frequently Asked Questions">
      <Container className={BAND}>
        <Reveal>
          <SectionHead
            eyebrow="Common questions"
            title="Straight answers."
            subtitle="The questions dispatchers and operators ask us most. If you have one that is not here, the operations desk is one call away."
          />
        </Reveal>

        <Stagger
          as="ul"
          aria-label="Frequently Asked Questions"
          className="m-0 list-none border-t border-border p-0"
        >
          {FAQ_ITEMS.map((item, idx) => {
            const expanded = open === idx;
            return (
              <li
                key={item.q}
                data-open={expanded}
                className={`relative border-b border-border transition-colors duration-quick ease-settle data-[open=true]:bg-layer-1 before:absolute before:bottom-0 before:left-0 before:top-0 before:w-marker before:origin-center before:scale-y-0 before:bg-highlight before:transition-transform before:duration-settle before:ease-swell before:content-[''] data-[open=true]:before:scale-y-100 motion-reduce:before:transition-none ${staggerChild(idx)}`}
              >
                <button
                  type="button"
                  className={TOGGLE}
                  aria-expanded={expanded}
                  aria-controls={`faq-answer-${idx}`}
                  onClick={() => setOpen(expanded ? -1 : idx)}
                >
                  <span
                    className={`hidden font-mono text-xs font-medium tracking-control transition-colors duration-quick ease-settle group-hover:text-highlight sm:block ${
                      expanded ? "text-highlight" : "text-faint"
                    }`}
                  >
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <span className="text-left font-condensed text-h6 font-semibold uppercase tracking-normal text-primary">
                    {item.q}
                  </span>
                  <span
                    aria-hidden="true"
                    className={`inline-flex h-icon-lg w-icon-lg items-center justify-center border transition-[transform,color,border-color] duration-settle ease-swell group-hover:text-highlight motion-reduce:transition-none ${
                      expanded
                        ? "rotate-180 border-highlight text-highlight"
                        : "border-hairline text-faint"
                    }`}
                  >
                    <ChevronDownIcon />
                  </span>
                </button>
                <div
                  id={`faq-answer-${idx}`}
                  role="region"
                  hidden={!expanded}
                  className="max-w-prose animate-rise pb-6 pl-3 pr-4 text-base leading-loose text-secondary motion-reduce:animate-none sm:pl-answer-indent"
                >
                  <p>{item.a}</p>
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
