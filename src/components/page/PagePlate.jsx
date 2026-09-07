import Breadcrumbs from "./Breadcrumbs";
import OceanTopographyBackground from "./OceanTopographyBackground";
import { rise } from "../ui/Reveal";
import Seam, { INTO_LIGHT } from "../ui/Seam";
import { Container, Eyebrow } from "../ui/Layout";

// The header every route but Home opens on. The auto block margins take the
// plate's spare height, which sets the copy against the bottom edge rather
// than in the middle of the plate, so the header reads as the top of the page
// rather than as a panel with the page starting under it.
//
// svh, not the static viewport unit: that one measures the tallest the viewport
// ever gets, so a plate sized by it spends its first paint behind the browser
// chrome. The px floor is the fallback.
function PagePlate({ eyebrow, title, subtitle, children }) {
  return (
    <section
      data-plate
      data-surface="dark"
      aria-label={typeof title === "string" ? title : undefined}
      className={`relative isolate flex min-h-header flex-col items-stretch gap-0 overflow-hidden pt-plate-top text-primary [min-height:62svh] ${INTO_LIGHT}`}
    >
      <div aria-hidden="true" className="absolute inset-0 z-behind bg-bg-deep">
        <OceanTopographyBackground />
        <span className="absolute inset-0 bg-plate-scrim" />
      </div>

      {/* Each block names the slot the route placeholder holds for it, so the
          two are measured against each other rather than by eye. */}
      <Container className="relative my-auto flex flex-col items-start gap-7 pb-10">
        <div className="flex flex-col items-start gap-5">
          <Breadcrumbs data-slot="crumbs" />
          {eyebrow ? (
            <Eyebrow strong data-slot="eyebrow" className={rise()}>
              {eyebrow}
            </Eyebrow>
          ) : null}
          <h1
            data-slot="title"
            className={`min-w-0 max-w-display text-h1 ${rise(1)}`}
          >
            {title}
          </h1>
          {subtitle ? (
            <p
              data-slot="lede"
              className={`max-w-prose text-lead text-secondary ${rise(2)}`}
            >
              {subtitle}
            </p>
          ) : null}
        </div>
        {children ? (
          <div
            data-slot="actions"
            className={`flex flex-wrap gap-3 ${rise(3)}`}
          >
            {children}
          </div>
        ) : null}
      </Container>

      <Seam />
    </section>
  );
}

export default PagePlate;
