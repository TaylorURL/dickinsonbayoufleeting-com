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

// The two map addresses, built beside the telephone one for the same reason:
// a link out to a yard is written in the footer, on the contact cards and in
// the structured data the build stamps, and three spellings of the same query
// is how one of them stops resolving. The click tracker matches on the shape
// of the first of these, so the host and the path are part of the contract
// rather than incidental.
export function buildMapsHref(address) {
  return `https://maps.google.com/?q=${encodeURIComponent(address)}`;
}

export function buildEmbedSrc(address) {
  return `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;
}
