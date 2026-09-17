import { useId } from "react";
import { FACILITIES } from "../../app/content/facilities";
import { Container, Section, SectionHead } from "../ui/Layout";
import { Reveal, Stagger, staggerChild } from "../ui/Reveal";
import LeaseCard from "./LeaseCard";

// The two yards, answered as one instrument. The schematic puts them in order
// along the water with the reaches named, which is the question a dispatcher is
// actually asking, and the two rate cards stand beside it. Both cards are on
// the page: the whole proposition is which yard an operator wants, and a
// control that shows one rate at a time is in the way of that.

// Where the schematic is drawn. The spine runs the height of the plate and
// every mark is placed as a fraction of it, so moving a yard is one number.
const SPINE = { top: 58, bottom: 514 };
const MARKS = [
  { at: 0.04, label: "Houston Ship Channel", kind: "reach" },
  { at: 0.22, id: "dickinson", kind: "yard" },
  { at: 0.38, label: "Bolivar Roads", kind: "reach" },
  { at: 0.56, label: "GIWW", kind: "reach" },
  { at: 0.86, id: "freeport", kind: "yard" },
];

const at = (fraction) => SPINE.top + (SPINE.bottom - SPINE.top) * fraction;

// Statute ticks down the spine. They give the line a scale to be read against,
// which is what stops it reading as a decorative stroke.
const TICKS = Array.from({ length: 23 }, (_, i) => SPINE.top + i * 20);

function WaterwayChart({ titleId }) {
  return (
    <svg
      viewBox="0 0 420 560"
      role="img"
      aria-labelledby={titleId}
      className="h-auto w-full max-w-[420px]"
    >
      <title id={titleId}>
        Schematic of the waterway, north at the top: the Houston Ship Channel,
        the Dickinson yard on Galveston Bay, Bolivar Roads, the Gulf
        Intracoastal Waterway, and the Freeport yard.
      </title>

      {/* The seaward side, laid in as the one ground the drawing has. */}
      <rect x="0" y="0" width="56" height="560" className="fill-layer-1" />
      <text
        x="28"
        y="280"
        transform="rotate(-90 28 280)"
        textAnchor="middle"
        className="fill-muted font-mono text-code uppercase"
      >
        Gulf of Mexico
      </text>

      {TICKS.map((y) => (
        <line
          key={y}
          x1="78"
          x2="90"
          y1={y}
          y2={y}
          className="stroke-border"
          strokeWidth="1"
        />
      ))}

      <line
        x1="84"
        x2="84"
        y1={SPINE.top}
        y2={SPINE.bottom}
        className="stroke-border-strong"
        strokeWidth="1"
      />

      {MARKS.map((mark, index) => {
        const y = at(mark.at);

        if (mark.kind === "reach") {
          return (
            <g key={mark.label}>
              <line
                x1="84"
                x2="106"
                y1={y}
                y2={y}
                className="stroke-border-strong"
                strokeWidth="1"
              />
              <text
                x="114"
                y={y + 4}
                className="fill-muted font-mono text-code uppercase"
              >
                {mark.label}
              </text>
            </g>
          );
        }

        const yard = FACILITIES.find((facility) => facility.id === mark.id);
        // The first yard is drawn solid and the second hollow, so the schematic
        // has a foreground: two names set at the same weight on the same line
        // read as a legend rather than as a chart.
        const lead = index === 1;

        return (
          <g key={mark.id}>
            <line
              x1="84"
              x2="400"
              y1={y}
              y2={y}
              className={lead ? "stroke-highlight" : "stroke-border"}
              strokeWidth="1"
            />
            {/* The node keeps its corners: it is a mark on a chart rather than
                a control, and the radius scale is for the interface around it. */}
            <rect
              x={lead ? 76 : 78}
              y={lead ? y - 8 : y - 6}
              width={lead ? 16 : 12}
              height={lead ? 16 : 12}
              className={
                lead ? "fill-highlight" : "fill-bg stroke-border-strong"
              }
              strokeWidth="1"
            />
            <text
              x="114"
              y={y - 14}
              className={`font-condensed text-h4 uppercase ${
                lead ? "fill-primary" : "fill-secondary"
              }`}
            >
              {yard.shortName}
            </text>
            <text x="114" y={y + 23} className="fill-muted font-mono text-data">
              {yard.coord}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function YardChart() {
  const titleId = useId();

  return (
    <Section surface="light" id="yards" aria-label="The two yards">
      <Container className="flex flex-col gap-7 md:gap-9">
        <Reveal>
          <SectionHead
            eyebrow="Where we are"
            title="Two yards, five acres each."
            subtitle="Both are gated bulkhead frontage with room to lay down spuds and deck barges. Which one you want is the reach your tow already runs."
          />
        </Reveal>

        {/* The chart holds its own width rather than taking a share of the
            grid: below 1080 a quarter of the container is narrower than the
            drawing can be read at, so it goes full width above the cards. */}
        <div className="grid grid-cols-[minmax(0,1fr)] gap-7 lg:grid-cols-[minmax(0,420fr)_minmax(0,796fr)] lg:gap-x-10">
          <Reveal className="min-w-0">
            <WaterwayChart titleId={titleId} />
          </Reveal>

          <Stagger className="flex min-w-0 flex-col">
            {FACILITIES.map((facility, i) => (
              <div key={facility.id} className={`min-w-0 ${staggerChild(i)}`}>
                <LeaseCard facility={facility} />
              </div>
            ))}
          </Stagger>
        </div>
      </Container>
    </Section>
  );
}

export default YardChart;
