import { useReveal } from "../../app/hooks/useReveal";

// One delay rhythm, six steps, counted off the step the config carries. The
// first six children of a staggered block take one each and everything after
// them shares the last, so a long list finishes arriving rather than trailing
// off. Eighty milliseconds is long enough to read as one thing following
// another and short enough that the sixth child has started before the reader
// has finished the first line.
const DELAY = [
  "delay-1",
  "delay-2",
  "delay-3",
  "delay-4",
  "delay-5",
  "delay-6",
];

const MOTION =
  "transition-[opacity,transform] duration-reveal ease-reveal motion-reduce:transition-none";

const SETTLED = "translate-y-0 opacity-100";
// Sixteen pixels. It is the smallest rise that still reads as arriving, and
// anything further turns a band of type into something the reader watches
// land rather than something already there to be read.
const HELD =
  "translate-y-4 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100";

// The entrance a block plays on mount rather than on scroll, counted off the
// same six steps. Step 0 is the unstaggered one. The reduced-motion escape
// rides along, because a call site that has to remember it is a call site that
// will not.
export function rise(step = 0) {
  return `animate-rise${step ? `-${step}` : ""} motion-reduce:animate-none`;
}

// The class a staggered child wears. Its state comes from the Stagger above it
// through a data attribute, which saves binding an observer per child.
export function staggerChild(index) {
  const settled =
    "group-data-[revealed=true]:translate-y-0 group-data-[revealed=true]:opacity-100";
  return `${MOTION} ${DELAY[Math.min(index, DELAY.length - 1)]} ${HELD} ${settled}`;
}

// Brings a block up as it reaches the viewport. `as` picks the element so a
// reveal can wrap a list or a row without adding a div the layout has to
// account for. It reports its state on an attribute for the same reason the
// stagger does: print scrolls nothing, so a band nobody has reached is held at
// zero opacity on paper unless a rule can find it.
//
// Nothing here runs per scroll frame. One IntersectionObserver per block fires
// once, on the way in, and the transition it switches on is composited.
export function Reveal({ as: Tag = "div", className = "", children, ...rest }) {
  const { ref, revealed } = useReveal();
  return (
    <Tag
      ref={ref}
      data-revealed={revealed}
      className={`${MOTION} ${revealed ? SETTLED : HELD} ${className}`.trim()}
      {...rest}
    >
      {children}
    </Tag>
  );
}

// The container half of the stagger. It reveals as one block and reports that
// to its children through the group, each of which counts off its own step. A
// stagger belongs inside one band: two bands counting off the same rhythm
// arrive as one long list rather than as two blocks.
export function Stagger({
  as: Tag = "div",
  className = "",
  children,
  ...rest
}) {
  const { ref, revealed } = useReveal();
  return (
    <Tag
      ref={ref}
      data-revealed={revealed}
      className={`group ${className}`.trim()}
      {...rest}
    >
      {children}
    </Tag>
  );
}
