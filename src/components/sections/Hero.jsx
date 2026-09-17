import Film, { HERO_FILM } from "../ui/Film";
import Button from "../ui/Button";
import { Container, Eyebrow } from "../ui/Layout";
import { rise } from "../ui/Reveal";
import { FACILITIES } from "../../app/content/facilities";
import { openInquiry } from "../../app/openInquiry";

const HERO_EYEBROW = "Barge fleeting & dock leases · Texas Gulf Coast";
const HERO_TITLE_LEAD = "Lease the yard.";
const HERO_TITLE_RULED = "The crew";
const HERO_TITLE_TRAIL = "comes with it.";
const HERO_SUBTITLE =
  "Five gated acres at Dickinson or Freeport, a barge slip held for the term, and line handling on the dock. From $4,100 a month.";

const ACRES = FACILITIES.reduce((sum, f) => sum + f.acres, 0);

// The readings, ruled across the foot of the plate rather than boxed beside the
// headline. A strip along the bottom edge reads as instrumentation on the
// picture; the same facts in a panel read as a card sitting on top of it.
//
// Four cells across at desktop and two by two on a phone, divided by the one
// rule weight the rest of the page is ruled at.
function HeroDatum() {
  const cells = [
    ...FACILITIES.map((f) => ({
      key: f.id,
      label: `${f.shortName} Yard`,
      value: `${f.acreage} on ${f.waterway}`,
    })),
    // Set as typed rather than counted up to. A number that animates on a page
    // selling five acres of dock reads as a marketing device, and it is the
    // one piece of motion that would carry a fact.
    { key: "acres", label: "Waterfront", value: `${ACRES} ac` },
    { key: "crew", label: "Shore Crew", value: "24 / 7 on site" },
  ];

  return (
    <div className="relative border-t border-border">
      <Container>
        <dl className="m-0 grid grid-cols-2 md:grid-cols-4">
          {cells.map((c, i) => (
            <div
              key={c.key}
              className={`min-w-0 py-4 md:py-5 ${
                i % 2 === 1 ? "border-l border-border pl-5" : ""
              } ${i > 1 ? "border-t border-border" : ""} ${
                i > 0 ? "md:border-l md:border-border md:pl-6" : ""
              } md:border-t-0`}
            >
              <dt className="m-0 font-mono text-code text-faint">{c.label}</dt>
              <dd className="m-0 mt-2 font-body text-small tabular-nums text-secondary">
                {c.value}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </div>
  );
}

function HeroSection() {
  return (
    <section
      data-hero
      data-surface="dark"
      aria-label="Introduction"
      id="overview"
      className="relative isolate flex min-h-plate-hero flex-col items-stretch overflow-hidden text-primary"
    >
      <div aria-hidden="true" className="absolute inset-0 z-behind bg-bg-deep">
        <Film film={HERO_FILM} />
        <span className="absolute inset-0 bg-plate-scrim" />
      </div>

      {/* The copy sits on the bottom edge of the plate, above the strip, so the
          picture is read first and the words are read against it. */}
      <Container className="relative flex flex-1 flex-col items-start justify-end gap-5 pb-8 pt-plate-top md:gap-7 md:pb-9">
        <Eyebrow className={rise()}>{HERO_EYEBROW}</Eyebrow>

        <h1 className="m-0 min-w-0 text-hero-mobile text-primary md:text-hero">
          <span className={`block ${rise(1)}`}>{HERO_TITLE_LEAD}</span>
          {/* With no hue in the palette the emphasis is carried by a rule under
              the words rather than by a colour on them. It is laid out as an
              inline block so the rule belongs to that line box; on a plain
              inline span it hangs below one. */}
          <span className={`block ${rise(2)}`}>
            <span className="inline-block border-b-3 border-highlight pb-1">
              {HERO_TITLE_RULED}
            </span>{" "}
            {HERO_TITLE_TRAIL}
          </span>
        </h1>

        <p
          className={`m-0 max-w-hero-lede text-lead-mobile text-secondary md:text-lead ${rise(3)}`}
        >
          {HERO_SUBTITLE}
        </p>

        <div
          className={`flex w-full flex-col gap-3 pt-1 xs:w-auto xs:flex-row xs:items-center ${rise(4)}`}
        >
          <Button variant="primary" href="#quote" onClick={openInquiry}>
            Get Lease Terms
          </Button>
          <Button variant="ghost" href="#yards">
            See Both Yards
          </Button>
        </div>
      </Container>

      <HeroDatum />
    </section>
  );
}

export default HeroSection;
