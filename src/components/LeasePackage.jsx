import { FACILITIES } from "../app/constants/facilities";
import Button from "./ui/Button";
import { Container, MICRO_SM, Section } from "./ui/Layout";
import { Reveal } from "./ui/Reveal";

// Every row the sheet states, in the order somebody comparing two yards asks
// for them. Reading a value off a facility rather than storing it twice is what
// keeps the two columns describing the same six things.
const ROWS = [
  { label: "Waterway", read: (f) => f.waterway },
  { label: "Reaches", read: (f) => f.reach },
  { label: "Yard", read: (f) => f.acreage },
  { label: "Address", read: (f) => f.address },
  { label: "Position", read: (f) => f.coord },
];

// A rate sheet: both yards in view at once, in columns, the way a quote would
// put them. The home page has the chart that walks a reader to one yard; by the
// time somebody is on this page they are comparing, and a control that shows
// one at a time is in the way of that.
function LeasePackage({ surface = "gray" }) {
  return (
    <Section surface={surface} id="rates" aria-label="Lease rates">
      <Container>
        <Reveal className="max-w-head">
          <p className={`${MICRO_SM} text-faint`}>Dock leasing</p>
          <h2 className="m-0 mt-5 max-w-title text-h2 text-primary">
            Five acres, either coast.
          </h2>
          <p className="m-0 mt-5 max-w-prose text-lead text-secondary">
            Gated frontage, room to lay down spuds and deck barges, and power
            drops on request. Both rates are monthly and both are what we quote.
          </p>
        </Reveal>

        {/* Wide enough to need its own scroll on a handset, which is the honest
            answer for a comparison table: a table that reflows into stacked
            cards has stopped being a comparison. */}
        <Reveal className="mt-12 -mx-gutter overflow-x-auto px-gutter">
          <table className="w-full min-w-[620px] border-separate border-spacing-0 text-left">
            <caption className="sr-only">
              Lease rates and particulars for the Dickinson and Freeport yards
            </caption>
            <thead>
              <tr>
                <th
                  scope="col"
                  className="w-[var(--col-code)] border-b border-border-strong pb-4 pr-6 align-bottom"
                >
                  <span className="sr-only">Particular</span>
                </th>
                {FACILITIES.map((f) => (
                  <th
                    key={f.id}
                    scope="col"
                    className="border-b border-border-strong pb-4 pr-6 align-bottom last:pr-0"
                  >
                    <span className={`${MICRO_SM} block text-faint`}>
                      {f.code}
                    </span>
                    <span className="mt-2 block font-condensed text-h4 font-bold uppercase leading-none text-primary">
                      {f.shortName}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr key={row.label}>
                  <th
                    scope="row"
                    className={`${MICRO_SM} border-b border-hairline py-5 pr-6 align-top font-medium text-faint`}
                  >
                    {row.label}
                  </th>
                  {FACILITIES.map((f) => (
                    <td
                      key={f.id}
                      className="border-b border-hairline py-5 pr-6 align-top text-md tabular-nums text-secondary last:pr-0"
                    >
                      {row.read(f)}
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <th
                  scope="row"
                  className={`${MICRO_SM} border-b border-border-strong py-6 pr-6 align-bottom font-medium text-faint`}
                >
                  Monthly
                </th>
                {FACILITIES.map((f) => (
                  <td
                    key={f.id}
                    className="border-b border-border-strong py-6 pr-6 align-bottom last:pr-0"
                  >
                    <span className="block font-condensed text-figure-sm font-bold leading-none tabular-nums text-primary">
                      {`$${f.price.toLocaleString()}`}
                    </span>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </Reveal>

        <div className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-8 md:grid-cols-2">
          {FACILITIES.map((f) => (
            <Reveal key={f.id} className="min-w-0">
              <p className={`${MICRO_SM} text-faint`}>
                {f.shortName} · what the lease carries
              </p>
              <ul className="m-0 mt-4 flex list-none flex-col gap-2 p-0">
                {f.included.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-sm text-secondary before:mt-[0.55em] before:h-px before:w-4 before:shrink-0 before:bg-border-strong before:content-['']"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-11">
          <Button to="/contact">Ask About a Lease</Button>
        </Reveal>
      </Container>
    </Section>
  );
}

export default LeasePackage;
