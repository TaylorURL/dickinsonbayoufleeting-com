import { useCountUp } from "../app/hooks/useCountUp";
import { useReveal } from "../app/hooks/useReveal";
import { PHONE_NUMBER } from "../app/constants/phoneNumber";
import { ArrowRightIcon } from "./Icons";
import { HULL_PLATE } from "./ui/Layout";

const FACILITIES = [
  {
    code: "F-01",
    name: "San Leon",
    region: "Galveston Bay · Houston Ship Channel",
    coord: "29.479° N · 94.918° W",
  },
  {
    code: "F-02",
    name: "Freeport",
    region: "Gulf Intracoastal Waterway",
    coord: "28.948° N · 95.341° W",
  },
];

const STATS = [
  { value: 2, suffix: "", label: "Coastal Facilities" },
  { value: 10, suffix: " ac", label: "Waterfront Acreage" },
  { value: 24, suffix: "/7", label: "Shore Operations" },
  { value: 100, suffix: "%", label: "Direct Waterfront" },
];

const COUNT_UP_MS = 1600;

const MICRO = "font-mono text-2xs font-medium uppercase tracking-label";
const TICK = "pointer-events-none absolute h-icon-sm w-icon-sm";

function StatValue({ value, suffix }) {
  const { ref, display } = useCountUp(value, { duration: COUNT_UP_MS });
  return (
    <dd
      ref={ref}
      className="m-0 font-condensed text-h5 leading-none tabular-nums text-primary [overflow-wrap:anywhere] xs:text-h4"
    >
      {display}
      {suffix ? (
        <span className="ml-1 font-semibold tracking-normal text-highlight">
          {suffix}
        </span>
      ) : null}
    </dd>
  );
}

// The panel beside the headline: where the yards are, how big they are, and the
// number that reaches a person. It keeps the hero's grid slot and nothing else
// about the hero.
function OperationsConsole() {
  const { ref, revealed } = useReveal();
  const telHref = `tel:1${PHONE_NUMBER.replace(/[^0-9]/g, "")}`;

  return (
    <aside
      ref={ref}
      aria-label="Operations Console"
      className={`relative flex w-full flex-col gap-5 self-stretch border border-border bg-console px-5 py-6 shadow-plate transition-[opacity,transform] duration-settle ease-swell motion-reduce:transition-none xs:px-6 xs:py-7 lg:self-center laptop:gap-4 laptop:px-5 laptop:py-6 ${HULL_PLATE} ${
        revealed
          ? "translate-y-0 opacity-100"
          : "translate-y-6 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100"
      }`}
    >
      {/* The register marks a chart plate is trimmed to. */}
      <span
        aria-hidden="true"
        className={`${TICK} left-2 top-2 border-l border-t border-highlight`}
      />
      <span
        aria-hidden="true"
        className={`${TICK} right-2 top-2 border-r border-t border-highlight`}
      />
      <span
        aria-hidden="true"
        className={`${TICK} bottom-2 left-2 border-b border-l border-highlight`}
      />
      <span
        aria-hidden="true"
        className={`${TICK} bottom-2 right-2 border-b border-r border-highlight`}
      />

      <header className="flex items-center justify-between gap-3 border-b border-hairline pb-4">
        <span className="font-mono text-xs font-medium uppercase tracking-label text-primary [overflow-wrap:anywhere]">
          Live Operations
        </span>
        <span className={`${MICRO} text-faint [overflow-wrap:anywhere]`}>
          CH 16 · 24/7
        </span>
      </header>

      <ul
        className="m-0 flex list-none flex-col gap-0 p-0"
        aria-label="Facilities"
      >
        {FACILITIES.map((f) => (
          <li
            key={f.code}
            className="grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-x-3 gap-y-1 border-b border-hairline py-3 last:border-b-0 xs:grid-cols-[auto_minmax(0,1fr)_auto]"
          >
            <span
              className={`${MICRO} col-start-1 row-start-1 text-highlight [overflow-wrap:anywhere]`}
            >
              {f.code}
            </span>
            <span className="col-start-2 row-start-1 font-condensed text-lg font-semibold uppercase tracking-normal text-primary [overflow-wrap:anywhere]">
              {f.name}
            </span>
            <span
              className={`${MICRO} col-start-2 row-start-2 text-faint [overflow-wrap:anywhere] xs:col-span-2`}
            >
              {f.region}
            </span>
            <span
              className={`${MICRO} col-start-2 row-start-3 tabular-nums tracking-normal text-faint [overflow-wrap:anywhere] xs:col-start-3 xs:row-start-1`}
            >
              {f.coord}
            </span>
          </li>
        ))}
      </ul>

      {/* The first and third rules take the highlight, which is what stops four
          identical marks reading as a border and starts them reading as a
          rhythm. */}
      <dl
        aria-label="At a Glance"
        className="m-0 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-hairline pt-4 xs:gap-x-5 xs:gap-y-4"
      >
        {STATS.map((stat, idx) => (
          <div
            key={stat.label}
            className={`m-0 flex flex-col gap-1 border-l py-1 pl-3 ${
              idx % 2 === 0 ? "border-highlight" : "border-hairline"
            }`}
          >
            <dt className="m-0 font-mono text-3xs font-medium uppercase tracking-label text-faint [overflow-wrap:anywhere]">
              {stat.label}
            </dt>
            <StatValue value={stat.value} suffix={stat.suffix} />
          </div>
        ))}
      </dl>

      <a
        href={telHref}
        className="group grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border border-border-strong bg-console-inset p-4 text-primary no-underline transition-[border-color,color,transform] duration-quick ease-settle hover:border-highlight focus-visible:border-highlight focus-visible:shadow-focus focus-visible:outline-none active:scale-[0.99]"
      >
        <span className={`${MICRO} text-faint [overflow-wrap:anywhere]`}>
          Direct Line
        </span>
        <span className="whitespace-nowrap font-condensed text-xl font-bold uppercase tabular-nums tracking-normal text-primary">
          {PHONE_NUMBER}
        </span>
        <span
          aria-hidden="true"
          className="inline-flex items-center text-faint transition-transform duration-settle ease-settle group-hover:translate-x-1 motion-reduce:transition-none"
        >
          <ArrowRightIcon />
        </span>
      </a>
    </aside>
  );
}

export default OperationsConsole;
