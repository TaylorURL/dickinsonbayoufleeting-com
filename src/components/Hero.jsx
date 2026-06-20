import "./styles/Hero.css";

const HERO_EYEBROW = "DBF-01 · COASTAL OPERATIONS · EST. TEXAS GULF COAST";
const HERO_TITLE_LEAD = "Coastal barge fleeting,";
const HERO_TITLE_ACCENT = "marine services";
const HERO_TITLE_TRAIL = "& waterfront dock leasing.";
const HERO_SUBTITLE =
  "Long-term barge fleeting, marine vessel mooring and dedicated slip access on the Houston Ship Channel, Gulf Intracoastal Waterway and surrounding coastal Texas waterways — serving San Leon, Dickinson, Texas City, Houston and the upper Texas Gulf Coast.";

const HERO_COORDINATES = [
  { id: "sl", label: "San Leon", value: "29.4719° N · 94.9625° W" },
  { id: "fp", label: "Freeport", value: "28.9680° N · 95.2883° W" },
];

const HERO_STATS = [
  { value: "02", label: "Coastal Facilities", suffix: "FAC" },
  { value: "05", label: "Acres / Yard", suffix: "AC" },
  { value: "24/7", label: "Site Presence", suffix: "OPS" },
  { value: "100%", label: "Direct Waterfront", suffix: "ACC" },
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
        <video
          className="hero__media"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/images/DBF-Icon.png"
        >
          <source src="/videos/bg-video.mp4" type="video/mp4" />
        </video>
        <span className="hero__scrim" />
        <span className="hero__vignette" />
        <HeroMarks />
      </div>

      <div className="hero__frame container">
        <div className="hero__topMeta">
          <span className="hero__topMetaItem mono">
            <span className="hero__metaDot" aria-hidden="true" />
            LIVE · COASTAL OPERATIONS
          </span>
          <span className="hero__topMetaItem mono">
            HOUSTON SHIP CHANNEL · GIWW
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
            <a className="btn btn--primary" href="#location">
              View Facilities
            </a>
            <a className="btn btn--ghost" href="#contact" onClick={openInquiry}>
              Request Lease Quote
            </a>
          </div>
        </div>

        <div className="hero__sidebar" aria-hidden="true">
          <span className="hero__sidebarLabel mono">N 29°28'19"</span>
          <span className="hero__sidebarRule" />
          <span className="hero__sidebarLabel mono">W 94°57'45"</span>
        </div>

        <div className="hero__bottom">
          <dl className="hero__stats" aria-label="At a glance">
            {HERO_STATS.map((stat) => (
              <div key={stat.label} className="hero__stat">
                <dt className="hero__statLabel mono">
                  <span className="hero__statSuffix">{stat.suffix}</span>
                  {stat.label}
                </dt>
                <dd className="hero__statValue tabular">{stat.value}</dd>
              </div>
            ))}
          </dl>
          <ul className="hero__coords" aria-label="Facility coordinates">
            {HERO_COORDINATES.map((c) => (
              <li key={c.id} className="hero__coord">
                <span className="hero__coordLabel mono">{c.label}</span>
                <span className="hero__coordValue mono tabular">{c.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
