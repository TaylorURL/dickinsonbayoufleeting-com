import { useReveal } from "../../app/hooks/useReveal";

// One delay rhythm, four steps. The first four children of a staggered block
// count these off and everything after them shares the last, so a long list
// finishes arriving rather than trailing off. Every child has started inside
// 160ms: a stagger a reader can outscroll reads as the page catching up with
// them rather than greeting them.
const DELAY = ["delay-1", "delay-2", "delay-3", "delay-4"];

const MOTION =
  "transition-[opacity,transform] duration-settle ease-swell motion-reduce:transition-none";

const SETTLED = "translate-y-0 opacity-100";
const HELD =
  "translate-y-6 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100";

// The entrance a block plays on arrival, counted off the same four steps as
// the stagger. Step 0 is the unstaggered one. The reduced-motion escape rides
// along, because a call site that has to remember it is a call site that will
// not.
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
// account for.
export function Reveal({ as: Tag = "div", className = "", children, ...rest }) {
  const { ref, revealed } = useReveal();
  return (
    <Tag
      ref={ref}
      className={`${MOTION} ${revealed ? SETTLED : HELD} ${className}`.trim()}
      {...rest}
    >
      {children}
    </Tag>
  );
}

// The container half of the stagger. It reveals as one block and reports that
// to its children through the group, each of which counts off its own step.
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

export default Reveal;
