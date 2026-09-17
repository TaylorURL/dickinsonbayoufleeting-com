import { CODE, Container, MICRO, Section } from "../ui/Layout";
import { Reveal, Stagger, staggerChild } from "../ui/Reveal";

// What happens between a first call and a barge tied up, and the three
// documents that have to exist before it can. Both were already on the site,
// scattered across a form hint and an answer near the bottom of the services
// page, which is the wrong end of the site for something a caller wants
// before they dial.
//
// The run is laid out as a sequence rather than as another column of claims:
// four states in order, each named by what happens rather than by its number,
// with the rule above each one carrying the direction.
const LEASE_STEPS = [
  {
    title: "Call",
    body: "Somebody who works the dock picks up and tells you on the spot whether the space you want exists.",
  },
  {
    title: "Walk the yard",
    body: "Come and see either dock before anything is signed. We will have the person who works it there to walk it with you.",
  },
  {
    title: "Terms in writing",
    body: "Lease terms come back inside one business day, with the rate and what the term carries stated on them.",
  },
  {
    title: "Tie up",
    body: "Once the paperwork is back the slip is yours and the shore crew is expecting you.",
  },
];

const PAPERWORK = [
  {
    title: "Barge particulars",
    body: "Dimensions, draft, and the reach your tow runs. We send the template if you do not have one.",
  },
  {
    title: "Certificate of insurance",
    body: "Current, with the coverage your own operation carries.",
  },
  {
    title: "Customer agreement",
    body: "Ours, signed. We send the template if you do not have one.",
  },
];

function BeforeYouCall() {
  return (
    <Section
      surface="light"
      id="before-you-call"
      aria-label="Before you call"
      className="bg-bg-deep"
    >
      <Container className="flex flex-col gap-7 md:gap-9">
        <Reveal className="flex max-w-head flex-col gap-4 md:gap-5">
          <h2 className="m-0 text-h2-mobile text-primary md:max-w-[900px] md:text-h2">
            How a lease actually starts.
          </h2>
          <p className="m-0 max-w-plate-lede font-body text-lead-mobile text-secondary md:text-lead">
            Four steps, none of them a meeting. The paperwork below is all we
            ask for, and two of the three are ours to send.
          </p>
        </Reveal>

        {/* The step's own count is drawn as a mark rather than written as a
            label, because the order is the information and the number is only
            how the eye follows it. */}
        <Stagger className="grid grid-cols-[minmax(0,1fr)] gap-y-6 md:grid-cols-4 md:gap-x-grid-gutter">
          {LEASE_STEPS.map((step, i) => (
            <div
              key={step.title}
              className={`flex min-w-0 flex-col gap-3 border-t-2 border-border-strong pt-4 md:gap-[14px] md:pt-5 ${staggerChild(i)}`}
            >
              <p className={`${CODE} m-0 tabular-nums text-primary`}>
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="m-0 text-h5 text-primary">{step.title}</h3>
              <p className="m-0 font-body text-small text-secondary">
                {step.body}
              </p>
            </div>
          ))}
        </Stagger>

        <div className="flex flex-col gap-5 border-t border-border pt-6 md:pt-7">
          <p className={`${MICRO} m-0 text-faint`}>What to have ready</p>
          <dl className="m-0 grid grid-cols-[minmax(0,1fr)] gap-y-5 md:grid-cols-3 md:gap-x-8">
            {PAPERWORK.map((item) => (
              <div
                key={item.title}
                className="flex min-w-0 flex-col gap-2 md:gap-[10px]"
              >
                <dt className="font-condensed text-h5 uppercase text-primary">
                  {item.title}
                </dt>
                <dd className="m-0 font-body text-small text-secondary">
                  {item.body}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Container>
    </Section>
  );
}

export default BeforeYouCall;
