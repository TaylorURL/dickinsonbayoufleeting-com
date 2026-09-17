import { Container, Section } from "../ui/Layout";
import { Reveal, Stagger, staggerChild } from "../ui/Reveal";

const CLAIMS = [
  {
    lead: "Your own footprint",
    body: "Gated acreage with bulkhead frontage, not a slip you share. Lay down spuds, deck barges and project equipment and leave them where you put them.",
  },
  {
    lead: "We know this water",
    body: "Galveston Bay, the Ship Channel and the GIWW each have their own habits. Our crews have been working the reaches between them for years.",
  },
  {
    lead: "Staffed from day one",
    body: "The shore crew already works both yards. Nobody has to hire line handlers to make the lease worth having, and the gate is watched overnight.",
  },
];

// A statement band: three claims held apart by the rules between them and
// nothing else. No panels and no ground of its own, so it reads as a spread
// rather than as three more cards. The rules turn a quarter when the columns
// stack, because a divider between two things side by side is the same divider
// above the second of them once they are one under the other.
function Standing() {
  return (
    <Section surface="light" aria-label="Why operators lease here">
      <Container className="flex flex-col gap-7 md:gap-9">
        <Reveal>
          <h2 className="m-0 max-w-[900px] text-h2-mobile text-primary md:text-h2">
            Why operators lease here.
          </h2>
        </Reveal>

        <Stagger className="grid grid-cols-[minmax(0,1fr)] gap-7 md:grid-cols-3 md:gap-0">
          {CLAIMS.map((claim, i) => (
            <div
              key={claim.lead}
              className={`flex min-w-0 flex-col gap-4 border-t border-border pt-6 md:border-l md:border-t-0 md:px-9 md:pt-0 md:first:border-l-0 md:first:pl-0 md:last:pr-0 md:gap-5 ${staggerChild(i)}`}
            >
              <h3 className="m-0 text-h4 text-primary md:text-h3">
                {claim.lead}
              </h3>
              <p className="m-0 text-small text-secondary">{claim.body}</p>
            </div>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}

export default Standing;
