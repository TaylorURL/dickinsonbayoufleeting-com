import "./styles/SafetyContent.css";
import {
  SAFETY_PILLARS,
  SAFETY_PRACTICES,
  COMPLIANCE_DOCS,
} from "../app/constants/safety";
import { useReveal } from "../app/hooks/useReveal";

function SafetyContent() {
  const pillarsHeadRef = useReveal();
  const pillarsGridRef = useReveal();
  const practicesHeadRef = useReveal();
  const practicesListRef = useReveal();
  const docsHeadRef = useReveal();
  const docsListRef = useReveal();
  return (
    <>
      <section
        className="safetyPillars section"
        data-surface="light"
        id="pillars"
        aria-label="Safety pillars"
      >
        <div className="container">
          <div className="section__head">
            <p className="eyebrow eyebrow--strong mono">How we approach safety</p>
            <h2 className="section__title">
              Four pillars that hold up the daily work.
            </h2>
            <p className="section__subtitle">
              Safe operations are how we keep our crews healthy, our customers
              insured, and our license to operate intact. These are the four
              things we put first.
            </p>
          </div>
          <ul className="safetyPillars__grid" aria-label="Safety pillars">
            {SAFETY_PILLARS.map((p) => (
              <li key={p.code} className="pillarCard">
                <span className="pillarCard__code mono">{p.code}</span>
                <h3 className="pillarCard__title">{p.title}</h3>
                <p className="pillarCard__body">{p.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        className="safetyPractices section"
        data-surface="dark"
        id="practices"
        aria-label="Daily practices"
      >
        <div className="container">
          <div className="section__head">
            <p className="eyebrow eyebrow--strong mono">Daily practice</p>
            <h2 className="section__title">
              What that looks like at the dock.
            </h2>
            <p className="section__subtitle">
              Procedures only matter if they are practiced. These are the
              recurring routines that make the policy real.
            </p>
          </div>

          <ol className="safetyPractices__list" aria-label="Daily practice list">
            {SAFETY_PRACTICES.map((p, idx) => (
              <li key={p.title} className="practiceRow">
                <span className="practiceRow__idx mono" aria-hidden="true">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <h3 className="practiceRow__title">{p.title}</h3>
                <p className="practiceRow__body">{p.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section
        className="complianceDocs section"
        data-surface="light"
        id="compliance"
        aria-label="Compliance documents"
      >
        <div className="container">
          <div className="section__head">
            <p className="eyebrow eyebrow--strong mono">Documents</p>
            <h2 className="section__title">
              Paperwork available to customers.
            </h2>
            <p className="section__subtitle">
              The documents most customers ask for in their vendor onboarding.
              Email the office or call the direct line and we will send copies.
            </p>
          </div>
          <ul className="complianceDocs__list" aria-label="Compliance documents">
            {COMPLIANCE_DOCS.map((doc, idx) => (
              <li key={doc} className="docRow">
                <span className="docRow__idx mono" aria-hidden="true">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <span className="docRow__text">{doc}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

export default SafetyContent;
