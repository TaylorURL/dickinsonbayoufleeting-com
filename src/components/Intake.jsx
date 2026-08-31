import { Container, MICRO_SM, Section } from "./ui/Layout";
import { Reveal, Stagger, staggerChild } from "./ui/Reveal";

const STEPS = [
  {
    stage: "1.0",
    title: "Call",
    body: "Tell us the barge, the dates and the reach it runs. Most of what we need to quote comes out in that one conversation.",
  },
  {
    stage: "2.0",
    title: "Slip held",
    body: "We confirm the slip and the rate, usually before the call ends. If we cannot hold it we say so then, not the week you sail.",
  },
  {
    stage: "3.0",
    title: "Paperwork",
    body: "Customer agreement, certificate of insurance, barge particulars. We send templates for all three if you do not have them.",
  },
  {
    stage: "4.0",
    title: "Tie up",
    body: "Your tow brings it in on your schedule. Our crew takes the lines, and somebody is on the yard from then on.",
  },
];

// The turn from what we have to how it works. The ladder shape is not reused
// anywhere else on the site, and the rule the numbers sit on is the only
// horizontal run of them.
function Intake() {
  return (
    <Section surface="light" id="intake" aria-label="Getting a barge in">
      <Container>
        <Reveal className="flex max-w-head flex-col gap-5">
          <p className={`${MICRO_SM} text-faint`}>From the first call</p>
          <h2 className="m-0 max-w-title text-h2 text-primary">
            Four steps, and none of them take a week.
          </h2>
        </Reveal>

        {/* The rule runs the length of the row and the numbers sit on it, so the
            sequence is one line the eye follows rather than four blocks that
            happen to be numbered. It turns to run down the left on narrow
            screens, where a horizontal run would have nowhere to go. */}
        <Stagger className="relative mt-12 grid grid-cols-[minmax(0,1fr)] gap-10 before:absolute before:bottom-2 before:left-[7px] before:top-2 before:w-px before:bg-border before:content-[''] sm:grid-cols-2 sm:before:hidden lg:grid-cols-4 lg:before:bottom-auto lg:before:left-0 lg:before:right-0 lg:before:top-[7px] lg:before:block lg:before:h-px lg:before:w-auto lg:before:bg-border-strong">
          {STEPS.map((s, i) => (
            <div
              key={s.stage}
              className={`relative flex min-w-0 gap-5 pl-0 lg:flex-col lg:gap-0 ${staggerChild(i)}`}
            >
              <span
                aria-hidden="true"
                className="relative z-raised mt-[6px] block h-[15px] w-[15px] shrink-0 border border-accent bg-accent lg:mt-0"
              />
              <div className="min-w-0 lg:pr-8 lg:pt-7">
                <p className={`${MICRO_SM} m-0 tabular-nums text-faint`}>
                  {s.stage}
                </p>
                <h3 className="m-0 mt-2 font-condensed text-h4 font-bold uppercase leading-none text-primary">
                  {s.title}
                </h3>
                <p className="m-0 mt-3 max-w-prose text-md text-secondary">
                  {s.body}
                </p>
              </div>
            </div>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}

export default Intake;
