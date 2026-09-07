import { FACILITIES } from "./facilities";

// Routes and the section anchors inside them, not the Home page's own in-page
// anchors, which the scroll rail owns separately.
//
// An entry with `groups` opens a panel. The two that do are the parts of the
// site with real depth behind one word: seven services and two yards, none of
// which a visitor could reach without first landing on the page that lists
// them.
//
// The groups are the panel's structure rather than a decoration on it. A
// visitor reads three headings and knows which column is theirs before reading
// a single destination, which a flat column of seven cannot do. The headings
// are where the work goes, so none of them holds a single item: a category of
// one is a grouping that was invented rather than found.
//
// The hints here are written for the panel, where a destination gets one line.
// The full summaries belong on the services page, which has a column for them.
export const NAV_LINKS = [
  {
    label: "Services",
    to: "/services",
    groups: [
      {
        heading: "On the water",
        items: [
          {
            label: "Long-Term Barge Fleeting",
            to: "/services#fleeting",
            hint: "A slip held for your barges between loads.",
          },
          {
            label: "Barge Shifting & Handling",
            to: "/services#shifting",
            hint: "Moves between slips, docks and terminals.",
          },
          {
            label: "Vessel Mooring & Lay Berth",
            to: "/services#mooring",
            hint: "Fendered, lit mooring for boats between jobs.",
          },
        ],
      },
      {
        heading: "Alongside the dock",
        items: [
          {
            label: "Barge Cleaning Coordination",
            to: "/services#cleaning",
            hint: "We book the contractor and host the job.",
          },
          {
            label: "Repair & Survey Coordination",
            to: "/services#repair",
            hint: "Slip, gangway and laydown room for vendors.",
          },
        ],
      },
      {
        heading: "Shore side",
        items: [
          {
            label: "Marine Logistics Support",
            to: "/services#logistics",
            hint: "Line handling, escort and crew changes.",
          },
          {
            label: "Waterfront Dock Leasing",
            to: "/services#leasing",
            hint: "Five gated acres on a long-term lease.",
          },
        ],
      },
    ],
    footLabel: "All Services",
    footTo: "/services",
  },
  {
    label: "Facilities",
    to: "/contact#location",
    groups: [
      {
        heading: "The yards",
        items: FACILITIES.map((facility) => ({
          label: facility.shortName,
          to: `/contact#${facility.id}`,
          hint: facility.waterway,
        })),
      },
      {
        heading: "Planning a lease",
        items: [
          {
            label: "Lease Rates",
            to: "/services#rates",
            hint: "What each yard costs and what the term carries.",
          },
          {
            label: "Coverage Area",
            to: "/about#service-area",
            hint: "The bay, the Ship Channel and the GIWW.",
          },
        ],
      },
    ],
    footLabel: "Visit the Yards",
    footTo: "/contact#location",
  },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];
