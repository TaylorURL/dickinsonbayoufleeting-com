import "./styles/Hero.css";
import OceanTopographyBackground from "./OceanTopographyBackground";
import WaveDivider from "./WaveDivider";
import OperationsConsole from "./OperationsConsole";
import { Link } from "../app/router/Link";

const HERO_EYEBROW = "Dickinson Bayou Fleeting · Texas Gulf Coast";
const HERO_TITLE_LEAD = "Coastal barge fleeting,";
const HERO_TITLE_ACCENT = "marine services";
const HERO_TITLE_TRAIL = "& dock leasing.";
const HERO_SUBTITLE =
  "Two yards on the upper Texas Gulf Coast, holding slips for barge operators and tow companies working Galveston Bay, the Houston Ship Channel and the Gulf Intracoastal Waterway.";

function HeroMarks() {
  return (
    <svg
      className="hero__marks"
      viewBox="0 0 1200 700"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <g className="hero__marksTick" fill="none" strokeWidth="1.2">
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
      className="hero"
      data-surface="dark"
      aria-label="Introduction"
      id="overview"
    >
      <div className="hero__bg" aria-hidden="true">
        <OceanTopographyBackground />
        <span className="hero__scrim" />
        <span className="hero__vignette" />
        <HeroMarks />
      </div>

      <div className="hero__frame container">
        <div className="hero__inner">
          <p className="eyebrow eyebrow--strong hero__eyebrow mono">
            {HERO_EYEBROW}
          </p>
          <h1 className="hero__title">
            <span className="hero__titleLine">{HERO_TITLE_LEAD}</span>
            <span className="hero__titleLine">
              <span className="hero__titleAccent">{HERO_TITLE_ACCENT}</span>{" "}
              {HERO_TITLE_TRAIL}
            </span>
          </h1>
          <p className="hero__subtitle">{HERO_SUBTITLE}</p>
          <div className="hero__actions">
            <a
              className="btn btn--primary"
              href="#contact"
              onClick={openInquiry}
            >
              Request a Quote
            </a>
            <Link className="btn btn--ghost" to="/services">
              Explore Services
            </Link>
          </div>
        </div>

        <OperationsConsole />
      </div>
      <WaveDivider />
    </section>
  );
}

export default HeroSection;
