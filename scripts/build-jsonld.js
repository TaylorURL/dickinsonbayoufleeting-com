#!/usr/bin/env node
/**
 * Writes the structured facts into the served document.
 *
 * Two things in the head and the body describe where the yards are and what
 * they cost: the geo meta pair, and the Schema.org graph. Both used to be
 * typed into public/index.html, which is a file nobody opens to change a rate,
 * and all three sets of coordinates on this site had drifted apart - the pair
 * a reader was shown, the pair the head declared and the pair the graph
 * carried were four to five kilometres from each other.
 *
 * So the document carries two markers and this fills them from the same
 * facility records the pages render. The prose in the graph - the
 * descriptions, the towns and waters each yard serves - stays here, because it
 * is written for a search engine and is not on any page. Everything a reader
 * can also see is read rather than restated.
 *
 * It runs before the prerender, so the document every route is stamped from
 * already carries both.
 */
const fs = require("fs");
const path = require("path");
const esbuild = require("esbuild");

const ROOT = path.join(__dirname, "..");
const BUILD = path.join(ROOT, "build");
const INDEX = path.join(BUILD, "index.html");
const SITE = "https://dickinsonbayoufleeting.com";

// The document is minified before this runs, and the minifier takes every
// comment with it, so the places this writes into are real tags carrying a
// placeholder rather than markers. Each is found by what it is rather than by
// where it sits, so the minifier is free to order attributes as it likes.
const GEO_TAGS = ["geo.position", "ICBM"];
const GRAPH_TAG =
  /<script\b[^>]*type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/i;

function metaTag(name) {
  return new RegExp(`<meta\\b[^>]*\\bname="${name}"[^>]*>`, "i");
}

function fail(why) {
  console.error(`jsonld: ${why}`);
  process.exit(1);
}

// The content modules are the application's own ES modules, so Node cannot
// require them as they stand. esbuild bundles the handful this needs, which is
// the same trick the prerender uses and the only alternative to a second copy
// of the facility table living in this script.
async function content() {
  const outfile = path.join(BUILD, ".jsonld-content.js");
  await esbuild.build({
    stdin: {
      contents: [
        'export { FACILITIES } from "../src/app/content/facilities";',
        'export { PHONE_NUMBER, buildMapsHref } from "../src/app/content/phoneNumber";',
        'export { HOURS } from "../src/app/content/hours";',
      ].join("\n"),
      resolveDir: __dirname,
      loader: "js",
    },
    outfile,
    bundle: true,
    platform: "node",
    format: "cjs",
    target: "node22",
    logLevel: "silent",
  });
  try {
    return require(outfile);
  } finally {
    fs.rmSync(outfile, { force: true });
  }
}

const city = (name) => ({ "@type": "City", name });
const area = (name) => ({ "@type": "AdministrativeArea", name });
const place = (name) => ({ "@type": "Place", name });

const SHIP_CHANNEL = place("Houston Ship Channel");
const GALVESTON_BAY = place("Galveston Bay");
const GIWW = place("Gulf Intracoastal Waterway");

const COAST = [
  city("Dickinson, Texas"),
  city("Texas City, Texas"),
  city("Houston, Texas"),
  city("Pasadena, Texas"),
  city("League City, Texas"),
  city("La Marque, Texas"),
  city("Kemah, Texas"),
  city("Bacliff, Texas"),
  city("Seabrook, Texas"),
  city("Galveston, Texas"),
  city("Freeport, Texas"),
];

const LOGO = `${SITE}/images/DBF-Logo-White.png`;
const SERVICE_TYPE =
  "Coastal barge fleeting, marine services and waterfront dock leasing";

