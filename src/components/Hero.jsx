import HeroFilm from "./HeroFilm";
import WaveDivider, { WAVE_INTO_LIGHT } from "./WaveDivider";
import Button from "./ui/Button";
import { Container, Eyebrow, MICRO_SM } from "./ui/Layout";
import { FACILITIES } from "../app/constants/facilities";
import { useCountUp } from "../app/hooks/useCountUp";

const HERO_EYEBROW = "Dickinson Bayou Fleeting · Texas Gulf Coast";
const HERO_TITLE_LEAD = "Lease the yard.";
const HERO_TITLE_ACCENT = "The crew";
const HERO_TITLE_TRAIL = "is already on it.";
const HERO_SUBTITLE =
  "Five gated acres of bulkhead frontage at San Leon or Freeport, with the shore crew, the slip and the line handling already running. From $4,100 a month.";

const ACRES = FACILITIES.reduce((sum, f) => sum + f.acres, 0);
const COUNT_UP_MS = 1600;

// The plate slides by a quarter of its own height over the range where the hero
// leaves the viewport, which is the whole of the parallax. The scroll timeline
// drives it off the compositor, so nothing runs on the main thread as the page
// moves; a browser without one gets a still plate.
const PARALLAX = [
  "motion-safe:supports-[animation-timeline]:animate-plate-drift",
  "motion-safe:supports-[animation-timeline]:[animation-timeline:view()]",
  "motion-safe:supports-[animation-timeline]:[animation-range:exit_0%_exit_100%]",
].join(" ");

// The register marks a chart is trimmed to, at the four corners of the plate.
function HeroMarks() {
  return (
    <svg
      viewBox="0 0 1200 700"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
      className="pointer-events-none absolute inset-0 h-full w-full"
    >
      <g
        fill="none"
        strokeWidth="1.2"
        className="stroke-primary opacity-[0.35]"
      >
        <path d="M40 80 h28 M40 80 v28" />
        <path d="M1160 80 h-28 M1160 80 v28" />
        <path d="M40 620 h28 M40 620 v-28" />
        <path d="M1160 620 h-28 M1160 620 v-28" />
      </g>
    </svg>
  );
}

function AcreFigure() {
  const { ref, display } = useCountUp(ACRES, { duration: COUNT_UP_MS });
  return (
    <span ref={ref} className="tabular-nums">
      {display} ac
    </span>
  );
}

// The readings, ruled across the foot of the plate rather than boxed beside the
// headline. A strip along the bottom edge reads as instrumentation on the
// picture; the same facts in a panel read as a card sitting on top of it.
function HeroDatum() {
  const cells = [
    ...FACILITIES.map((f) => ({
      key: f.id,
      label: `${f.code} · ${f.shortName}`,
      value: f.coord,
    })),
    { key: "acres", label: "Waterfront", value: <AcreFigure /> },
    { key: "crew", label: "Shore crew", value: "24 / 7 on site" },
  ];

  return (
    <div className="relative border-t border-border">
      <Container>
        <dl className="m-0 grid grid-cols-2 lg:grid-cols-4">
          {cells.map((c, i) => (
            <div
              key={c.key}
              className={`min-w-0 py-5 lg:py-6 ${
                i % 2 === 1 ? "border-l border-hairline pl-5" : ""
              } ${i > 1 ? "border-t border-hairline" : ""} ${
                i > 0 ? "lg:border-l lg:border-hairline lg:pl-6" : ""
              } lg:border-t-0`}
            >
              <dt className={`${MICRO_SM} m-0 text-faint`}>{c.label}</dt>
              <dd className="m-0 mt-2 font-mono text-sm tabular-nums text-secondary">
                {c.value}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </div>
  );
}

function HeroSection() {
  const openInquiry = (e) => {
    e.preventDefault();
    window.dispatchEvent(new Event("inquiry:open"));
  };

  return (
    <section
      data-hero
      data-surface="dark"
      aria-label="Introduction"
      id="overview"
      className={`relative isolate flex min-h-plate flex-col items-stretch gap-0 overflow-hidden text-primary [min-height:88svh] ${WAVE_INTO_LIGHT}`}
    >
      <div
        aria-hidden="true"
        className={`absolute inset-0 z-behind h-[115%] overflow-hidden bg-bg-deep will-change-transform ${PARALLAX}`}
      >
        <HeroFilm />
        <span className="absolute inset-0 bg-plate-scrim" />
        <span className="pointer-events-none absolute inset-0 bg-hero-vignette" />
        <HeroMarks />
      </div>

      <Container className="relative flex flex-1 items-center pb-12 pt-plate-top">
        {/* The headline is sized against its own column rather than against the
            window, so the measure it was set for survives a viewport the type
            scale never anticipated. */}
        <div className="flex w-full max-w-hero flex-col items-start gap-7 [container-type:inline-size] laptop:gap-5">
          <Eyebrow strong className="animate-rise motion-reduce:animate-none">
            {HERO_EYEBROW}
          </Eyebrow>

          <h1 className="flex min-w-0 max-w-display flex-col gap-1 text-hero text-primary [font-size:min(var(--text-hero),8.2cqw)]">
            <span className="block overflow-hidden">
              <span className="inline-block animate-rise-1 motion-reduce:animate-none">
                {HERO_TITLE_LEAD}
              </span>
            </span>
            {/* The mask that hides a line before it rises would cut the rule
                off with it, so the box is opened by the depth of the rule and
                pulled back by the same amount. */}
            <span className="-mb-[10px] block overflow-hidden pb-[10px]">
              <span className="inline-block animate-rise-2 motion-reduce:animate-none">
                {/* With no hue in the palette the emphasis is carried by a rule
                    under the words rather than by a colour on them. */}
                {/* Laid out as a block so the rule under it belongs to the line
                    box; on an inline span it hangs below one and the mask above
                    cuts it off. */}
                <span className="inline-block border-b-3 border-accent pb-1 font-bold">
                  {HERO_TITLE_ACCENT}
                </span>{" "}
                {HERO_TITLE_TRAIL}
              </span>
            </span>
          </h1>

          <p className="max-w-prose animate-rise-3 text-lead text-secondary motion-reduce:animate-none laptop:text-base">
            {HERO_SUBTITLE}
          </p>

          <div className="flex animate-rise-4 flex-wrap items-center gap-3 motion-reduce:animate-none">
            <Button variant="primary" href="#contact" onClick={openInquiry}>
              Get Lease Terms
            </Button>
            <Button variant="ghost" href="#yards">
              See Both Yards
            </Button>
          </div>
        </div>
      </Container>

      <HeroDatum />
      <WaveDivider />
    </section>
  );
}

export default HeroSection;
