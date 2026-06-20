import "./styles/Hero.css";
import OceanTopographyBackground from "./OceanTopographyBackground";
import { useReveal } from "../app/hooks/useReveal";
import { useCountUp } from "../app/hooks/useCountUp";
import { Link } from "../app/router/Link";

const HERO_EYEBROW = "Dickinson Bayou Fleeting · Texas Gulf Coast";
const HERO_TITLE_LEAD = "Coastal barge fleeting,";
const HERO_TITLE_ACCENT = "marine services";
const HERO_TITLE_TRAIL = "& waterfront dock leasing.";
const HERO_SUBTITLE =
  "Long-term barge fleeting, vessel mooring and dedicated slip access on Galveston Bay, the Houston Ship Channel and the Gulf Intracoastal Waterway — built around the upper Texas Gulf Coast and the towboat crews that run it.";

const HERO_HIGHLIGHTS = [
  { label: "Galveston Bay", detail: "San Leon · 5-acre coastal yard" },
  { label: "Intracoastal", detail: "Freeport · GIWW waterfront" },
];

const HERO_STATS = [
  { value: 2, suffix: "", label: "Coastal facilities", note: "San Leon · Freeport" },
  { value: 10, suffix: " ac", label: "Combined waterfront acreage", note: "Two five-acre yards" },
  { value: 24, suffix: "/7", label: "On-site operations", note: "Year-round crew presence" },
  { value: 100, suffix: "%", label: "Direct waterfront access", note: "No third-party transit" },
];

function HeroMarks() {
  return (
    <svg
      className="hero__marks"
      viewBox="0 0 1200 700"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <g className="hero__marksGrid" fill="none" strokeWidth="1">
        <line x1="0" y1="180" x2="1200" y2="180" />
        <line x1="0" y1="360" x2="1200" y2="360" />
        <line x1="0" y1="540" x2="1200" y2="540" />
        <line x1="200" y1="0" x2="200" y2="700" />
        <line x1="600" y1="0" x2="600" y2="700" />
        <line x1="1000" y1="0" x2="1000" y2="700" />
      </g>
      <g className="hero__marksTick" fill="none" strokeWidth="1.2">
        <path d="M40 80 h28 M40 80 v28" />
        <path d="M1160 80 h-28 M1160 80 v28" />
        <path d="M40 620 h28 M40 620 v-28" />
        <path d="M1160 620 h-28 M1160 620 v-28" />
      </g>
    </svg>
  );
}

function StatValue({ value, suffix }) {
  const { ref, display } = useCountUp(value, { duration: 1400 });
  return (
    <dd className="hero__statValue tabular" ref={ref}>
      {display}
      {suffix ? <span className="hero__statSuffix">{suffix}</span> : null}
    </dd>
  );
}

function HeroSection() {
  const openInquiry = (e) => {
    e.preventDefault();
    window.dispatchEvent(new Event("inquiry:open"));
  };
  const statsRef = useReveal();
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
        <div className="hero__topMeta">
          <span className="hero__topMetaItem mono">
            <span className="hero__metaDot" aria-hidden="true" />
            On the water · 24-hour operations desk
          </span>
          <span className="hero__topMetaItem mono">
            Galveston Bay · Houston Ship Channel · GIWW
          </span>
        </div>

        <div className="hero__inner">
          <p className="eyebrow eyebrow--strong hero__eyebrow mono">
            {HERO_EYEBROW}
          </p>
          <h1 className="hero__title">
            {HERO_TITLE_LEAD}
            <br />
            <span className="hero__titleAccent">{HERO_TITLE_ACCENT}</span>{" "}
            {HERO_TITLE_TRAIL}
          </h1>
          <p className="hero__subtitle">{HERO_SUBTITLE}</p>
          <div className="hero__actions">
            <Link className="btn btn--primary" to="/services">
              Explore Services
            </Link>
            <a className="btn btn--ghost" href="#contact" onClick={openInquiry}>
              Request a Quote
            </a>
          </div>
        </div>

        <div className="hero__sidebar" aria-hidden="true">
          <ul className="hero__highlights">
            {HERO_HIGHLIGHTS.map((h) => (
              <li key={h.label} className="hero__highlight">
                <span className="hero__highlightTick" />
                <span className="hero__highlightLabel mono">{h.label}</span>
                <span className="hero__highlightDetail">{h.detail}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="hero__bottom" ref={statsRef}>
          <dl className="hero__stats" aria-label="At a glance">
            {HERO_STATS.map((stat) => (
              <div key={stat.label} className="hero__stat">
                <dt className="hero__statLabel mono">{stat.label}</dt>
                <StatValue value={stat.value} suffix={stat.suffix} />
                <span className="hero__statNote">{stat.note}</span>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
