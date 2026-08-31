// The design system, stated once. Every colour, step, rule and layer the site
// draws with is a key in here, so a component spends utilities rather than
// values and nothing is decided in the middle of a render.
//
// Colours resolve to custom properties rather than literals. That is what lets
// one utility carry three themes: `bg-bg` reads --color-bg, and the surface the
// element happens to sit inside is what decides which theme's --color-bg that
// is. A component never forks per theme because it never names a theme.

const colour = (token) => `var(--color-${token})`;

// Duration as one table, for the same reason the type scale is one. A duration
// typed into an animation string drifts away from the transition sitting beside
// it, and nothing catches it: both look right alone. Two lengths, two curves,
// and one step the entrance delays count off, so a stagger and a hover move on
// the same clock.
const DURATION = { quick: 160, settle: 280, step: 40 };

const CURVE = {
  settle: "cubic-bezier(0.22, 1, 0.36, 1)",
  swell: "cubic-bezier(0.16, 0.84, 0.32, 1)",
};

const ms = (n) => `${n}ms`;

// Four entrance steps. An animation cannot read transition-delay, so the same
// four are spent twice - once as delay utilities, once baked into a named
// animation - and are counted from one place so the two never part.
const STEPS = [1, 2, 3, 4];

const stagger = Object.fromEntries(
  STEPS.map((step) => [step, ms(step * DURATION.step)]),
);

const rise = Object.fromEntries(
  [["rise", 0], ...STEPS.map((step) => [`rise-${step}`, step * DURATION.step])].map(
    ([name, delay]) => [
      name,
      `rise ${ms(DURATION.settle)}${delay ? ` ${ms(delay)}` : ""} ${CURVE.swell} both`,
    ],
  ),
);

// The type scale as one table. Every step declares size, leading, tracking and
// weight, so no call site has to finish the definition. Across the display
// steps leading and tracking both compress as the size grows: type set at seven
// rem needs less air between lines and less between letters than type set at
// one.
const TYPE = {
  figure: ["clamp(4.4rem, 11vw, 7.2rem)", "0.92", "-0.01em", "700"],
  "figure-sm": ["clamp(3.4rem, 16vw, 4.6rem)", "0.94", "-0.005em", "700"],
  h1: ["clamp(2.6rem, 6vw, 5rem)", "0.96", "-0.005em", "700"],
  h2: ["clamp(2.2rem, 4.8vw, 3.8rem)", "1", "0em", "600"],
  // The one step whose size a container query re-derives, so all four of its
  // values sit in the token block together rather than the size alone going
  // there and the other three staying here.
  hero: [
    "var(--text-hero)",
    "var(--text-hero-leading)",
    "var(--text-hero-tracking)",
    "var(--text-hero-weight)",
  ],
  h3: ["clamp(1.9rem, 3.6vw, 2.7rem)", "1.06", "0.01em", "600"],
  h4: ["clamp(1.6rem, 2.8vw, 2.3rem)", "1.1", "0.015em", "600"],
  h5: ["clamp(1.35rem, 2.2vw, 1.8rem)", "1.16", "0.02em", "600"],
  h6: ["clamp(1.15rem, 1.7vw, 1.45rem)", "1.24", "0.025em", "600"],

  lead: ["clamp(1.04rem, 1.45vw, 1.2rem)", "1.55", "0em", "400"],
  xl: ["1.3rem", "1.5", "0em", "400"],
  lg: ["1.14rem", "1.55", "0em", "400"],
  base: ["1rem", "1.6", "0em", "400"],
  md: ["0.96rem", "1.62", "0em", "400"],
  sm: ["0.86rem", "1.6", "0.01em", "400"],
  // The three micro steps are set in mono and almost always uppercase, so each
  // carries the tracking that size needs to stay readable in caps.
  xs: ["0.74rem", "1.5", "0.06em", "500"],
  "2xs": ["0.68rem", "1.45", "0.08em", "500"],
  "3xs": ["0.62rem", "1.4", "0.1em", "500"],
};

const fontSize = Object.fromEntries(
  Object.entries(TYPE).map(
    ([step, [size, lineHeight, letterSpacing, fontWeight]]) => [
      step,
      [size, { lineHeight, letterSpacing, fontWeight }],
    ],
  ),
);

