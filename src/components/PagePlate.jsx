import Breadcrumbs from "./Breadcrumbs";
import OceanTopographyBackground from "./OceanTopographyBackground";
import WaveDivider, { WAVE_INTO_LIGHT } from "./WaveDivider";
import { Container, Eyebrow } from "./ui/Layout";

// The header every route but Home opens on. The auto block margins take the
// plate's spare height, which centres the copy and leaves the wave on the
// bottom edge. Centring the pair instead splits that height either side of
// them, and the half below the wave shows as a band of plate under a seam that
// is supposed to be the end of it.
//
// svh, not the static viewport unit: that one measures the tallest the viewport
// ever gets, so a plate sized by it spends its first paint behind the browser
// chrome. The px floor is the fallback.
const RISE = (step) =>
  `animate-rise${step ? `-${step}` : ""} motion-reduce:animate-none`;

function PagePlate({ eyebrow, title, subtitle, children }) {
  return (
    <section
      data-plate
      data-surface="dark"
      aria-label={typeof title === "string" ? title : undefined}
      className={`relative isolate flex min-h-header flex-col items-stretch gap-0 overflow-hidden pt-plate-top text-primary [min-height:62svh] ${WAVE_INTO_LIGHT}`}
    >
      <div aria-hidden="true" className="absolute inset-0 z-behind bg-bg-deep">
        <OceanTopographyBackground />
        <span className="absolute inset-0 bg-plate-scrim" />
      </div>

      <Container className="relative my-auto flex flex-col items-start gap-5 pb-10">
        <Breadcrumbs />
        {eyebrow ? (
          <Eyebrow strong className={RISE()}>
            {eyebrow}
          </Eyebrow>
        ) : null}
        <h1
          className={`min-w-0 max-w-display text-h1 tracking-normal ${RISE(1)}`}
        >
          {title}
        </h1>
        {subtitle ? (
          <p className={`max-w-prose text-lead text-secondary ${RISE(2)}`}>
            {subtitle}
          </p>
        ) : null}
        {children ? (
          <div className={`mt-3 flex flex-wrap gap-3 ${RISE(3)}`}>
            {children}
          </div>
        ) : null}
      </Container>

      <WaveDivider />
    </section>
  );
}

export default PagePlate;
