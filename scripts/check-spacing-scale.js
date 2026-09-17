#!/usr/bin/env node
// Every scale in this project is replaced rather than extended, so the steps
// Tailwind ships do not exist here. A utility naming one compiles to no CSS at
// all: no warning, no error, and no space where space was meant to be. Four of
// them shipped that way, holding apart columns that were running together on
// every screen wide enough to reach the breakpoint, and one more - a tracking
// step in the search palette - had never drawn anything at all.
//
// Nothing in the toolchain catches it, because to Tailwind an unrecognised
// class is not a mistake - it is simply not a class. So the resolved theme is
// read back out of the config and every utility in the source that answers to
// a scale is held against the scale it actually resolves against.

const fs = require("fs");
const path = require("path");
const resolveConfig = require("tailwindcss/resolveConfig");

const ROOT = path.join(__dirname, "..");
const theme = resolveConfig(
  require(path.join(ROOT, "tailwind.config.js")),
).theme;

// A corner or a side, which rounded-* takes before its step.
const CORNER = /^(?:t|r|b|l|s|e|tl|tr|br|bl|ss|se|es|ee)-/;

// text-* is three families sharing one prefix: a type step, an ink, and a
// handful of keywords that answer to no scale at all. A token is a mistake
// only if it is in none of them.
const TEXT_KEYWORDS = new Set([
  "left",
  "center",
  "right",
  "justify",
  "start",
  "end",
  "wrap",
  "nowrap",
  "balance",
  "pretty",
  "ellipsis",
  "clip",
]);

// Which scale each utility reads. Getting this pairing right is the whole
// point: height carries steps of its own that the spacing scale never had, so
// checking h-* against spacing reports working classes as broken.
const SCALES = [
  ["min-h", theme.minHeight],
  ["min-w", theme.minWidth],
  ["max-w", theme.maxWidth],
  ["max-h", theme.maxHeight],
  ["scroll-mt", theme.scrollMargin],
  ["scroll-m", theme.scrollMargin],
  ["scroll-p", theme.scrollPadding],
  ["translate-x", theme.translate],
  ["translate-y", theme.translate],
  ["space-x", theme.space],
  ["space-y", theme.space],
  ["inset-x", theme.inset],
  ["inset-y", theme.inset],
  ["gap-x", theme.gap],
  ["gap-y", theme.gap],
  ["inset", theme.inset],
  ["gap", theme.gap],
  ["mt", theme.margin],
  ["mr", theme.margin],
  ["mb", theme.margin],
  ["ml", theme.margin],
  ["mx", theme.margin],
  ["my", theme.margin],
  ["pt", theme.padding],
  ["pr", theme.padding],
  ["pb", theme.padding],
  ["pl", theme.padding],
  ["px", theme.padding],
  ["py", theme.padding],
  ["top", theme.inset],
  ["right", theme.inset],
  ["bottom", theme.inset],
  ["left", theme.inset],
  ["basis", theme.flexBasis],
  ["size", theme.size || theme.spacing],
  ["m", theme.margin],
  ["p", theme.padding],
  ["w", theme.width],
  ["h", theme.height],
  // The scales that carry no length. The failure is identical - a step the
  // config does not carry emits nothing - and these are the ones a rebuild is
  // most likely to guess at.
  ["tracking", theme.letterSpacing],
  ["duration", theme.transitionDuration],
  ["shadow", theme.boxShadow],
  ["z", theme.zIndex],
  ["rounded", theme.borderRadius, { trim: CORNER }],
  [
    "text",
    theme.fontSize,
    {
      also: (key) => key in theme.textColor || TEXT_KEYWORDS.has(key),
    },
  ],
];

// Path data is a string of letters and numbers that reads exactly like a class
// list to a splitter, so it is ruled out by shape before anything is matched.
const PATH_DATA = /^[MmLlHhVvCcSsQqTtAaZz0-9\s.,+-]+$/;
const STRING = /"([^"\n]*)"|'([^'\n]*)'|`([^`]*)`/g;

function sources(dir) {
  const found = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) found.push(...sources(full));
    else if (/\.(js|jsx)$/.test(entry.name)) found.push(full);
  }
  return found;
}

// The utility, stripped of its variant chain and its sign. An arbitrary value
// carries its own length and answers to no scale, so it is left alone.
function step(token) {
  const bare = token.slice(token.lastIndexOf(":") + 1).replace(/^-/, "");
  if (bare.includes("[")) return null;
  for (const [prefix, scale, options = {}] of SCALES) {
    if (!bare.startsWith(prefix + "-")) continue;
    if (!scale) return null;
    const key = options.trim
      ? bare.slice(prefix.length + 1).replace(options.trim, "")
      : bare.slice(prefix.length + 1);
    if (key in scale) return null;
    if (options.also && options.also(key)) return null;
    return { utility: bare, prefix, scale };
  }
  return null;
}

const failures = [];
for (const file of sources(path.join(ROOT, "src"))) {
  const text = fs.readFileSync(file, "utf8");
  const lines = text.split("\n");
  lines.forEach((line, i) => {
    for (const match of line.matchAll(STRING)) {
      const literal = match[1] ?? match[2] ?? match[3] ?? "";
      if (!literal.trim() || PATH_DATA.test(literal)) continue;
      for (const token of literal.split(/[\s${}()]+/)) {
        if (!token) continue;
        const bad = step(token);
        if (bad) {
          failures.push({
            file: path.relative(ROOT, file),
            line: i + 1,
            ...bad,
          });
        }
      }
    }
  });
}

if (failures.length) {
  console.error(
    `\n${failures.length} utility(s) name a step this project's scales do not carry.`,
  );
  console.error(
    "Each compiles to no CSS at all, so what it was meant to do is simply absent.\n",
  );
  for (const f of failures) {
    console.error(
      `  ${f.file}:${f.line}  ${f.utility}\n      ${f.prefix}-* accepts: ${Object.keys(f.scale).join(", ")}`,
    );
  }
  console.error("");
  process.exit(1);
}

console.log("Scales: every utility in src resolves to a real step.");