// What each yard says to a search engine and nowhere else: the towns and
// waters it is the near one for, and the words a listing is written in.
const YARD_COPY = {
  dickinson: {
    description:
      "Coastal barge fleeting, marine services, vessel mooring and waterfront dock leasing on Galveston Bay near Dickinson, Texas City and the greater Houston area, with direct access to the Houston Ship Channel and upper Texas Gulf Coast waterways.",
    offer:
      "Long-term Coastal Barge Fleeting, Marine Services & Dock Lease at Dickinson (Galveston Bay)",
    catalogue:
      "Dickinson Facility: Galveston Bay coastal barge fleeting, marine services & 5-acre dock lease",
    areaServed: [
      city("Dickinson, Texas"),
      city("Texas City, Texas"),
      city("Houston, Texas"),
      city("League City, Texas"),
      city("La Marque, Texas"),
      city("Kemah, Texas"),
      city("Bacliff, Texas"),
      city("Seabrook, Texas"),
      city("Galveston, Texas"),
      SHIP_CHANNEL,
      GALVESTON_BAY,
      GIWW,
    ],
  },
  freeport: {
    description:
      "Coastal barge fleeting, marine services, mooring and waterfront dock leasing on the upper Texas Gulf Coast near Freeport and the Gulf Intracoastal Waterway, with direct access to the Texas coastal waterways.",
    offer:
      "Long-term Coastal Barge Fleeting, Marine Services & Dock Lease at Freeport (Intracoastal Waterway)",
    catalogue:
      "Freeport Facility: Intracoastal Waterway coastal barge fleeting, marine services & 5-acre dock lease",
    areaServed: [city("Freeport, Texas"), area("Brazoria County, Texas"), GIWW],
  },
};

// The site prints two sets of hours and the graph carries both. The docks are
// worked around the clock, so each yard opens on the shore crew's row; the
// office row is when the line is staffed, which is a fact about reaching the
// company rather than about either dock, so it goes on the contact point.
function hoursFor(hours, id) {
  const row = hours.find((h) => h.id === id);
  if (!row) fail(`hours.js holds no "${id}" row`);
  return {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: row.days,
    opens: row.opens,
    closes: row.closes,
  };
}

// What a month of a yard costs, stated once for both places the graph prices
// an offer. The unit code is the UN/CEFACT one for a month; the text beside it
// is for a reader of the markup and nothing parses it.
function monthly(price) {
  return {
    "@type": "UnitPriceSpecification",
    price: String(price),
    priceCurrency: "USD",
    unitText: "MONTH",
    unitCode: "MON",
  };
}

function localBusiness(facility, telephone, mapsHref, hours) {
  const copy = YARD_COPY[facility.id];
  if (!copy) fail(`no structured-data copy for the ${facility.id} yard`);
  return {
    "@type": "LocalBusiness",
    "@id": `${SITE}/#${facility.id}`,
    name: `Dickinson Bayou Fleeting ${facility.name}`,
    description: copy.description,
    url: `${SITE}/contact#${facility.id}`,
    image: LOGO,
    logo: LOGO,
    parentOrganization: { "@id": `${SITE}/#organization` },
    address: {
      "@type": "PostalAddress",
      streetAddress: facility.street,
      addressLocality: facility.city,
      addressRegion: facility.state,
      postalCode: facility.postalCode,
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: facility.lat,
      longitude: facility.lng,
    },
    telephone,
    openingHoursSpecification: [hoursFor(hours, "shore-crew")],
    areaServed: copy.areaServed,
    hasMap: mapsHref(facility.address),
    makesOffer: [
      {
        "@type": "Offer",
        name: copy.offer,
        priceCurrency: "USD",
        price: String(facility.price),
        priceSpecification: monthly(facility.price),
        itemOffered: { "@type": "Service", serviceType: SERVICE_TYPE },
      },
    ],
  };
}

