// One service, in the two readings the site takes of it. The summary row names
// the job and says what it is; the detail row adds the paragraph and the
// cadence. They are one component because the home page carrying a second,
// looser list of the same seven jobs is what made the two pages read as two
// different sites.
//
// Both readings stack on a phone: the code and the cadence share the top line,
// the name sits under them, and the columns of the wide row become the order of
// the stack. The wrappers that hold that stack together dissolve at the break
// with `contents`, so no field is written twice.

const ROW =
  "flex flex-col gap-2 py-5 md:flex-row md:items-start md:gap-6 md:py-6";

// The code and the cadence are one line on a phone and two columns at either
// end of the row once it opens out.
const TOP_LINE = "flex items-center justify-between gap-4 md:contents";

function ServiceRow({ service, detailed = false, className = "" }) {
  return (
    <li
      id={service.id}
      className={`scroll-mt-anchor border-b border-border ${className}`.trim()}
    >
      <div className={ROW}>
        <div className={TOP_LINE}>
          <span
            className={`font-mono text-code uppercase md:w-[56px] md:flex-none ${
              detailed ? "text-faint" : "text-muted"
            }`}
          >
            {service.code}
          </span>
          {/* The cadence has no column of its own on the summary row, so on a
              wide screen it is simply not drawn there. */}
          <span
            className={`font-body text-micro text-muted ${
              detailed
                ? "md:order-last md:w-[120px] md:flex-none md:text-right"
                : "md:hidden"
            }`}
          >
            {service.meta}
          </span>
        </div>

        <div
          className={`flex min-w-0 flex-col gap-2 ${
            detailed ? "md:contents" : "md:min-w-0 md:flex-1"
          }`}
        >
          <h3
            className={`m-0 text-h4 text-primary ${
              detailed ? "md:w-[240px] md:flex-none md:text-h5" : "md:text-h3"
            }`}
          >
            {service.name}
          </h3>
          <p
            className={`m-0 text-small ${
              detailed
                ? "text-secondary md:w-[300px] md:flex-none"
                : "text-faint md:max-w-[560px]"
            }`}
          >
            {service.summary}
          </p>
          {detailed ? (
            <p className="m-0 text-small text-faint md:min-w-0 md:flex-1">
              {service.detail}
            </p>
          ) : null}
        </div>
      </div>
    </li>
  );
}

export default ServiceRow;
