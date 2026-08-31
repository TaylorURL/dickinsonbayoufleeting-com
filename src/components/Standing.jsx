import { Container, MICRO_SM, Section } from "./ui/Layout";
import { Reveal, Stagger, staggerChild } from "./ui/Reveal";

const CLAIMS = [
  {
    lead: "Your window,\nnot ours",
    body: "You tell us when the boat gets in and the slip is open when it gets there. That covers the arrivals at four in the morning, which is most of them.",
  },
  {
    lead: "We know\nthis water",
    body: "Galveston Bay, the Ship Channel and the GIWW each have their own habits. Our crews have been working the reaches between them for years.",
  },
  {
    lead: "One number\nfor the yard",
    body: "Fleeting, cleaning, surveys and small repairs all reach the same phone, so a dispatcher has one person to call instead of four.",
  },
];

// A statement band: three claims separated by rules that run the full height of
// the row. No panels and no ground of its own, so it reads as a spread in a
// magazine rather than as three more cards. The rules are the whole structure,
// which is why they are on the columns and not around them.
function Standing() {
  return (
    <Section surface="gray" aria-label="Why operators stay">
      <Container>
        <Reveal>
          <p className={`${MICRO_SM} text-faint`}>Why operators stay</p>
        </Reveal>

        <Stagger className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-y-12 md:grid-cols-3 md:gap-x-0">
          {CLAIMS.map((c, i) => (
            <div
              key={c.lead}
              className={`min-w-0 border-t border-border-strong pt-7 md:border-t-0 md:px-9 md:pt-0 md:first:pl-0 md:last:pr-0 ${
                i > 0 ? "md:border-l md:border-border" : ""
              } ${staggerChild(i)}`}
            >
              <p className="m-0 whitespace-pre-line font-condensed text-h3 font-bold uppercase leading-[0.94] tracking-tight text-primary">
                {c.lead}
              </p>
              <p className="m-0 mt-6 max-w-prose-tight text-md text-secondary">
                {c.body}
              </p>
            </div>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}

export default Standing;
