import "./styles/PagePlate.css";
import Breadcrumbs from "./Breadcrumbs";
import OceanTopographyBackground from "./OceanTopographyBackground";
import WaveDivider from "./WaveDivider";

function PagePlate({ eyebrow, title, subtitle, children }) {
  return (
    <section
      className="pagePlate"
      data-surface="dark"
      aria-label={typeof title === "string" ? title : undefined}
    >
      <div className="pagePlate__bg" aria-hidden="true">
        <OceanTopographyBackground />
        <span className="pagePlate__scrim" />
      </div>
      <div className="pagePlate__inner container">
        <Breadcrumbs />
        {eyebrow && (
          <p className="eyebrow eyebrow--strong mono pagePlate__eyebrow">
            <span className="signalDot" aria-hidden="true" />
            {eyebrow}
          </p>
        )}
        <h1 className="pagePlate__title">{title}</h1>
        {subtitle && <p className="pagePlate__subtitle">{subtitle}</p>}
        {children && <div className="pagePlate__actions">{children}</div>}
      </div>
      <WaveDivider />
    </section>
  );
}

export default PagePlate;
