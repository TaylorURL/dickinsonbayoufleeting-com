import { useId, useState } from "react";
import { FACILITIES } from "../app/constants/facilities";
import { PHONE_NUMBER } from "../app/constants/phoneNumber";
import Button from "./ui/Button";
import { Container, MICRO, MICRO_SM, Section } from "./ui/Layout";
import { Reveal } from "./ui/Reveal";

// Where the two yards sit on the schematic, as a fraction of the waterway
// spine. The diagram is a schematic and says so: it puts the yards in order
// along the water with the reaches named, which is the question a dispatcher
// is actually asking, and it does not pretend to be a chart anyone could
// navigate from.
const SPINE = { top: 56, bottom: 496 };
const MARKS = [
  { at: 0.04, label: "Houston Ship Channel", kind: "reach" },
  { at: 0.22, id: "dickinson", kind: "yard" },
  { at: 0.38, label: "Bolivar Roads", kind: "reach" },
  { at: 0.56, label: "GIWW", kind: "reach" },
  { at: 0.86, id: "freeport", kind: "yard" },
];

const y = (at) => SPINE.top + (SPINE.bottom - SPINE.top) * at;

// A spec row. The value column is tabular so the two yards' figures sit on the
// same axis when the reader flips between them.
function Spec({ label, value, note }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-1 border-b border-hairline py-4 sm:grid-cols-[minmax(0,var(--col-code))_minmax(0,1fr)] sm:items-baseline sm:gap-6">
      <dt className={`${MICRO_SM} text-faint`}>{label}</dt>
      <dd className="m-0 text-md tabular-nums text-primary">
        {value}
        {note ? (
          <span className="ml-2 font-body text-sm text-muted">{note}</span>
        ) : null}
      </dd>
    </div>
  );
}

function Diagram({ activeId, onPick, titleId }) {
  return (
    <svg
      viewBox="0 0 300 540"
      role="img"
      aria-labelledby={titleId}
      className="h-auto w-full max-w-[420px]"
    >
      <title id={titleId}>
        Schematic of the waterway, north at the top: the Houston Ship Channel,
        the Dickinson yard on Galveston Bay, Bolivar Roads, the Gulf
        Intracoastal Waterway, and the Freeport yard.
      </title>

      {/* Statute ticks down the spine. They give the line a scale to be read
          against, which is what stops it reading as a decorative stroke. */}
      {Array.from({ length: 23 }, (_, i) => SPINE.top + i * 20).map((ty) => (
        <line
          key={ty}
          x1="56"
          x2="64"
          y1={ty}
          y2={ty}
          stroke="var(--color-border)"
          strokeWidth="1"
        />
      ))}

      <line
        x1="60"
        x2="60"
        y1={SPINE.top}
        y2={SPINE.bottom}
        stroke="var(--color-border-strong)"
        strokeWidth="1"
      />

      {MARKS.map((m) => {
        const my = y(m.at);
        if (m.kind === "reach") {
          return (
            <g key={m.label}>
              <line
                x1="60"
                x2="76"
                y1={my}
                y2={my}
                stroke="var(--color-border-strong)"
                strokeWidth="1"
              />
              <text
                x="84"
                y={my + 3}
                className="fill-muted font-mono text-[9px] uppercase tracking-label"
              >
                {m.label}
              </text>
            </g>
          );
        }

        const yard = FACILITIES.find((f) => f.id === m.id);
        const on = activeId === m.id;
        // The node is a control, so it answers to a finger, a pointer and a
        // keyboard alike. A group carrying only onClick is reachable by exactly
        // one of the three, which is the shape a mouse-only affordance takes.
        return (
          <g
            key={m.id}
            role="button"
            tabIndex={0}
            aria-pressed={on}
            aria-label={`Show the ${yard.shortName} yard`}
            onClick={() => onPick(m.id)}
            onKeyDown={(e) => {
              if (e.key !== "Enter" && e.key !== " ") return;
              e.preventDefault();
              onPick(m.id);
            }}
            className="cursor-pointer outline-none [touch-action:manipulation] [&>*]:transition-[fill,stroke,opacity] [&>*]:duration-quick [&>*]:ease-settle focus-visible:[&>rect]:stroke-accent hover:[&>text]:fill-primary focus-visible:[&>text]:fill-primary active:[&>*]:opacity-70"
          >
            {/* The whole row is the target, not the seven-pixel mark on it. */}
            <rect
              x="40"
              y={my - 18}
              width="240"
              height="36"
              fill="transparent"
            />
            <line
              x1="60"
              x2="272"
              y1={my}
              y2={my}
              stroke={on ? "var(--color-accent)" : "var(--color-border)"}
              strokeWidth="1"
            />
            {/* The node keeps its corners: it is a mark on a chart rather than a
                control, and the radius scale is for the interface around it. */}
            <rect
              x={on ? 52 : 54}
              y={on ? my - 8 : my - 6}
              width={on ? 16 : 12}
              height={on ? 16 : 12}
              fill={on ? "var(--color-accent)" : "var(--color-bg)"}
              stroke={on ? "var(--color-accent)" : "var(--color-border-strong)"}
              strokeWidth="1"
            />
            <text
              x="84"
              y={my - 8}
              className={
                on
                  ? "fill-primary font-condensed text-[19px] font-bold uppercase"
                  : "fill-secondary font-condensed text-[19px] font-bold uppercase"
              }
            >
              {yard.shortName}
            </text>
            <text
              x="84"
              y={my + 12}
              className="fill-muted font-mono text-[9px] uppercase tracking-label"
            >
              {yard.coord}
            </text>
          </g>
        );
      })}

      {/* The seaward side, hatched the way the ground outside the surveyed area
          is hatched on a plan. */}
      <defs>
        <pattern
          id="dbf-gulf"
          width="7"
          height="7"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="7"
            stroke="var(--color-hairline)"
            strokeWidth="1"
          />
        </pattern>
      </defs>
      <rect x="0" y="0" width="40" height="540" fill="url(#dbf-gulf)" />
      <text
        x="20"
        y="270"
        transform="rotate(-90 20 270)"
        textAnchor="middle"
        className="fill-muted font-mono text-[9px] uppercase tracking-label"
      >
        Gulf of Mexico
      </text>
    </svg>
  );
}

