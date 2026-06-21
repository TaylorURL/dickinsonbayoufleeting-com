import { useEffect, useRef } from "react";
import "./styles/Hero.css";
import OceanTopographyBackground from "./OceanTopographyBackground";
import WaveDivider from "./WaveDivider";
import { useReveal } from "../app/hooks/useReveal";
import { useCountUp } from "../app/hooks/useCountUp";
import { Link } from "../app/router/Link";
import { PHONE_NUMBER } from "../app/constants/phoneNumber";

const HERO_EYEBROW = "Dickinson Bayou Fleeting · Texas Gulf Coast";
const HERO_TITLE_LEAD = "Coastal barge fleeting,";
const HERO_TITLE_ACCENT = "marine services";
const HERO_TITLE_TRAIL = "& waterfront dock leasing.";
const HERO_SUBTITLE =
  "Long-term barge fleeting, vessel mooring and dedicated slip access on Galveston Bay, the Houston Ship Channel and the Gulf Intracoastal Waterway — built around the upper Texas Gulf Coast and the towboat crews that run it.";

/* The right-side credibility cluster — facility coordinates, hard
 * operational stats and the direct line. Anchors the composition so
 * the hero never reads as a half-finished page. */
const HERO_FACILITIES = [
  {
    code: "F-01",
    name: "San Leon",
    region: "Galveston Bay · Houston Ship Channel",
    coord: "29.479° N · 94.918° W",
  },
  {
    code: "F-02",
    name: "Freeport",
    region: "Gulf Intracoastal Waterway",
    coord: "28.948° N · 95.341° W",
  },
];

const HERO_STATS = [
  { value: 2, suffix: "", label: "Coastal facilities" },
  { value: 10, suffix: " ac", label: "Waterfront acreage" },
  { value: 24, suffix: "/7", label: "Shore operations" },
  { value: 100, suffix: "%", label: "Direct waterfront" },
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
  const { ref, display } = useCountUp(value, { duration: 1600 });
  return (
    <dd className="hero__statValue tabular" ref={ref}>
      {display}
      {suffix ? <span className="hero__statSuffix">{suffix}</span> : null}
    </dd>
  );
}

/* Subtle parallax on the ocean plate. The plate moves at ~28% of scroll
 * speed up to the hero's height, then pins — gives a clear water-drift
 * feel without breaking layout. Bails on prefers-reduced-motion. */
function useHeroParallax(rootRef) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced) return;
    const plate = root.querySelector(".hero__bg");
    if (!plate) return;

    let ticking = false;
    const update = () => {
      ticking = false;
      const rect = root.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const offset = Math.max(0, -rect.top);
      const cap = root.offsetHeight;
      const y = Math.min(offset, cap) * 0.28;
      plate.style.transform = `translate3d(0, ${y}px, 0)`;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
    };
  }, [rootRef]);
}

function HeroSection() {
  const rootRef = useRef(null);
  const openInquiry = (e) => {
    e.preventDefault();
    window.dispatchEvent(new Event("inquiry:open"));
  };
  const consoleRef = useReveal();
  useHeroParallax(rootRef);

  const telHref = `tel:1${PHONE_NUMBER.replace(/[^0-9]/g, "")}`;

  return (
    <section
      ref={rootRef}
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
            <span className="signalDot" aria-hidden="true" />
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
            <span className="hero__titleLine">{HERO_TITLE_LEAD}</span>
            <span className="hero__titleLine">
              <span className="hero__titleAccent">{HERO_TITLE_ACCENT}</span>{" "}
              {HERO_TITLE_TRAIL}
            </span>
          </h1>
          <p className="hero__subtitle">{HERO_SUBTITLE}</p>
          <div className="hero__actions">
            <a className="btn btn--primary" href="#contact" onClick={openInquiry}>
              Request a Quote
            </a>
            <Link className="btn btn--ghost" to="/services">
              Explore Services
            </Link>
          </div>
        </div>

        <aside
          className="hero__console hullPlate"
          aria-label="Operations console"
          ref={consoleRef}
        >
          <span className="hero__consoleTickTL" aria-hidden="true" />
          <span className="hero__consoleTickTR" aria-hidden="true" />
          <span className="hero__consoleTickBL" aria-hidden="true" />
          <span className="hero__consoleTickBR" aria-hidden="true" />

          <header className="hero__consoleHeader">
            <span className="hero__consoleTag mono">
              <span className="signalDot" aria-hidden="true" />
              Live operations
            </span>
            <span className="hero__consoleMeta mono">CH 16 · 24/7</span>
          </header>

          <ul className="hero__facilities" aria-label="Facilities">
            {HERO_FACILITIES.map((f) => (
              <li key={f.code} className="hero__facility">
                <span className="hero__facilityCode mono">{f.code}</span>
                <span className="hero__facilityName">{f.name}</span>
                <span className="hero__facilityRegion mono">{f.region}</span>
                <span className="hero__facilityCoord mono tabular">
                  {f.coord}
                </span>
              </li>
            ))}
          </ul>

          <dl className="hero__stats" aria-label="At a glance">
            {HERO_STATS.map((stat) => (
              <div key={stat.label} className="hero__stat">
                <dt className="hero__statLabel mono">{stat.label}</dt>
                <StatValue value={stat.value} suffix={stat.suffix} />
              </div>
            ))}
          </dl>

          <a className="hero__directLine" href={telHref}>
            <span className="hero__directLabel mono">Direct line</span>
            <span className="hero__directNumber tabular">{PHONE_NUMBER}</span>
            <span className="hero__directArrow mono" aria-hidden="true">
              →
            </span>
          </a>
        </aside>
      </div>
      <WaveDivider />
    </section>
  );
}

export default HeroSection;
