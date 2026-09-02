import Seam from "./ui/Seam";
import { Container } from "./ui/Layout";

// Stands in for a route while its chunk is in flight. It holds the four slots
// every page header has - trail, eyebrow, title, lede - each box the size of
// the line it stands in for, in the same container the header itself uses, so
// nothing moves when the real one lands.
//
// The wrapper stands a whole viewport tall because the shell renders the footer
// before a route's chunk arrives. At a header's height the footer lands on
// screen and the route pushes it the length of the page the moment it loads; a
// wrapper that fills the fold keeps the footer under it, where a push costs the
// reader nothing.
//
// A viewport on its own is a wave short of that. The footer opens on a seam
// pulled up over whatever it follows, so the top of the footer sits one wave
// above the end of this box and that much of it is on screen waiting to be
// pushed off. The wave is added back here, and the whole of the footer is then
// under the fold where the push is free.
//
// The paint is inset inside each box, which is what keeps a heading reading as
// a line of type instead of a slab.
const PLACEHOLDER_BAR =
  "block box-border border-l-2 border-hairline bg-layer-2 bg-clip-content";
// Each box is one line at the step it stands in for, measured in line boxes
// rather than in pixels: a height worked out as size times leading is a
// fraction off whatever the browser rounds the line box to, and four bars each
// a pixel out is a page that nudges when the route lands. Every bar carries the
// face and size of the line it replaces, so lh resolves against that step.
const SLOT = {
  crumbs: "font-body text-2xs h-[1lh]",
  eyebrow: "font-body text-xs h-[1lh]",
  // The title and the lede each wrap to two lines at the measure they are
  // capped to, so each stands in as one box of that height rather than as two
  // boxes of one line. One placeholder for one element is what keeps the box,
  // the count and the position all reading against the same thing.
  title: "font-condensed text-h1 h-[2lh]",
  lede: "font-body text-lead h-[2lh]",
  // The row of buttons some headers carry. Its height is the control's, and
  // the margin above it is the one the header sets.
  actions: "h-action",
};

// The plate's two measures are written in em and ch, so each resolves against
// the type it caps. A block set in body text would cap the heading at a
// fraction of its real width, so each bar carries the face and size of the
// line it stands in for as well as its height. The bars are siblings of each
// other rather than each in a wrapper, because a wrapper is a box with its own
// gap and the header's blocks are spaced by one.
function RouteFallback({ actions = false }) {
  return (
    <div
      data-surface="dark"
      role="status"
      aria-busy="true"
      aria-label="Loading the page"
      className="flex min-h-plate flex-col [min-height:calc(100svh+theme(spacing.wave))]"
    >
      {/* The plate is the same box as the real page header - same ground, same
          top padding, same height - so nothing on screen moves when the route
          lands. */}
      <div
        data-plate
        className="relative flex min-h-header flex-col gap-0 bg-bg-deep bg-hull bg-hull-grid pt-plate-top [min-height:62svh]"
      >
        {/* The same two groups the header stacks - the head, then the actions
            under it - at the same two steps, so the reader's eye lands in one
            place before the chunk arrives and stays there after. */}
        <Container
          aria-hidden="true"
          className="my-auto flex animate-arrive flex-col items-start gap-7 pb-10 motion-reduce:animate-none"
        >
          <span className="flex w-full flex-col items-start gap-5">
            <span
              data-loading
              data-slot="crumbs"
              className={`${PLACEHOLDER_BAR} ${SLOT.crumbs} w-[108px]`}
            />
            <span
              data-loading
              data-slot="eyebrow"
              className={`${PLACEHOLDER_BAR} ${SLOT.eyebrow} w-[84px]`}
            />
            <span
              data-loading
              data-slot="title"
              className={`${PLACEHOLDER_BAR} ${SLOT.title} w-full max-w-display`}
            />
            <span
              data-loading
              data-slot="lede"
              className={`${PLACEHOLDER_BAR} bg-layer-1 ${SLOT.lede} w-full max-w-prose`}
            />
          </span>
          {actions ? (
            <span
              data-loading
              data-slot="actions"
              className={`${PLACEHOLDER_BAR} ${SLOT.actions} w-[186px]`}
            />
          ) : null}
        </Container>
        <Seam />
      </div>
    </div>
  );
}

export default RouteFallback;
