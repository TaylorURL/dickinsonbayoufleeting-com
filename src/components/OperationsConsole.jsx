import "./styles/OperationsConsole.css";
import { useReveal } from "../app/hooks/useReveal";
import { useCountUp } from "../app/hooks/useCountUp";
import { PHONE_NUMBER } from "../app/constants/phoneNumber";
import { ArrowRightIcon } from "./Icons";

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

function StatValue({ value, suffix }) {
  const { ref, display } = useCountUp(value, { duration: COUNT_UP_MS });
  return (
    <dd className="opsConsole__statValue tabular" ref={ref}>
      {display}
      {suffix ? <span className="opsConsole__statSuffix">{suffix}</span> : null}
    </dd>
  );
}

// The panel beside the headline: where the yards are, how big they are, and
// the number that reaches a person.
function OperationsConsole() {
  const rootRef = useReveal();
  const telHref = `tel:1${PHONE_NUMBER.replace(/[^0-9]/g, "")}`;

  return (
    <aside
      className="opsConsole hullPlate reveal-on-scroll"
      aria-label="Operations Console"
      ref={rootRef}
    >
      <span className="opsConsole__tickTL" aria-hidden="true" />
      <span className="opsConsole__tickTR" aria-hidden="true" />
      <span className="opsConsole__tickBL" aria-hidden="true" />
      <span className="opsConsole__tickBR" aria-hidden="true" />

      <header className="opsConsole__header">
        <span className="opsConsole__tag mono">
          <span className="signalDot" aria-hidden="true" />
          Live Operations
        </span>
        <span className="opsConsole__meta mono">CH 16 · 24/7</span>
      </header>

      <ul className="opsConsole__facilities" aria-label="Facilities">
        {FACILITIES.map((f) => (
          <li key={f.code} className="opsConsole__facility">
            <span className="opsConsole__facilityCode mono">{f.code}</span>
            <span className="opsConsole__facilityName">{f.name}</span>
            <span className="opsConsole__facilityRegion mono">{f.region}</span>
            <span className="opsConsole__facilityCoord mono tabular">
              {f.coord}
            </span>
          </li>
        ))}
      </ul>

      <dl className="opsConsole__stats" aria-label="At a Glance">
        {STATS.map((stat) => (
          <div key={stat.label} className="opsConsole__stat">
            <dt className="opsConsole__statLabel mono">{stat.label}</dt>
            <StatValue value={stat.value} suffix={stat.suffix} />
          </div>
        ))}
      </dl>

      <a className="opsConsole__directLine" href={telHref}>
        <span className="opsConsole__directLabel mono">Direct Line</span>
        <span className="opsConsole__directNumber tabular">{PHONE_NUMBER}</span>
        <span className="opsConsole__directArrow" aria-hidden="true">
          <ArrowRightIcon />
        </span>
      </a>
    </aside>
  );
}

export default OperationsConsole;