// The height of one line at a given step. The route placeholder reserves its
// boxes from these, so a change to the scale moves the placeholder with it.
const lineBox = Object.fromEntries(
  Object.entries(TYPE).map(([step, [size, lineHeight]]) => [
    `line-${step}`,
    `calc(${size} * ${lineHeight})`,
  ]),
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
    // would be a colour no theme voted for, and the utility would go on
    // meaning slate whichever surface it landed on.
    colors: {
      transparent: "transparent",
      current: "currentColor",
      inherit: "inherit",

      "app-bg": colour("app-bg"),
      bg: colour("bg"),
      "bg-deep": colour("bg-deep"),
      surface: colour("surface"),

      // Safety orange. The primary action and active state, and nothing else:
      // spend it twice on a screen and it stops meaning anything.
      highlight: colour("highlight"),
      "highlight-hover": colour("highlight-hover"),
      "highlight-soft": colour("highlight-soft"),
      "highlight-ring": colour("highlight-ring"),

      // Links, focus rings and hairline ticks. One step off the highlight,
      // because a second hue competing with the primary action is a second
      // thing for the eye to rank.
      accent: colour("accent"),
      "accent-ring": colour("accent-ring"),

      // Tier-two marks only: timeline rules, spec callouts. Never a CTA.
      rust: colour("rust"),

      border: colour("border"),
      "border-strong": colour("border-strong"),
      hairline: colour("hairline"),
      "field-border": colour("field-border"),
      // The well a field sits in. Its own role rather than bg-deep borrowed,
      // because the two answer to different questions: how deep the hull goes,
      // and how far a field has to stand off whatever is hosting it.
      "field-surface": colour("field-surface"),

      primary: colour("text-primary"),
      secondary: colour("text-secondary"),
      faint: colour("text-faint"),
      muted: colour("text-muted"),
      "on-accent": colour("text-on-accent"),
      "on-highlight": colour("text-on-highlight"),

      success: colour("success"),
      danger: colour("danger"),
      "danger-soft": colour("danger-soft"),

      "layer-1": colour("layer-1"),
      "layer-2": colour("layer-2"),
      "overlay-nav": colour("overlay-nav"),
      "overlay-scrim": colour("overlay-scrim"),
      console: colour("surface-console"),
      "console-inset": colour("surface-console-inset"),
    },

    // Square, and the round dot. Sharp corners are the look, so there is no
    // radius scale to drift along.
    borderRadius: {
      none: "0px",
      full: "50%",
    },

    // 4px base, named rather than numbered past the first few steps, so a
    // section's rhythm is picked from a scale instead of typed.
    spacing: {
      0: "0px",
      px: "1px",
      // Half steps, for the two-pixel nudges the rules and marks are set by.
      0.5: "2px",
      1: "4px",
      1.5: "6px",
      2: "8px",
      3: "12px",
      4: "16px",
      5: "20px",
      6: "24px",
      7: "32px",
      8: "44px",
      9: "64px",
      10: "88px",
      11: "120px",
      12: "160px",
      "icon-sm": "14px",
      "icon-md": "18px",
      "icon-lg": "32px",
      // Rule runs. The 1px seam is the site's whole border language, and these
      // are the lengths it is cut to.
      accent: "2px",
      marker: "3px",
      tick: "18px",
      "rule-short": "36px",
      rule: "56px",
      "rule-long": "84px",
      "rule-wide": "96px",
      nav: "var(--nav-height)",
      "nav-logo": "var(--nav-logo-height)",
      "footer-logo": "var(--footer-logo-height)",
      wave: "var(--wave-height)",
      control: "var(--control-height)",
      "control-sm": "var(--control-height-sm)",
      gutter: "var(--container-pad)",
      section: "var(--section-py)",
      anchor: "var(--anchor-offset)",
      "plate-top": "var(--plate-pad-top)",
      // The index column, and the indent that lines an answer up under the
      // question it belongs to.
      index: "var(--col-index)",
      "index-wide": "var(--col-index-wide)",
      code: "var(--col-code)",
      label: "var(--col-label)",
      "answer-indent": "92px",
      map: "var(--map-height)",
      "map-sm": "var(--map-height-sm)",
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

    // Uppercase tracking in three steps. The section eyebrow is the widest
    // thing on the page and the only thing at that width; controls sit a step
    // in, and every other micro-label a step in again. Setting them all alike
    // is how a page ends up with forty labels and no hierarchy among them.
    letterSpacing: {
      tight: "-0.01em",
      normal: "0em",
      label: "0.06em",
      control: "0.12em",
      eyebrow: "0.32em",
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
    // em, which tracks the display face they are actually set in.
    maxWidth: {
      none: "none",
      full: "100%",
      prose: "52ch",
      "prose-tight": "46ch",
      title: "12em",
      display: "14em",
      head: "980px",
      hero: "920px",
      container: "1440px",
    },

    // Written literally rather than read from a token: a media query cannot
    // resolve a custom property.
    screens: {
      xs: "540px",
      sm: "720px",
      md: "900px",
      lg: "1080px",
      xl: "1240px",
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

      // Seven names, each with a job. Depth on this site comes from the
      // absence of light rather than from a stack of elevations.
      boxShadow: {
        lg: "var(--shadow-lg)",
        accent: "var(--shadow-accent)",
        // A plate reads as both lifted off the page and lit along its own top
        // edge, which is two shadows rather than one.
        plate: "var(--shadow-md), var(--shadow-inset-card)",
        focus: "var(--ring-focus)",
        "focus-accent": "var(--ring-focus), var(--shadow-accent)",
        none: "none",
      },

      backgroundImage: {
        hull: "var(--texture-hull)",
        "plate-scrim": "var(--gradient-plate-scrim)",
        "hero-vignette": "var(--gradient-hero-vignette)",
      },

      backgroundSize: {
        "hull-grid": "var(--texture-hull-size)",
      },

      // --curve-settle for state changes and entrances, --curve-swell for
      // reveals and anything that should read as water rather than snap. No
      // overshoot curve: a control that springs past its resting size reads as
      // a toy on a working dock.
      transitionTimingFunction: CURVE,

      transitionDuration: {
        quick: ms(DURATION.quick),
        settle: ms(DURATION.settle),
        // Long enough that the transition never arrives. The one use is
        // holding Chrome's autofill background off a field: the browser
        // repaints it on its own schedule, and a transition that never lands
        // is what keeps the field wearing the theme's colours instead.
        never: "600000s",
      },

      // One delay rhythm, four steps. Every entrance on the page counts off
      // these and no others, so two bands never arrive on different clocks.
      transitionDelay: stagger,

      keyframes: {
        rise: {
          from: { opacity: "0", transform: "translateY(22px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        arrive: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "click-ripple": {
          to: { transform: "scale(4.5)", opacity: "0" },
        },
        "plate-drift": {
          from: { transform: "translate3d(0, 0, 0)" },
          to: { transform: "translate3d(0, 28%, 0)" },
        },
      },

      // The entrance, counted off the four delay steps. An animation cannot
      // read transition-delay, so each step is its own named animation rather
      // than a utility stacked on top of one.
      animation: {
        ...rise,
        // Held at nothing for the length of a cached chunk's arrival, then
        // brought up. `both` keeps the opening frame's opacity through the
        // delay, which is what stops a fast route flashing a placeholder on
        // its way past.
        arrive: `arrive ${ms(DURATION.settle)} ${ms(6 * DURATION.step)} ${CURVE.settle} both`,
        // Driven by a scroll timeline rather than a clock, so the duration is
        // the range the host declares and not a value here.
        "plate-drift": "plate-drift linear both",
        "click-ripple": `click-ripple ${ms(DURATION.settle)} ${CURVE.settle} forwards`,
      },

      // A thumb needs the same reach across a control as down it, so the two
      // scales carry the same steps.
      minWidth: {
        control: "var(--control-height)",
        "control-sm": "var(--control-height-sm)",
      },

      height: lineBox,

      minHeight: {
        // The height of one line of whatever the element is set in, so an
        // error slot holds its place whether or not it has words in it.
        line: "1lh",
        control: "var(--control-height)",
        "control-sm": "var(--control-height-sm)",
        field: "var(--field-min-height)",
        plate: "var(--plate-min-height)",
        header: "var(--header-min-height)",
      },

      maxHeight: {
        field: "var(--field-max-height)",
      },

      gridTemplateColumns: {
        index: "var(--col-index) minmax(0, 1fr)",
        "index-wide": "var(--col-index-wide) minmax(0, 1fr)",
        code: "var(--col-code) minmax(0, 1fr)",
        label: "var(--col-label) minmax(0, 1fr)",
      },

      blur: {
        sm: "6px",
        md: "16px",
      },
    },
  },
  plugins: [],
};
