import { PHONE_NUMBER } from "./phoneNumber";

// The two yards, and every reading the site takes of them. The chart, the
// spec sheet, the hero console and the footer all measure from this, so a
// yard's rate or its position is stated once.
//
// Three of what a lease carries is the same at both yards, and it is written
// the same way twice rather than reworded to look like two different offers.
// The fourth line is the one that differs, because the reach is what actually
// decides which yard an operator wants.
export const FACILITIES = [
  {
    id: "dickinson",
    code: "F-01",
    name: "Dickinson Facility",
    shortName: "Dickinson",
    address: "2629 Avenue R, Dickinson, TX 77539",
    region: "Galveston Bay · Houston Ship Channel · Coastal Texas",
    waterway: "Galveston Bay",
    reach: "Houston Ship Channel, then the bay",
    coord: "29.479° N · 94.918° W",
    phone: PHONE_NUMBER,
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
    address: "906 Marlin Ln, Freeport, TX 77541",
    region: "Gulf Intracoastal Waterway · Coastal Brazoria County",
    waterway: "Gulf Intracoastal Waterway",
    reach: "The GIWW, and the Freeport ship channel",
    coord: "28.948° N · 95.341° W",
    phone: PHONE_NUMBER,
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
