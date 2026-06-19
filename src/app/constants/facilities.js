import { PHONE_NUMBER } from "./phoneNumber";

export const FACILITIES = [
  {
    id: "sanleon",
    name: "San Leon Facility",
    shortName: "San Leon",
    address: "2629 Avenue R, Dickinson, TX 77539",
    region: "Galveston Bay · Houston Ship Channel",
    coords: { lat: 29.471936, lng: -94.962547 },
    phone: PHONE_NUMBER,
    acreage: "5 Acres",
    price: 4100,
    features: [
      "Dedicated barge slip access",
      "On-site fleeting crew",
      "Galveston Bay & Houston Ship Channel access",
    ],
  },
  {
    id: "freeport",
    name: "Freeport Facility",
    shortName: "Freeport",
    address: "906 Marlin Ln, Freeport, TX 77541",
    region: "Gulf Intracoastal Waterway · Brazoria County",
    coords: { lat: 28.968043, lng: -95.288293 },
    phone: PHONE_NUMBER,
    acreage: "5 Acres",
    price: 4800,
    features: [
      "Dedicated barge slip access",
      "On-site fleeting crew",
      "Direct Intracoastal Waterway access",
    ],
  },
];
