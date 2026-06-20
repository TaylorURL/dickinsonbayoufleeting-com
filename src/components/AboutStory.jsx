import "./styles/AboutStory.css";
import { ABOUT_STORY, ABOUT_VALUES, ABOUT_TIMELINE } from "../app/constants/about";
import { useReveal } from "../app/hooks/useReveal";

function AboutStory() {
  const storyHeadRef = useReveal();
  const storyBlocksRef = useReveal();
  const valuesHeadRef = useReveal();
  const valuesGridRef = useReveal();
  const timelineHeadRef = useReveal();
  const timelineListRef = useReveal();
  return (
    <>
      <section
        className="aboutStory section"
        data-surface="light"
        id="story"
        aria-label="Our story"
      >
        <div className="container">
          <div className="section__head reveal-on-scroll" ref={storyHeadRef}>
            <p className="eyebrow eyebrow--strong mono">Who we are</p>
            <h2 className="section__title">
              A coastal fleeting company built around two yards and the people
              who run them.
            </h2>
            <p className="section__subtitle">
              We are a small operation that takes pride in being a good neighbor
              on the water — to our customers, to the regulators, and to the
              communities along Dickinson Bayou and the Gulf Intracoastal
              Waterway.
            </p>
          </div>

          <div className="aboutStory__blocks">
            {ABOUT_STORY.map((b, idx) => (
              <article key={b.heading} className="aboutStory__block">
                <span className="aboutStory__idx mono">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <h3 className="aboutStory__heading">{b.heading}</h3>
                <p className="aboutStory__body">{b.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        className="aboutValues section"
        data-surface="dark"
        id="values"
        aria-label="What we stand for"
      >
        <div className="container">
          <div className="section__head">
            <p className="eyebrow eyebrow--strong mono">How we work</p>
            <h2 className="section__title">Four things we will not compromise on.</h2>
          </div>
          <ul className="aboutValues__grid" aria-label="Operating principles">
            {ABOUT_VALUES.map((v) => (
              <li key={v.code} className="valueCard">
                <span className="valueCard__code mono">{v.code}</span>
                <h3 className="valueCard__title">{v.title}</h3>
                <p className="valueCard__body">{v.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        className="aboutTimeline section"
        data-surface="light"
        id="timeline"
        aria-label="Where we have been"
      >
        <div className="container">
          <div className="section__head">
            <p className="eyebrow eyebrow--strong mono">Where we have been</p>
            <h2 className="section__title">From one slip to a coastal operation.</h2>
          </div>
          <ol className="aboutTimeline__list" aria-label="Company history">
            {ABOUT_TIMELINE.map((t, idx) => (
              <li key={t.title} className="timelineCard">
                <span className="timelineCard__period mono">{t.period}</span>
                <span className="timelineCard__rule" aria-hidden="true" />
                <span className="timelineCard__idx mono">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <h3 className="timelineCard__title">{t.title}</h3>
                <p className="timelineCard__body">{t.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}

export default AboutStory;
