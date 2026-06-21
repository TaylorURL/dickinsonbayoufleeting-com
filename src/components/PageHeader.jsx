import "./styles/PageHeader.css";
import OceanTopographyBackground from "./OceanTopographyBackground";
import WaveDivider from "./WaveDivider";

/* Shared page-level intro for non-home routes — keeps the cinematic
 * dark band the user expects from the brand, but is shorter and less
 * dense than the home hero. The bottom edge bites into the next
 * section with a wave divider. */
function PageHeader({ eyebrow, title, subtitle, children }) {
  return (
    <section
      className="pageHeader"
      data-surface="dark"
      aria-label={typeof title === "string" ? title : undefined}
    >
      <div className="pageHeader__bg" aria-hidden="true">
        <OceanTopographyBackground />
        <span className="pageHeader__scrim" />
      </div>
      <div className="pageHeader__inner container">
        {eyebrow && (
          <p className="eyebrow eyebrow--strong mono pageHeader__eyebrow">
            <span className="signalDot" aria-hidden="true" />
            {eyebrow}
          </p>
        )}
        <h1 className="pageHeader__title">{title}</h1>
        {subtitle && <p className="pageHeader__subtitle">{subtitle}</p>}
        {children && <div className="pageHeader__actions">{children}</div>}
      </div>
      <WaveDivider />
    </section>
  );
}

export default PageHeader;
