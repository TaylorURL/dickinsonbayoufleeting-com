#!/usr/bin/env node
// Dates the sitemap.
//
// A <loc> with no <lastmod> tells a crawler nothing about whether coming back
// is worth the request, and a date typed into public/sitemap.xml is a date
// nobody remembers to move. The one date this build actually knows is its own:
// every document here is written by the build, so the day it ran is the day
// the file served at each of these URLs last changed.
const fs = require("fs");
const path = require("path");

const SITEMAP = path.join(__dirname, "..", "build", "sitemap.xml");

if (!fs.existsSync(SITEMAP)) {
  console.error("sitemap: no build/sitemap.xml to date");
  process.exit(1);
}

const day = new Date().toISOString().slice(0, 10);
const xml = fs.readFileSync(SITEMAP, "utf8");
if (xml.includes("<lastmod>")) {
  console.log("the sitemap is already dated");
  process.exit(0);
}

let dated = 0;
const stamped = xml.replace(/(<loc>[^<]*<\/loc>)/g, (whole) => {
  dated += 1;
  return `${whole}\n    <lastmod>${day}</lastmod>`;
});

if (!dated) {
  console.error("sitemap: build/sitemap.xml lists no URL to date");
  process.exit(1);
}

fs.writeFileSync(SITEMAP, stamped);
console.log(`dated ${dated} sitemap URL(s) ${day}`);
