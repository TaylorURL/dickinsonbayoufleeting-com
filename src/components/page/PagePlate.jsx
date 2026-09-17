import Breadcrumbs from "./Breadcrumbs";
import Film, { PLATE_FILM } from "../ui/Film";
import { rise } from "../ui/Reveal";
import { Container, Eyebrow } from "../ui/Layout";

// The header every route but Home opens on: the channel footage under the same
// wash the hero reads through, and the page's own name over it.
//
// The copy is centred in the plate rather than pushed to one edge, so a plate
// carrying two buttons starts its breadcrumb higher than one carrying none and
// both read as the same header. Top-aligning leaves the pages with no actions -
// Privacy, Terms - with a hundred and twenty pixels of empty film under the
// lede.
function PagePlate({ eyebrow, title, subtitle, children }) {
  return (
    <section
      data-plate
      data-surface="dark"
      aria-label={typeof title === "string" ? title : undefined}
      className="relative isolate flex min-h-plate-page flex-col justify-center overflow-hidden pb-7 pt-plate-top text-primary md:pb-9"
    >
      <div aria-hidden="true" className="absolute inset-0 z-behind bg-bg-deep">
        <Film film={PLATE_FILM} />
        <span className="absolute inset-0 bg-plate-scrim" />
      </div>

      {/* Each block names the slot the route placeholder holds for it, so the
          two are measured against each other rather than by eye. */}
      <Container className="relative flex flex-col items-start gap-4 md:gap-5">
        <Breadcrumbs data-slot="crumbs" />
        {eyebrow ? (
          <Eyebrow data-slot="eyebrow" className={rise()}>
            {eyebrow}
          </Eyebrow>
        ) : null}
        <h1
          data-slot="title"
          className={`m-0 min-w-0 max-w-plate-title text-h1-mobile md:text-h1 ${rise(1)}`}
        >
          {title}
        </h1>
        {subtitle ? (
          <p
            data-slot="lede"
            className={`m-0 max-w-plate-lede text-lead-mobile text-secondary md:text-lead ${rise(2)}`}
          >
            {subtitle}
          </p>
        ) : null}
        {children ? (
          <div
            data-slot="actions"
            className={`flex w-full flex-col gap-3 pt-2 xs:w-auto xs:flex-row xs:items-center ${rise(3)}`}
          >
            {children}
          </div>
        ) : null}
      </Container>
    </section>
  );
}

export default PagePlate;
