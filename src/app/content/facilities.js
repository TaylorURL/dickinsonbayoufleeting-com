import { PHONE_NUMBER } from "./phoneNumber";

// The two yards, and every reading the site takes of them. The chart, the
// spec sheet, the hero console, the footer and the structured data the build
// stamps into the document all measure from this, so a yard's rate, its
// address or its position is stated once.
//
// Three of what a lease carries is the same at both yards, and it is written
// the same way twice rather than reworded to look like two different offers.
// The fourth line is the one that differs, because the reach is what actually
// decides which yard an operator wants.

// A street address is one line to a reader and four fields to a search engine,
// so the parts are held and the line is assembled from them. Written out twice
// instead, the page and the structured data end up at two addresses.
function addressLine({ street, city, state, postalCode }) {
  return `${street}, ${city}, ${state} ${postalCode}`;
}

// What a reader sees, worked out from the same pair the structured data
// carries, so the printed position and the position Google reads cannot
// disagree. Both yards are north of the equator and west of the meridian, so
// the hemispheres are written rather than held.
function positionLine(lat, lng) {
  return `${lat.toFixed(3)}° N · ${Math.abs(lng).toFixed(3)}° W`;
}

const YARDS = [
  {
    id: "dickinson",
    code: "F-01",
    name: "Dickinson Facility",
    shortName: "Dickinson",
    street: "2629 Avenue R",
    city: "Dickinson",
    state: "TX",
    postalCode: "77539",
    region: "Galveston Bay · Houston Ship Channel · Coastal Texas",
    waterway: "Galveston Bay",
    reach: "Houston Ship Channel, then the bay",
    lat: 29.471936,
    lng: -94.962547,
    acreage: "5 Acres",
    acres: 5,
    price: 4100,
    included: [
      "Five gated acres of bulkhead frontage",
      "A barge slip held for the lease",
      "Shore crew on site, and a watched gate overnight",
      "Out to the Houston Ship Channel, then the bay",
    ],
  },
  {
    id: "freeport",
    code: "F-02",
    name: "Freeport Facility",
    shortName: "Freeport",
    street: "906 Marlin Ln",
    city: "Freeport",
    state: "TX",
    postalCode: "77541",
    region: "Gulf Intracoastal Waterway · Coastal Brazoria County",
    waterway: "Gulf Intracoastal Waterway",
    reach: "The GIWW, and the Freeport ship channel",
    lat: 28.967116,
    lng: -95.289374,
    acreage: "5 Acres",
    acres: 5,
    price: 4800,
    included: [
      "Five gated acres of bulkhead frontage",
      "A barge slip held for the lease",
      "Shore crew on site, and a watched gate overnight",
      "Straight onto the GIWW and the Freeport ship channel",
    ],
  },
];

// Both yards answer on the office line, so the number is attached here rather
// than typed into each record.
export const FACILITIES = YARDS.map((yard) => ({
  ...yard,
  phone: PHONE_NUMBER,
  address: addressLine(yard),
  coord: positionLine(yard.lat, yard.lng),
}));

// The particulars a spec sheet states, in the order somebody comparing two
// yards asks for them, each row reading its value off the record rather than
// holding a second copy of it. The chart's sheet and the rate table are both
// set from this, so the two cannot end up describing different things. The
// rate is not among them: each of the two states it in a shape of its own.
export const FACILITY_SPEC_ROWS = [
  { label: "Waterway", read: (f) => f.waterway },
  { label: "Reaches", read: (f) => f.reach },
  { label: "Address", read: (f) => f.address },
  { label: "Position", read: (f) => f.coord, note: "approximate" },
  { label: "Yard", read: (f) => f.acreage, note: "waterfront" },
];
