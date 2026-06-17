import "./styles/Hero.css";

const HERO_EYEBROW = "Texas Gulf Coast · Barge Fleeting";
const HERO_TITLE = "Premium Dock Space Leasing";
const HERO_SUBTITLE =
  "Long-term waterfront access with dedicated slip and on-site assistance.";
const HERO_BADGES = ["5 Acre Waterfront", "Dedicated Slip", "On-Site Assistance"];

function HeroSection() {
  const openInquiry = (e) => {
    e.preventDefault();
    window.dispatchEvent(new Event("inquiry:open"));
  };
  return (
    <section
      className="hero hero--video"
      aria-label="Introduction"
      id="overview"
    >
      <div className="hero__media" aria-hidden="true">
        <video
          className="hero__video"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          disablePictureInPicture
        >
          <source src="/videos/bg-video.mp4" type="video/mp4" />
        </video>
        <div className="hero__overlay" />
      </div>
      <div className="hero__inner">
        <div className="hero__panel hero__panel--minimal">
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
      </div>
    </section>
  );
}

export default HeroSection;
