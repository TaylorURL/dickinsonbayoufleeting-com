/**
 * The company's clock.
 *
 * The fleet is on Dickinson Bayou and the line naming the company belongs to
 * its year. Read on the visitor's own clock, that line turns the year over
 * hours before the company does.
 */
const ZONE = "America/Chicago";

/** The year here. */
export function currentYear() {
  return Number(
    new Intl.DateTimeFormat("en-CA", {
      timeZone: ZONE,
      year: "numeric",
    }).format(new Date()),
  );
}
