import { useState } from "react";
import "./styles/Faq.css";
import { FAQ_ITEMS } from "../app/constants/faq";
import { useReveal } from "../app/hooks/useReveal";

function Faq({ surface = "light" }) {
  const [open, setOpen] = useState(0);
  const headRef = useReveal();
  const listRef = useReveal();
  return (
    <section
      className="faq section"
      data-surface={surface}
      aria-label="Frequently asked questions"
      id="faq"
    >
      <div className="container">
        <div className="section__head reveal-on-scroll" ref={headRef}>
          <p className="eyebrow eyebrow--strong mono">Common questions</p>
          <h2 className="section__title">Straight answers.</h2>
          <p className="section__subtitle">
            The questions dispatchers and operators ask us most. If you have one
            that is not here, the operations desk is one call away.
          </p>
        </div>

        <ul className="faq__list" aria-label="Frequently asked questions">
          {FAQ_ITEMS.map((item, idx) => {
            const expanded = open === idx;
            return (
              <li
                key={item.q}
                className={`faqItem${expanded ? " faqItem--open" : ""}`}
              >
                <button
                  className="faqItem__toggle"
                  aria-expanded={expanded}
                  aria-controls={`faq-answer-${idx}`}
                  onClick={() => setOpen(expanded ? -1 : idx)}
                >
                  <span className="faqItem__index mono">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <span className="faqItem__q">{item.q}</span>
                  <span
                    className="faqItem__chev"
                    aria-hidden="true"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="square"
                      strokeLinejoin="miter"
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </span>
                </button>
                <div
                  id={`faq-answer-${idx}`}
                  className="faqItem__answer"
                  role="region"
                  hidden={!expanded}
                >
                  <p>{item.a}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export default Faq;