// The yards, answered as one instrument rather than as two cards. The chart
// puts them in order along the water; the sheet beside it holds whichever one
// the reader has picked. Picking happens on the chart or on the tabs, and both
// write the same state, so the two halves can never disagree.
function YardChart() {
  const [activeId, setActiveId] = useState(FACILITIES[0].id);
  const titleId = useId();
  const panelId = useId();
  const yard = FACILITIES.find((f) => f.id === activeId);

  return (
    <Section
      surface="light"
      id="yards"
      aria-label="The two yards"
      seam={{ shape: "fade", into: "gray" }}
    >
      <Container>
        <div className="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-11">
          <Reveal className="flex flex-col gap-6 lg:sticky lg:top-anchor lg:self-start">
            <p className={`${MICRO} m-0 text-faint`}>Where we are</p>
            <Diagram
              activeId={activeId}
              onPick={setActiveId}
              titleId={titleId}
            />
          </Reveal>

          <div className="flex min-w-0 flex-col gap-8">
            <h2 className="m-0 max-w-title text-h2 text-primary">
              Two yards, five acres each.
            </h2>
            <p className="m-0 max-w-prose text-lead text-secondary">
              Both are gated bulkhead frontage with room to lay down spuds and
              deck barges. Which one you want is the reach your tow already
              runs.
            </p>

            {/* The tabs and the chart nodes are the same control twice, so the
                tabs carry the ARIA and the chart is left as the picture. */}
            <div
              role="tablist"
              aria-label="Pick a yard"
              className="flex border-b border-border-strong"
            >
              {FACILITIES.map((f) => {
                const on = f.id === activeId;
                return (
                  <button
                    key={f.id}
                    type="button"
                    role="tab"
                    id={`${panelId}-tab-${f.id}`}
                    aria-selected={on}
                    aria-controls={panelId}
                    onClick={() => setActiveId(f.id)}
                    className={`-mb-px flex flex-col gap-1 rounded-sm border-b-2 px-0 pb-4 pr-10 pt-1 text-left transition-[color,border-color,transform,opacity] duration-quick ease-settle focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-highlight-ring active:scale-[0.97] active:opacity-80 [touch-action:manipulation] ${
                      on
                        ? "border-accent text-primary"
                        : "border-transparent text-muted hover:text-secondary"
                    }`}
                  >
                    <span className={`${MICRO_SM} opacity-70`}>{f.code}</span>
                    <span className="font-condensed text-h4 font-bold uppercase leading-none">
                      {f.shortName}
                    </span>
                  </button>
                );
              })}
            </div>

            <dl
              id={panelId}
              role="tabpanel"
              aria-labelledby={`${panelId}-tab-${activeId}`}
              aria-live="polite"
              className="m-0 border-t border-hairline"
            >
              <Spec label="Waterway" value={yard.waterway} />
              <Spec label="Reaches" value={yard.reach} />
              <Spec label="Address" value={yard.address} />
              <Spec label="Position" value={yard.coord} note="approximate" />
              <Spec label="Yard" value={yard.acreage} note="waterfront" />
              <Spec
                label="Lease"
                value={`$${yard.price.toLocaleString()}`}
                note="per month"
              />
            </dl>

            <ul className="m-0 grid list-none grid-cols-[minmax(0,1fr)] gap-x-10 gap-y-3 p-0 sm:grid-cols-2">
              {yard.included.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 text-sm text-secondary before:mt-[0.55em] before:h-px before:w-4 before:shrink-0 before:bg-border-strong before:content-['']"
                >
                  {item}
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap items-center gap-4">
              <Button to="/contact">Ask About {yard.shortName}</Button>
              <a
                href={`tel:${PHONE_NUMBER.replace(/\D/g, "")}`}
                className={`${MICRO} -my-3 inline-flex min-h-control-sm items-center rounded-sm text-secondary underline decoration-border-strong underline-offset-4 transition-[color,transform,opacity] duration-quick ease-settle hover:text-primary focus-visible:text-primary focus-visible:shadow-focus focus-visible:outline-none active:scale-[0.97] active:opacity-80`}
              >
                {PHONE_NUMBER}
              </a>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

export default YardChart;
