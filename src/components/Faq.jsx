import { FAQ_ITEMS } from "../app/constants/faq";
import { PHONE_NUMBER } from "../app/constants/phoneNumber";
import { BAND, Container, Eyebrow, MICRO_SM, Section } from "./ui/Layout";
import { Reveal, Stagger, staggerChild } from "./ui/Reveal";

// Printed as a spread rather than as an accordion. Seven answers of three lines
// each fit in two columns without asking anybody to click, and a question whose
// answer is already on the page is one fewer thing between a dispatcher and the
// call. The rule sits over each question, so the column reads as a run of
// entries rather than as a stack of panels.
function Faq({ surface = "light", seam = null }) {
  return (
    <Section
      surface={surface}
      seam={seam}
      id="faq"
      aria-label="Common questions"
    >
      <Container className={BAND}>
        <Reveal className="grid grid-cols-[minmax(0,1fr)] gap-6 border-b border-border-strong pb-9 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
          <div className="flex min-w-0 flex-col gap-5">
            <Eyebrow>Common questions</Eyebrow>
            <h2 className="m-0 max-w-title text-h2 text-primary">
              Straight answers.
            </h2>
          </div>
          <p className="m-0 max-w-prose-tight text-sm text-muted sm:text-right">
            Anything not here, ask on the line.
            <br />
            <a
              href={`tel:1${PHONE_NUMBER.replace(/\D/g, "")}`}
              className={`${MICRO_SM} -mb-3 mt-2 inline-flex min-h-control-sm items-center rounded-sm text-secondary underline decoration-border-strong underline-offset-4 transition-[color,transform,opacity] duration-quick ease-settle hover:text-primary focus-visible:text-primary focus-visible:shadow-focus focus-visible:outline-none`}
            >
              {PHONE_NUMBER}
            </a>
          </p>
        </Reveal>

        <Stagger className="columns-1 gap-x-9 md:columns-2">
          {FAQ_ITEMS.map((item, i) => (
            <div
              key={item.q}
              className={`mb-0 inline-block w-full break-inside-avoid border-b border-hairline py-7 ${staggerChild(i)}`}
            >
              <h3 className="m-0 text-h5 text-primary">{item.q}</h3>
              <p className="m-0 mt-3 text-sm text-secondary">{item.a}</p>
            </div>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}

export default Faq;
