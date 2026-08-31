import { SERVICES } from "./services";
import { FACILITIES } from "./facilities";

// Routes and the section anchors inside them, not the Home page's own in-page
// anchors, which the scroll rail owns separately.
//
// An entry with `items` opens a panel. The two that do are the parts of the
// site with real depth behind one word: seven services and two yards, none of
// which a visitor could reach without first landing on the page that lists
// them.
export const NAV_LINKS = [
  {
    label: "Services",
    to: "/services",
    items: SERVICES.map((service) => ({
      label: service.name,
      to: `/services#${service.id}`,
      hint: service.summary,
    })),
    footLabel: "All Services",
    footTo: "/services",
  },
  {
    label: "Facilities",
    to: "/contact#location",
    items: [
      ...FACILITIES.map((facility) => ({
        label: facility.shortName,
        to: `/contact#${facility.id}`,
        hint: facility.region,
      })),
      {
        label: "Coverage Area",
        to: "/about#service-area",
        hint: "Galveston Bay, the Houston Ship Channel and the GIWW.",
      },
      {
        label: "Lease Rates",
        to: "/services#rates",
        hint: "What a slip or a yard costs, and what the term includes.",
      },
    ],
    footLabel: "Visit the Yards",
    footTo: "/contact#location",
  },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];
