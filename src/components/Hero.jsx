import "./styles/Hero.css";

const HERO_EYEBROW =
  "San Leon · Dickinson · Houston Ship Channel · Galveston Bay · Upper Texas Gulf Coast";
const HERO_TITLE =
  "Coastal Barge Fleeting, Marine Services & Waterfront Dock Leasing on Galveston Bay";
const HERO_SUBTITLE =
  "Long-term barge fleeting, marine vessel mooring and dedicated slip access on the Houston Ship Channel, Gulf Intracoastal Waterway and surrounding coastal Texas waterways — serving San Leon, Dickinson, Texas City, Houston and the upper Texas Gulf Coast.";
const HERO_BADGES = [
  "Galveston Bay Frontage",
  "Coastal Texas Marine Terminal",
  "5-Acre Waterfront Yards",
  "Dedicated Barge Slips",
  "On-Site Fleeting & Marine Crew",
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
      <g className="hero__contourLines" fill="none" strokeWidth="1.4">
        <path d="M-40 120 C 220 60, 420 200, 660 150 S 1040 40, 1260 130" />
        <path d="M-40 210 C 240 150, 440 290, 680 235 S 1060 130, 1260 215" />
        <path d="M-40 300 C 260 235, 460 380, 700 320 S 1080 215, 1260 300" />
        <path d="M-40 400 C 260 340, 480 470, 720 415 S 1100 320, 1260 400" />
        <path d="M-40 500 C 280 445, 500 560, 740 505 S 1120 415, 1260 495" />
        <path d="M-40 600 C 300 545, 520 650, 760 600 S 1140 510, 1260 590" />
      </g>
      <g className="hero__contourLines hero__contourLines--strong" fill="none" strokeWidth="1.6">
        <path d="M-40 255 C 250 195, 450 335, 690 280 S 1070 175, 1260 258" />
        <path d="M-40 450 C 270 392, 490 515, 730 460 S 1110 368, 1260 448" />
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
      </div>
      <div className="hero__inner container">
        <p className="eyebrow hero__eyebrow">{HERO_EYEBROW}</p>
        <h1 className="hero__title">{HERO_TITLE}</h1>
        <p className="hero__subtitle">{HERO_SUBTITLE}</p>
        <ul className="hero__badges" aria-label="Key features">
          {HERO_BADGES.map((badge) => (
            <li key={badge} className="hero__badge">
              {badge}
            </li>
          ))}
        </ul>
        <div className="hero__actions">
          <a className="btn btn--primary" href="#location">
            View Location
          </a>
          <a className="btn btn--ghost" href="#contact" onClick={openInquiry}>
            Lease Inquiry
          </a>
        </div>
      </div>
      <span className="hero__fade" aria-hidden="true" />
    </section>
  );
}

export default HeroSection;