function graphFor({ FACILITIES, PHONE_NUMBER, buildMapsHref, HOURS }) {
  const telephone = `+1-${PHONE_NUMBER}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE}/#website`,
        name: "Dickinson Bayou Fleeting",
        url: `${SITE}/`,
        inLanguage: "en-US",
        publisher: { "@id": `${SITE}/#organization` },
        author: { "@id": `${SITE}/#organization` },
      },
      {
        "@type": "Organization",
        "@id": `${SITE}/#organization`,
        name: "Dickinson Bayou Fleeting",
        alternateName: "DBF",
        description:
          "Coastal barge fleeting and marine services company providing barge mooring, vessel staging, marine fleet support and long-term waterfront dock leasing on Galveston Bay, the Houston Ship Channel and the upper Texas Gulf Coast.",
        url: `${SITE}/`,
        logo: {
          "@type": "ImageObject",
          url: LOGO,
          width: 476,
          height: 146,
          caption: "Dickinson Bayou Fleeting logo",
        },
        telephone,
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer service",
          telephone,
          hoursAvailable: hoursFor(HOURS, "office"),
        },
        areaServed: [
          ...COAST,
          area("Galveston County, Texas"),
          area("Harris County, Texas"),
          area("Brazoria County, Texas"),
          SHIP_CHANNEL,
          GALVESTON_BAY,
          GIWW,
        ],
      },
      ...FACILITIES.map((f) =>
        localBusiness(f, telephone, buildMapsHref, HOURS),
      ),
      {
        "@type": "Service",
        "@id": `${SITE}/#service-fleeting`,
        name: "Barge Fleeting & Marine Services",
        alternateName: [
          "Barge Fleeting",
          "Barge Mooring",
          "Marine Services",
          "Marine Fleeting",
          "Coastal Barge Fleeting",
          "Waterfront Dock Leasing",
        ],
        serviceType: SERVICE_TYPE,
        provider: { "@id": `${SITE}/#organization` },
        description:
          "Long-term coastal barge fleeting, marine services, vessel mooring and waterfront dock leasing on Galveston Bay, the Houston Ship Channel and the Gulf Intracoastal Waterway. Dedicated slip access, gated waterfront acreage, marine fleet support and on-site assistance for commercial barge operators across the upper Texas Gulf Coast.",
        areaServed: [...COAST, SHIP_CHANNEL, GALVESTON_BAY, GIWW],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Coastal Barge Fleeting, Marine Services & Dock Lease Packages",
          itemListElement: FACILITIES.map((f) => ({
            "@type": "Offer",
            name: YARD_COPY[f.id].catalogue,
            priceCurrency: "USD",
            price: String(f.price),
            priceSpecification: monthly(f.price),
            itemOffered: { "@id": `${SITE}/#service-fleeting` },
            url: `${SITE}/services#rates`,
          })),
        },
      },
    ],
  };
}

// The head states one position, and it is the yard the company is named for.
// The two tags spell the same pair differently, which is the only reason there
// are two of them.
function geoContent(name, facility) {
  const separator = name === "ICBM" ? "," : ";";
  return `${facility.lat}${separator}${facility.lng}`;
}

async function main() {
  if (!fs.existsSync(INDEX)) fail("no build/index.html to write into");
  let html = fs.readFileSync(INDEX, "utf8");
  if (!GRAPH_TAG.test(html)) {
    fail("build/index.html carries no application/ld+json tag to write into");
  }

  const modules = await content();
  const home = modules.FACILITIES[0];
  for (const name of GEO_TAGS) {
    const tag = metaTag(name);
    if (!tag.test(html)) fail(`build/index.html has no ${name} meta tag`);
    const content = geoContent(name, home);
    html = html.replace(
      tag,
      () => `<meta content="${content}" name="${name}"/>`,
    );
  }

  const graph = JSON.stringify(graphFor(modules), null, 2);
  html = html.replace(
    GRAPH_TAG,
    () => `<script type="application/ld+json">${graph}</script>`,
  );
  fs.writeFileSync(INDEX, html);
  console.log(
    `structured data written for ${modules.FACILITIES.length} yard(s)`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
