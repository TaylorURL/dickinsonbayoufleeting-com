import { FACILITY_SPEC_ROWS } from "../../app/content/facilities";
import Button from "../ui/Button";
import { CODE, MICRO } from "../ui/Layout";

// One yard, stated the way a quote states it: what it is called, what it costs
// a month, the five particulars, and what the term carries. The home page puts
// two of these beside the chart and the rates band falls back to them on a
// phone, where a two-yard comparison table has stopped being a comparison.

// The particulars a reader compares a character at a time rather than a word at
// a time. Those are set in the mono face; the rest is running text. The
// distinction belongs beside the rows themselves, but FACILITY_SPEC_ROWS does
// not carry a face yet, so it is read off the label here.
const TABULAR = new Set(["Address", "Position"]);

export function rate(price) {
  return `$${price.toLocaleString()}`;
}

// A particular and its reading, on one rule. The label column is fixed so the
// values of two cards standing one above the other line up.
export function SpecRow({ label, value, note, labelWidth = "w-[120px]" }) {
  return (
    <div className="flex items-start gap-6 border-b border-border py-3">
      <dt className={`${MICRO} ${labelWidth} flex-none text-faint`}>{label}</dt>
      <dd
        className={`m-0 min-w-0 flex-1 ${
          TABULAR.has(label) ? "font-mono text-data" : "text-small"
        } text-secondary`}
      >
        {value}
        {note ? (
          <span className="ml-2 font-body text-small text-muted">{note}</span>
        ) : null}
      </dd>
    </div>
  );
}

// A line of what the lease carries, with the short rule that files it as an
// entry rather than a sentence.
export function IncludedItem({ children }) {
  return (
    <li className="flex items-start gap-3 text-small text-secondary">
      <span
        aria-hidden="true"
        className="mt-[7px] h-px w-4 flex-none bg-border-strong"
      />
      {children}
    </li>
  );
}

function LeaseCard({ facility }) {
  // Four lines read down two columns rather than across two rows, so a reader
  // scanning one column is reading them in the order they were written.
  const half = Math.ceil(facility.included.length / 2);
  const columns = [
    facility.included.slice(0, half),
    facility.included.slice(half),
  ].filter((column) => column.length);

  return (
    <div className="flex flex-col gap-6 border-t border-border-strong py-7">
      <div className="flex items-end gap-6">
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <p className={`${CODE} m-0 text-faint`}>{facility.code}</p>
          <h3 className="m-0 text-h4 text-primary">{facility.shortName}</h3>
        </div>
        <div className="flex w-[180px] flex-none flex-col items-end gap-1 text-right">
          <p className="m-0 font-mono text-figure tabular-nums text-primary">
            {rate(facility.price)}
          </p>
          <p className={`${MICRO} m-0 text-muted`}>per month</p>
        </div>
      </div>

      <dl className="m-0">
        {FACILITY_SPEC_ROWS.map((row) => (
          <SpecRow
            key={row.label}
            label={row.label}
            value={row.read(facility)}
            note={row.note}
          />
        ))}
      </dl>

      <div className="flex flex-col gap-3">
        <p className={`${MICRO} m-0 text-faint`}>
          {facility.shortName} · what the lease carries
        </p>
        <div className="flex flex-wrap gap-x-6 gap-y-3">
          {columns.map((column) => (
            <ul
              key={column[0]}
              className="m-0 flex min-w-[300px] flex-1 list-none flex-col gap-3 p-0"
            >
              {column.map((item) => (
                <IncludedItem key={item}>{item}</IncludedItem>
              ))}
            </ul>
          ))}
        </div>
      </div>

      <Button
        variant="ghost"
        size="sm"
        to="/contact"
        className="w-full xs:w-auto xs:self-start"
      >
        Ask About {facility.shortName}
      </Button>
    </div>
  );
}

export default LeaseCard;
