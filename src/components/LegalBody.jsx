import "./styles/LegalBody.css";
import { useReveal } from "../app/hooks/useReveal";

// Numbered prose sections with the same rule-and-index treatment the services
// and capability lists use, so a legal page reads as part of the site rather
// than a page borrowed from somewhere else.
function LegalBody({ sections, updated, label, id, surface = "light" }) {
  const listRef = useReveal();
  return (
    <section
      className="legal section"
      data-surface={surface}
      id={id}
      aria-label={label}
    >
      <div className="container">
        <ol
          className="legal__list reveal-on-scroll reveal-stagger"
          ref={listRef}
          aria-label="Sections"
        >
          {sections.map((section, idx) => (
            <li key={section.id} className="legalBlock" id={section.id}>
              <span className="legalBlock__idx mono" aria-hidden="true">
                {String(idx + 1).padStart(2, "0")}
              </span>
              <h2 className="legalBlock__heading">{section.heading}</h2>
              <div className="legalBlock__body">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </li>
          ))}
        </ol>
        <p className="legal__updated mono">Last updated · {updated}</p>
      </div>
    </section>
  );
}

export default LegalBody;
