// The design system, stated once. Every colour, step, rule and layer the site
// draws with is a key in here, so a component spends utilities rather than
// values and nothing is decided in the middle of a render.
//
// Colours resolve to custom properties rather than literals. That is what lets
// one utility carry both modes: `bg-bg` reads --color-bg, and the surface the
// element happens to sit inside is what decides which mode's --color-bg that
// is. A component never forks per mode because it never names a mode.

const colour = (token) => `var(--color-${token})`;

// Duration as one table, for the same reason the type scale is one. A duration
// typed into an animation string drifts away from the transition sitting beside
// it, and nothing catches it: both look right alone. Two lengths, two curves,
// and one step the entrance delays count off, so a stagger and a hover move on
// the same clock.
// quick is what a colour under the pointer takes, settle is what a control
// takes to change state, and reveal is what a band arrives on. Reveal is not
// the long one: a band of text that takes three quarters of a second to
// arrive is a band the reader is waiting on rather than reading. step is the
// gap between two siblings arriving.
const DURATION = { quick: 150, settle: 300, step: 80, reveal: 320 };

const CURVE = {
  settle: "cubic-bezier(0.22, 1, 0.36, 1)",
  swell: "cubic-bezier(0.16, 0.84, 0.32, 1)",
  // The curve a band arrives on: almost all of the travel is spent in the
  // first third, so a block is legible long before it stops moving.
  reveal: "cubic-bezier(0.2, 0, 0, 1)",
};

const ms = (n) => `${n}ms`;

// Six entrance steps, which is where a stagger is capped: past the sixth
// child the delay is longer than the entrance and the list trails off rather
// than finishing. An animation cannot read transition-delay, so the same six
// are spent twice - once as delay utilities, once baked into a named animation
// - and are counted from one place so the two never part.
const STEPS = [1, 2, 3, 4, 5, 6];

const stagger = Object.fromEntries(
  STEPS.map((step) => [step, ms(step * DURATION.step)]),
);

const rise = Object.fromEntries(
  [
    ["rise", 0],
    ...STEPS.map((step) => [`rise-${step}`, step * DURATION.step]),
  ].map(([name, delay]) => [
    name,
    `rise ${ms(DURATION.settle)}${delay ? ` ${ms(delay)}` : ""} ${CURVE.swell} both`,
  ]),
);

// The fade with no hold in front of it, written once because two things use it
// and a second copy of the string is a second thing to keep in step.
const arriveNow = `arrive ${ms(DURATION.settle)} ${CURVE.settle} both`;

// The type scale as one table: twenty styles, one utility each, every one of
// them declaring size, leading, tracking and weight so no call site has to
// finish the definition. The family is not in here, because Tailwind's
// fontSize carries no family - a step is always worn with font-condensed,
// font-body or font-mono, and which one goes with which is in the comment
// above each block.
//
// Four of the twenty are a mobile counterpart rather than a step of their own.
// They are not clamps: a clamp returns a different size at every viewport, so
// no two screens share a vertical rhythm and a band that looks right on a
// laptop is cramped on a tablet. The pairs hand over at 900 and nowhere else,
// written at the call site as `text-h2-mobile md:text-h2`.
const TYPE = {
  // Condensed, uppercase. The display faces are Bold throughout except h5.
  hero: ["4.75rem", "72px", "-0.01em", "700"],
  "hero-mobile": ["2.75rem", "44px", "-0.01em", "700"],
  h1: ["3.5rem", "56px", "-0.005em", "700"],
  "h1-mobile": ["2.25rem", "38px", "-0.005em", "700"],
  h2: ["2.5rem", "42px", "0em", "700"],
  "h2-mobile": ["1.875rem", "32px", "0em", "700"],
  h3: ["1.75rem", "32px", "0.01em", "700"],
  h4: ["1.375rem", "26px", "0.015em", "700"],
  h5: ["1.125rem", "24px", "0.02em", "600"],

  // Body face, sentence case.
  lead: ["1.1875rem", "30px", "0em", "400"],
  "lead-mobile": ["1.0625rem", "27px", "0em", "400"],
  base: ["1rem", "26px", "0em", "400"],
  small: ["0.875rem", "22px", "0em", "400"],
  "small-strong": ["0.875rem", "22px", "0em", "600"],
  // The one label step. A page whose labels come in three sizes has three
  // labels doing one job and no ranking among them.
  micro: ["0.8125rem", "18px", "0em", "600"],

  // Mono. Eyebrows and codes are set in caps and opened up; data and figures
  // are set as typed, because they are read a character at a time.
  eyebrow: ["0.75rem", "16px", "0.14em", "500"],
  code: ["0.75rem", "16px", "0.06em", "500"],
  data: ["0.875rem", "22px", "0em", "400"],
  figure: ["2rem", "34px", "-0.01em", "700"],
  "figure-sm": ["1.25rem", "24px", "-0.01em", "700"],
};

