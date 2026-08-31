import WaveDivider from "./WaveDivider";
import { Container } from "./ui/Layout";

// Stands in for a route while its chunk is in flight. It holds the four slots
// every page header has - trail, eyebrow, title, lede - each box the size of
// the line it stands in for, in the same container and under the same closing
// wave.
//
// The actions row is not among them. Two of the six routes carry one and four
// do not, so reserving it would put a box on screen that most pages never fill.
// The plate's own height covers the difference either way.
//
// The wrapper stands a whole viewport tall because the shell renders the footer
// before a route's chunk arrives. At a header's height the footer lands on
// screen and the route pushes it the length of the page the moment it loads; a
// wrapper that fills the fold keeps the footer under it, where a push costs the
// reader nothing.
//
// The paint is inset inside each box, which is what keeps a heading reading as
// a line of type instead of a slab.
const BAR =
  "block box-border border-l-2 border-hairline bg-layer-2 bg-clip-content";
// Each box is one line at the step it stands in for. The heights come off the
// same table the type is set from, so a change to the scale moves the
// placeholder with it rather than leaving it a few pixels out.
const SLOT = {
  crumbs: "h-line-2xs",
  eyebrow: "h-line-xs",
  title: "h-line-h1",
  lede: "h-line-lead",
};

const LINE = `${BAR} bg-layer-1 py-1 ${SLOT.lede}`;

// The plate's two measures are written in em and ch, so each resolves against
// the type it caps. A block set in body text would cap the heading at a
// fraction of its real width, so each block carries the face and size of the
// line it stands in for.
function RouteFallback() {
  return (
    <div
      data-surface="dark"
      role="status"
      aria-label="Loading the page"
      className="flex min-h-plate flex-col [min-height:100svh]"
    >
      {/* The plate is the same box as the real page header - same ground, same
          top padding, same height - so nothing on screen moves when the route
          lands. */}
      <div
        data-plate
        className="relative flex min-h-header flex-col gap-0 bg-bg-deep bg-hull bg-hull-grid pt-plate-top [min-height:62svh]"
      >
        <Container
          aria-hidden="true"
          className="my-auto flex animate-arrive flex-col items-start gap-5 pb-10 motion-reduce:animate-none"
        >
          <span className={`${BAR} ${SLOT.crumbs} w-[136px]`} />
          <span className={`${BAR} ${SLOT.eyebrow} w-[167px]`} />
          <span className="flex w-full max-w-display flex-col gap-0 font-condensed text-h1">
            <span className={`${BAR} ${SLOT.title} w-[86%]`} />
          </span>
          <span className="flex w-full max-w-prose flex-col gap-0 font-body text-lead">
            <span className={`${LINE} w-full`} />
            <span className={`${LINE} w-[63%]`} />
          </span>
        </Container>
        <WaveDivider />
      </div>
    </div>
  );
}

export default RouteFallback;
