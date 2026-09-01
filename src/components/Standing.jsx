import { BAND, Container, Section } from "./ui/Layout";
import { Reveal, Stagger, staggerChild } from "./ui/Reveal";

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

// A statement band: three claims separated by rules that run the full height of
// the row. No panels and no ground of its own, so it reads as a spread in a
// magazine rather than as three more cards. The rules are the whole structure,
// which is why they are on the columns and not around them.
function Standing() {
  return (
    <Section
      surface="light"
      aria-label="Why operators lease here"
      seam={{ into: "dark" }}
    >
      <Container className={BAND}>
        <Reveal>
          <h2 className="m-0 max-w-title text-h2 text-primary">
            Why operators lease here.
          </h2>
        </Reveal>

        <Stagger className="grid grid-cols-[minmax(0,1fr)] gap-y-12 md:grid-cols-3 md:gap-x-0">
          {CLAIMS.map((c, i) => (
            <div
              key={c.lead}
              className={`flex min-w-0 flex-col gap-6 border-t border-border-strong pt-7 md:border-t-0 md:px-9 md:pt-0 md:first:pl-0 md:last:pr-0 ${
                i > 0 ? "md:border-l md:border-border" : ""
              } ${staggerChild(i)}`}
            >
              <p className="m-0 max-w-title font-condensed text-h3 uppercase tracking-tight text-primary">
                {c.lead}
              </p>
              <p className="m-0 max-w-prose-tight text-md text-secondary">
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
