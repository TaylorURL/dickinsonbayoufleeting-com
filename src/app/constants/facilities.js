import { PHONE_NUMBER } from "./phoneNumber";

// The two yards, and every reading the site takes of them. The chart, the
// spec sheet, the hero console and the footer all measure from this, so a
// yard's rate or its position is stated once.
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
      "Dedicated barge slip & marine vessel access",
      "On-site fleeting & marine crew",
      "Galveston Bay & Houston Ship Channel access",
      "Coastal upper Texas Gulf Coast location",
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
      "Dedicated barge slip & marine vessel access",
      "On-site fleeting & marine crew",
      "Direct Gulf Intracoastal Waterway access",
      "Coastal Texas Gulf Coast marine terminal",
    ],
  },
];
