import { FACILITIES, FACILITY_SPEC_ROWS } from "../../app/content/facilities";
import Button from "../ui/Button";
import { CODE, Container, MICRO, Section } from "../ui/Layout";
import { Reveal, Stagger, staggerChild } from "../ui/Reveal";
import LeaseCard, { IncludedItem, rate } from "./LeaseCard";

// The rate sheet: both yards in one table, in the columns a quote would put
// them in. By the time somebody is on this page they are comparing, and five
// particulars restated twice in two cards is not a comparison.
//
// A phone is the exception. Two value columns inside a 350px measure stop being
// readable as columns, so below 900 the table gives way to the same pair of
// lease cards the home page carries.

// The particulars read a character at a time. Same distinction the lease card
// draws, and it lives in both places for the same reason: the spec rows do not
// carry a face of their own yet.
const TABULAR = new Set(["Address", "Position"]);

function LeasePackage({ surface = "light" }) {
  return (
    <Section surface={surface} id="rates" aria-label="Lease rates">
      <Container className="flex flex-col gap-7 md:gap-9">
        <Reveal className="flex max-w-head flex-col gap-4 md:gap-5">
          <h2 className="m-0 max-w-[900px] text-h2-mobile text-primary md:text-h2">
            Five acres, either yard.
          </h2>
          <p className="m-0 max-w-plate-lede text-lead-mobile text-secondary md:text-lead">
            Gated frontage, room to lay down spuds and deck barges, and power
            drops on request. Both rates are monthly and both are what we quote.
          </p>
        </Reveal>

        <Stagger className="flex flex-col md:hidden">
          {FACILITIES.map((facility, i) => (
            <div key={facility.id} className={`min-w-0 ${staggerChild(i)}`}>
              <LeaseCard facility={facility} />
            </div>
          ))}
        </Stagger>

        <Reveal className="hidden md:block">
          <table className="w-full border-separate border-spacing-0 text-left">
            <caption className="sr-only">
              Lease rates and particulars for the Dickinson and Freeport yards
            </caption>
            <thead>
              <tr>
                <th
                  scope="col"
                  className={`${MICRO} w-[200px] border-b border-border-strong pb-4 pr-6 align-bottom font-semibold text-faint`}
                >
                  Particular
                </th>
                {FACILITIES.map((facility) => (
                  <th
                    key={facility.id}
                    scope="col"
                    className="border-b border-border-strong pb-4 pr-6 align-bottom last:pr-0"
                  >
                    <span className={`${CODE} block text-faint`}>
                      {facility.code}
                    </span>
                    <span className="mt-2 block font-condensed text-h4 uppercase text-primary">
                      {facility.shortName}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FACILITY_SPEC_ROWS.map((row) => (
                <tr key={row.label}>
                  <th
                    scope="row"
                    className={`${MICRO} border-b border-border py-5 pr-6 align-top font-semibold text-faint`}
                  >
                    {row.label}
                  </th>
                  {FACILITIES.map((facility) => (
                    <td
                      key={facility.id}
                      className={`border-b border-border py-5 pr-6 align-top text-secondary last:pr-0 ${
                        TABULAR.has(row.label)
                          ? "font-mono text-data"
                          : "text-small"
                      }`}
                    >
                      {row.read(facility)}
                      {row.note ? (
                        <span className="ml-2 font-body text-small text-muted">
                          {row.note}
                        </span>
                      ) : null}
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <th
                  scope="row"
                  className={`${MICRO} border-b border-border-strong py-6 pr-6 align-bottom font-semibold text-faint`}
                >
                  Monthly
                </th>
                {FACILITIES.map((facility) => (
                  <td
                    key={facility.id}
                    className="border-b border-border-strong py-6 pr-6 align-bottom font-mono text-figure tabular-nums text-primary last:pr-0"
                  >
                    {rate(facility.price)}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </Reveal>

        {/* What each term carries, under the column it belongs to, so the
            table above and the lists below are read as one sheet. */}
        <div className="hidden gap-x-10 gap-y-7 md:grid md:grid-cols-2">
          {FACILITIES.map((facility) => (
            <Reveal key={facility.id} className="flex min-w-0 flex-col gap-4">
              <p className={`${MICRO} m-0 text-faint`}>
                {facility.shortName} · what the lease carries
              </p>
              <ul className="m-0 flex list-none flex-col gap-4 p-0">
                {facility.included.map((item) => (
                  <IncludedItem key={item}>{item}</IncludedItem>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <Button variant="ghost" to="/contact" className="w-full xs:w-auto">
            Ask About a Lease
          </Button>
        </Reveal>
      </Container>
    </Section>
  );
}

export default LeasePackage;
