export const PHONE_NUMBER = "713-859-0169";

// Every telephone link on the site is built here. The dialler wants digits and
// the office number is written for reading, so the two forms are kept apart:
// what a reader sees is PHONE_NUMBER, what a handset dials is this. Both yards
// answer on the same line, and the facility numbers in the footer take the
// same treatment, so the number is a parameter rather than a constant read
// from above.
export function telHref(phone = PHONE_NUMBER) {
  return `tel:1${String(phone).replace(/[^0-9]/g, "")}`;
}
