import OceanTopographyBackground from "./OceanTopographyBackground";
import WaveDivider, { WAVE_INTO_LIGHT } from "./WaveDivider";
import OperationsConsole from "./OperationsConsole";
import Button from "./ui/Button";
import { Container, Eyebrow } from "./ui/Layout";

const HERO_EYEBROW = "Dickinson Bayou Fleeting · Texas Gulf Coast";
const HERO_TITLE_LEAD = "Coastal barge fleeting,";
const HERO_TITLE_ACCENT = "marine services";
const HERO_TITLE_TRAIL = "& dock leasing.";
const HERO_SUBTITLE =
  "Two yards holding slips for barge operators working Galveston Bay, the Houston Ship Channel and the Gulf Intracoastal Waterway.";

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
      className={`relative isolate flex min-h-plate flex-col items-stretch gap-0 overflow-hidden text-primary [min-height:100svh] ${WAVE_INTO_LIGHT}`}
    >
      <div
        aria-hidden="true"
        className={`absolute inset-0 z-behind h-[115%] overflow-hidden bg-bg-deep will-change-transform ${PARALLAX}`}
      >
        <OceanTopographyBackground />
        <span className="absolute inset-0 bg-plate-scrim" />
        <span className="pointer-events-none absolute inset-0 bg-hero-vignette" />
        <HeroMarks />
      </div>

      <Container className="relative grid flex-1 grid-cols-[minmax(0,1fr)] gap-7 pb-12 pt-plate-top lg:grid-cols-[minmax(0,1.35fr)_minmax(360px,420px)] lg:gap-x-9 lg:gap-y-7 laptop:gap-x-8 laptop:gap-y-5 laptop:pb-11">
        {/* The headline is sized against this column rather than against the
            window, because the column is what it has to fit into: the console
            beside it takes a fixed slice, so viewport width alone does not say
            how much room is left. */}
        <div className="flex max-w-hero flex-col items-start gap-7 self-center [container-type:inline-size] laptop:gap-5">
          <Eyebrow strong className="animate-rise motion-reduce:animate-none">
            {HERO_EYEBROW}
          </Eyebrow>

          {/* The longest line runs about thirteen times the type size, so the
              container step is the size at which it still lands on one line. A
              browser with no container query keeps the scale step. */}
          <h1 className="flex min-w-0 max-w-display flex-col gap-1 text-hero text-primary [font-size:min(var(--text-hero),7.4cqw)]">
            <span className="block overflow-hidden">
              <span className="inline-block animate-rise-1 motion-reduce:animate-none">
                {HERO_TITLE_LEAD}
              </span>
            </span>
            <span className="block overflow-hidden">
              <span className="inline-block animate-rise-2 motion-reduce:animate-none">
                <span className="font-bold text-highlight">
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
              Request a Quote
            </Button>
            <Button variant="ghost" to="/services">
              Explore Services
            </Button>
          </div>
        </div>

        <OperationsConsole />
      </Container>

      <WaveDivider />
    </section>
  );
}

export default HeroSection;
