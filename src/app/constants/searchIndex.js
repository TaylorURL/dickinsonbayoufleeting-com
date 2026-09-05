import { SERVICES } from "./services";
import { FACILITIES } from "./facilities";
import { FAQ_ITEMS } from "./faq";
import { SERVICE_AREA_CITIES } from "./serviceArea";
import { PHONE_NUMBER } from "./phoneNumber";

// Everything the site can take somebody to, derived from the same content the
// pages are built from rather than listed a second time. A hand-kept index goes
// stale the first time a service is renamed, and the staleness is invisible
// until somebody searches for the new name and is told there is nothing.
//
// Each entry carries the words it should match on as well as the words it
// shows, so "rate" finds the lease sheet and "map" finds the yards without
// either word being on screen.

const GROUP_ORDER = ["Pages", "Services", "Yards", "Questions", "Coverage"];

const PAGES = [
  {
    id: "page-home",
    group: "Pages",
    code: "P/01",
    label: "Home",
    hint: "The offer, the two yards, and what the lease carries",
    to: "/",
    terms: "home overview lease yard offer",
  },
  {
    id: "page-services",
    group: "Pages",
    code: "P/02",
    label: "Services & Lease Rates",
    hint: "Monthly rates for both yards, and the seven jobs the crew covers",
    to: "/services",
    terms: "services rates price cost monthly lease sheet jobs crew",
  },
  {
    id: "page-about",
    group: "Pages",
    code: "P/03",
    label: "About",
    hint: "Who runs the yards, and how the operation got here",
    to: "/about",
    terms: "about story history crew people values timeline",
  },
  {
    id: "page-contact",
    group: "Pages",
    code: "P/04",
    label: "Contact",
    hint: "Ask for lease terms, book a yard walk, or check a slip",
    to: "/contact",
    terms: "contact email form phone call enquiry inquiry quote visit",
  },
  {
    id: "page-terms",
    group: "Pages",
    code: "P/05",
    label: "Terms of Use",
    hint: "What using this site commits either of us to",
    to: "/terms",
    terms: "terms legal conditions use",
  },
  {
    id: "page-privacy",
    group: "Pages",
    code: "P/06",
    label: "Privacy Policy",
    hint: "What the forms collect and how long it is kept",
    to: "/privacy",
    terms: "privacy data gdpr policy cookies",
  },
];

const money = (n) => `$${n.toLocaleString()}`;

export const SEARCH_ENTRIES = [
  ...PAGES,

  ...SERVICES.map((s) => ({
    id: `service-${s.id}`,
    group: "Services",
    code: s.code,
    label: s.name,
    hint: s.summary,
    to: `/services#${s.id}`,
    terms: `${s.name} ${s.summary} ${s.meta}`,
  })),

  ...FACILITIES.map((f) => ({
    id: `yard-${f.id}`,
    group: "Yards",
    code: f.code,
    label: `${f.shortName} · ${f.acreage} at ${money(f.price)} a month`,
    hint: `${f.waterway} · ${f.address}`,
    to: `/contact#${f.id}`,
    terms: `${f.shortName} ${f.name} ${f.address} ${f.waterway} ${f.reach} ${f.acreage} ${f.price} rate lease`,
  })),

  ...FAQ_ITEMS.map((item, i) => ({
    id: `faq-${i}`,
    group: "Questions",
    code: `Q/${String(i + 1).padStart(2, "0")}`,
    label: item.q,
    hint: item.a,
    to: "/services#faq",
    terms: `${item.q} ${item.a}`,
  })),

  ...SERVICE_AREA_CITIES.map((city, i) => ({
    id: `city-${i}`,
    group: "Coverage",
    code: `C/${String(i + 1).padStart(2, "0")}`,
    label: city.name,
    hint: `${city.county} · within the reach both yards work`,
    to: "/about#service-area",
    terms: `${city.name} ${city.county} coverage area serve`,
  })),

  {
    id: "action-call",
    group: "Pages",
    code: "TEL",
    label: `Call the Yard · ${PHONE_NUMBER}`,
    hint: "Answered through the working day, on call the rest of the time",
    href: `tel:1${PHONE_NUMBER.replace(/[^0-9]/g, "")}`,
    terms: `call phone ring dial number ${PHONE_NUMBER}`,
  },
];

// Matching is on whole words in order rather than on a fuzzy distance. A yard
// this size has a hundred entries, not ten thousand, and a reader typing "free"
// wants Freeport rather than the four things a fuzzy match would put above it.
export function searchSite(query) {
  const needle = query.trim().toLowerCase();
  if (!needle) return [];
  const words = needle.split(/\s+/);

  const scored = [];
  for (const entry of SEARCH_ENTRIES) {
    const label = entry.label.toLowerCase();
    const hay = `${label} ${entry.code} ${entry.terms}`.toLowerCase();
    if (!words.every((w) => hay.includes(w))) continue;

    // A hit on the label outranks a hit on the terms behind it, and a label
    // that starts with what was typed outranks one that merely contains it.
    let rank = 3;
    if (label.includes(needle)) rank = 2;
    if (label.startsWith(needle)) rank = 1;
    scored.push({ entry, rank });
  }

  scored.sort((a, b) => {
    if (a.rank !== b.rank) return a.rank - b.rank;
    const g =
      GROUP_ORDER.indexOf(a.entry.group) - GROUP_ORDER.indexOf(b.entry.group);
    if (g !== 0) return g;
    return a.entry.label.localeCompare(b.entry.label);
  });

  return scored.slice(0, 12).map((s) => s.entry);
}

// What the palette shows before anything is typed: the places most visitors are
// looking for, rather than an empty box that gives no clue what it searches.
export const SEARCH_DEFAULTS = [
  "page-services",
  "yard-dickinson",
  "yard-freeport",
  "page-contact",
  "action-call",
]
  .map((id) => SEARCH_ENTRIES.find((e) => e.id === id))
  .filter(Boolean);
