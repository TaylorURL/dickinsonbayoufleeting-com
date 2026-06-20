import "./styles/Hero.css";

const HERO_EYEBROW = "Established · Coastal Texas Gulf Operations";
const HERO_LOCATIONS = "San Leon · Dickinson · Freeport · Houston Ship Channel";
const HERO_TITLE_LEAD = "Coastal Barge Fleeting,";
const HERO_TITLE_ACCENT = "Marine Services";
const HERO_TITLE_TRAIL = "& Waterfront Dock Leasing.";
const HERO_SUBTITLE =
  "Long-term barge fleeting, marine vessel mooring and dedicated slip access on the Houston Ship Channel, Gulf Intracoastal Waterway and surrounding coastal Texas waterways — serving San Leon, Dickinson, Texas City, Houston and the upper Texas Gulf Coast.";
const HERO_BADGES = [
  "Galveston Bay Frontage",
  "5-Acre Waterfront Yards",
  "Dedicated Barge Slips",
  "On-Site Marine Crew",
];
const HERO_STATS = [
  { value: "2", label: "Coastal Facilities" },
  { value: "5", label: "Acres per Yard" },
  { value: "24/7", label: "On-Site Presence" },
];

/**
 * Decorative nautical depth-contour motif rendered behind the hero copy.
 * Purely presentational — hidden from assistive tech.
 */
function HeroContours() {
  return (
    <svg
      className="hero__contours"
      viewBox="0 0 1200 700"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <g className="hero__contourLines" fill="none" strokeWidth="1.3">
        <path d="M-40 110 C 220 50, 420 190, 660 140 S 1040 30, 1260 120" />
        <path d="M-40 195 C 240 135, 440 275, 680 220 S 1060 115, 1260 200" />
        <path d="M-40 285 C 260 220, 460 365, 700 305 S 1080 200, 1260 285" />
        <path d="M-40 385 C 260 325, 480 455, 720 400 S 1100 305, 1260 385" />
        <path d="M-40 485 C 280 430, 500 545, 740 490 S 1120 400, 1260 480" />
        <path d="M-40 585 C 300 530, 520 635, 760 585 S 1140 495, 1260 575" />
      </g>
      <g
        className="hero__contourLines hero__contourLines--strong"
        fill="none"
        strokeWidth="1.6"
      >
        <path d="M-40 240 C 250 180, 450 320, 690 265 S 1070 160, 1260 243" />
        <path d="M-40 435 C 270 377, 490 500, 730 445 S 1110 353, 1260 433" />
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
    <section className="hero" aria-label="Introduction" id="overview">
      <div className="hero__bg" aria-hidden="true">
        <HeroContours />
        <span className="hero__horizon" />
        <span className="hero__horizon hero__horizon--lower" />
      </div>
      <div className="hero__inner container">
        <p className="eyebrow hero__eyebrow">{HERO_EYEBROW}</p>
        <h1 className="hero__title">
          {HERO_TITLE_LEAD}{" "}
          <span className="hero__titleAccent">{HERO_TITLE_ACCENT}</span>{" "}
          {HERO_TITLE_TRAIL}
        </h1>
        <p className="hero__subtitle">{HERO_SUBTITLE}</p>
        <p className="hero__locations" aria-hidden="true">
          <span className="hero__locationsBar" />
          {HERO_LOCATIONS}
        </p>
        <ul className="hero__badges" aria-label="Key features">
          {HERO_BADGES.map((badge) => (
            <li key={badge} className="hero__badge">
              {badge}
            </li>
          ))}
        </ul>
        <div className="hero__actions">
          <a className="btn btn--primary" href="#location">
            View Facilities
          </a>
          <a className="btn btn--ghost" href="#contact" onClick={openInquiry}>
            Request a Lease Quote
          </a>
        </div>
        <dl className="hero__stats" aria-label="At a glance">
          {HERO_STATS.map((stat) => (
            <div key={stat.label} className="hero__stat">
              <dt className="hero__statLabel">{stat.label}</dt>
              <dd className="hero__statValue tabular">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </div>
      <span className="hero__fade" aria-hidden="true" />
    </section>
  );
}

export default HeroSection;