const fontSize = Object.fromEntries(
  Object.entries(TYPE).map(
    ([step, [size, lineHeight, letterSpacing, fontWeight]]) => [
      step,
      [size, { lineHeight, letterSpacing, fontWeight }],
    ],
  ),
);

module.exports = {
  content: ["./src/**/*.{js,jsx}", "./public/index.html"],
  // A touch screen reports a hover it cannot take back, which leaves a tapped
  // control wearing its hover state until something else is tapped. Gating the
  // variant on a pointer that can actually hover is what keeps press feedback
  // and hover feedback separate.
  future: { hoverOnlyWhenSupported: true },
  theme: {
    // Replaces Tailwind's palette outright. A literal like `bg-slate-800`
    // would be a colour no mode voted for, and the utility would go on
    // meaning slate whichever surface it landed on.
    colors: {
      transparent: "transparent",
      current: "currentColor",

      bg: colour("bg"),
      "bg-deep": colour("bg-deep"),
      surface: colour("surface"),

      // The action. With no hue in the palette it is simply the strongest ink
      // the band has, so it is spent once per band: twice on a screen and it
      // stops meaning anything.
      highlight: colour("highlight"),
      "highlight-hover": colour("highlight-hover"),
      "highlight-ring": colour("highlight-ring"),

      // One weight separates and one divides. Nothing sits between them.
      border: colour("border"),
      "border-strong": colour("border-strong"),
      "field-border": colour("field-border"),
      // The well a field sits in. Its own role rather than bg-deep borrowed,
      // because the two answer to different questions: how deep the hull goes,
      // and how far a field has to stand off whatever is hosting it.
      "field-surface": colour("field-surface"),

      primary: colour("text-primary"),
      secondary: colour("text-secondary"),
      faint: colour("text-faint"),
      muted: colour("text-muted"),
      "on-highlight": colour("text-on-highlight"),

      danger: colour("danger"),
      "danger-soft": colour("danger-soft"),

      "layer-1": colour("layer-1"),
      "layer-2": colour("layer-2"),
      "overlay-scrim": colour("overlay-scrim"),
      // The wash the hero and every inner plate read their footage through.
      "plate-scrim": colour("plate-scrim"),
    },

    // Bands and plates are square. Fields and buttons take the small step,
    // cards and the dialog the medium one, and a hairline chip the extra
    // small. The one circle the site draws is the click ripple, which states
    // its own radius beside the rest of its shape.
    borderRadius: {
      none: "0px",
      xs: "2px",
      sm: "4px",
      md: "8px",
      full: "999px",
    },

    // Fifteen rungs on a 4px base, doubling cleanly from 16 up. The only
    // unusual one is 5, at 20, which is the phone's page gutter.
    //
    // Everything below the numbers is a length rather than a space: the page's
    // own measurements, which fork at 900 and are read from the token block,
    // and the handful of rules and marks the layout is drawn with.
    spacing: {
      0: "0px",
      px: "1px",
      1: "4px",
      2: "8px",
      3: "12px",
      4: "16px",
      5: "20px",
      6: "24px",
      7: "32px",
      8: "40px",
      9: "48px",
      10: "64px",
      11: "80px",
      12: "96px",
      13: "128px",
      14: "160px",

      gutter: "var(--gutter)",
      band: "var(--band-pad)",
      "grid-gutter": "var(--grid-gutter)",
      nav: "var(--nav-bar)",
      strip: "var(--nav-strip)",
      chrome: "var(--chrome-height)",
      anchor: "var(--anchor-offset)",
      "plate-top": "var(--plate-pad-top)",
      "control-lg": "var(--control-lg)",
      "control-md": "var(--control-md)",
      "control-sm": "var(--control-sm)",
      "nav-logo": "var(--nav-logo-height)",
      "footer-logo": "var(--footer-logo-height)",
      map: "var(--map-height)",
      "map-sm": "var(--map-height-sm)",
      // The index and code columns the register, the legal body and the
      // search palette measure a gutter from rather than reading off a track.
      index: "var(--col-index)",
      "code-sm": "var(--col-code-sm)",

      // Marks. The 1px rule is the site's whole border language, and these are
      // the lengths it is cut to and the two depths a mark is drawn at.
      "icon-sm": "14px",
      "icon-md": "18px",
      "icon-lg": "32px",
      rule: "12px",
      "rule-crumb": "18px",
      "rule-eyebrow": "36px",
      "rule-long": "84px",
      marker: "3px",
    },

    // Three faces, each with one job: condensed sets every heading and figure,
    // body sets running text, mono sets eyebrows, codes and coordinates. A
    // fourth would blur which of the three a piece of text belongs to.
    fontFamily: {
      condensed: [
        "Barlow Condensed",
        "Barlow Condensed Fallback",
        "Arial Narrow",
        "Liberation Sans Narrow",
        "sans-serif",
      ],
      body: [
        "IBM Plex Sans",
        "IBM Plex Sans Fallback",
        "-apple-system",
        "BlinkMacSystemFont",
        "Segoe UI",
        "sans-serif",
      ],
      mono: [
        "JetBrains Mono",
        "JetBrains Mono Fallback",
        "ui-monospace",
        "SFMono-Regular",
        "Menlo",
        "monospace",
      ],
    },

    fontSize,

    // One step, and it closes display type up. Everything else on the site is
    // set at the tracking its own type step already carries, which is what the
    // type scale states a tracking for.
    letterSpacing: {
      tight: "-0.01em",
    },

    // Named depths, so the bar can never end up under its own drawer.
    zIndex: {
      behind: "-1",
      base: "0",
      raised: "1",
      overlay: "2",
      rail: "40",
      scrim: "48",
      drawer: "49",
      nav: "50",
      modal: "100",
      pointer: "9999",
    },

    // Prose is capped in ch, which tracks the body face; headline caps are in
    // em, which tracks the display face they are actually set in. The four
    // pixel measures are the widths the plate, the hero and the legal body are
    // drawn to.
    maxWidth: {
      prose: "52ch",
      "prose-tight": "46ch",
      title: "12em",
      display: "14em",
      head: "980px",
      palette: "620px",
      hero: "920px",
      "plate-title": "1100px",
      "plate-lede": "720px",
      "hero-lede": "620px",
      legal: "640px",
      container: "var(--container-max)",
    },

    // Written literally rather than read from a token: a media query cannot
    // resolve a custom property.
    screens: {
      xs: "540px",
      sm: "720px",
      // The one break the design is drawn either side of: the utility strip
      // appears, the bar keeps its destinations in a row, band padding steps
      // from 64 to 96 and the mobile type styles hand over to the desktop ones.
      md: "900px",
      lg: "1080px",
      xl: "1240px",
      // The width at which the page gutter is finally wider than the scroll
      // rail. Narrower than this the rail stands on the text, which is what
      // the number has to be measured against rather than guessed: the
      // container is 1280px and the rail runs about 150px in from the edge
      // once its longest label is set. Both gutters have to clear that, so the
      // step is the container plus twice the rail, with a little to spare.
      rail: "1800px",
      // A laptop screen is wide and short. Without a step of its own the hero
      // stacks past the fold on a 1280x800 screen, which is where most readers
      // meet the site for the first time.
      laptop: { raw: "(min-width: 1080px) and (max-height: 900px)" },
    },

    extend: {
      // The 1px seam is the site's whole border language; 2px is an accent
      // mark and 3px is the row marker. Nothing else is drawn.
      borderWidth: {
        DEFAULT: "1px",
        2: "2px",
        3: "3px",
      },

      // Four names, each with a job. On the dark side depth is bought with a
      // lit edge rather than with a blur: a black shadow over a near-black
      // ground composites to the ground.
      boxShadow: {
        lg: "var(--shadow-lg)",
        raise: "var(--shadow-raise)",
        focus: "var(--ring-focus)",
        // A one-pixel edge drawn as a shadow rather than a border, for a
        // control that must not gain a layout box when it gains its outline.
        edge: "0 0 0 1px var(--color-border)",
      },

      // --curve-settle for state changes and entrances, --curve-swell for
      // reveals and anything that should read as water rather than snap. No
      // overshoot curve: a control that springs past its resting size reads as
      // a toy on a working dock.
      transitionTimingFunction: CURVE,

      transitionDuration: {
        reveal: ms(DURATION.reveal),
        quick: ms(DURATION.quick),
        settle: ms(DURATION.settle),
      },

      // One delay rhythm, six steps. Every entrance on the page counts off
      // these and no others, so two bands never arrive on different clocks.
      transitionDelay: stagger,

      keyframes: {
        rise: {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        arrive: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "click-ripple": {
          to: { transform: "scale(4.5)", opacity: "0" },
        },
      },

      // The entrance, counted off the same six delay steps. An animation cannot
      // read transition-delay, so each step is its own named animation rather
      // than a utility stacked on top of one.
      animation: {
        ...rise,
        // Held at nothing for the length of a cached chunk's arrival, then
        // brought up. `both` keeps the opening frame's opacity through the
        // delay, which is what stops a fast route flashing a placeholder on
        // its way past.
        arrive: `arrive ${ms(DURATION.settle)} ${ms(6 * DURATION.step)} ${CURVE.settle} both`,
        // The same fade with nothing held in front of it, for the route whose
        // markup came down in the document. There is no chunk on the way and
        // no placeholder standing in for it, so the hold covers a page that is
        // already on the glass and keeps it off the screen for the length of a
        // round trip that never happened.
        "arrive-now": arriveNow,
        // And for the film over the poster it replaces. The two are the same
        // picture, so the clip comes up rather than cutting in.
        "film-in": arriveNow,
        "click-ripple": `click-ripple ${ms(DURATION.settle)} ${CURVE.settle} forwards`,
      },

      // A thumb needs the same reach across a control as down it, so the step
      // a tap target is held to is the same one in both directions.
      minWidth: {
        "control-lg": "var(--control-lg)",
        "control-md": "var(--control-md)",
        "control-sm": "var(--control-sm)",
      },

      minHeight: {
        // The height of one line of whatever the element is set in, so an
        // error slot holds its place whether or not it has words in it.
        line: "1lh",
        "control-lg": "var(--control-lg)",
        "control-md": "var(--control-md)",
        "control-sm": "var(--control-sm)",
        field: "var(--field-min-height)",
        "plate-hero": "var(--plate-hero)",
        "plate-page": "var(--plate-page)",
      },

      maxHeight: {
        field: "var(--field-max-height)",
      },
    },
  },
  plugins: [],
};
