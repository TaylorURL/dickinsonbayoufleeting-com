// The ruled row. Services and capabilities are the same shape - an index, a
// code, a name, a body, a note and a tag - so they are laid out by one set of
// slots rather than by two grids that have to be kept in step.
//
// It reads as a stack on a phone, gains its index column once there is room
// beside the stack, and opens out into a line of a table when the whole row
// fits across.

export const ROW = [
  "relative grid items-baseline gap-x-5 gap-y-2",
  "grid-cols-[minmax(0,1fr)]",
  "xs:grid-cols-[var(--col-index)_minmax(0,1fr)] xs:gap-y-3",
  "lg:grid-cols-[var(--col-index-wide)_var(--col-code)_minmax(0,300px)_minmax(0,1fr)_auto] lg:gap-6",
].join(" ");

// The row slides under the pointer and the marker runs down its left edge.
// Laid out at full height and scaled from nothing, so the mark extends on the
// compositor rather than reflowing the list.
export const ROW_INNER =
  "transition-transform duration-settle ease-settle hover:translate-x-3 motion-reduce:transition-none";

export const ROW_MARKER =
  "after:absolute after:bottom-0 after:left-0 after:top-0 after:w-marker after:origin-center after:scale-y-0 after:bg-highlight after:transition-transform after:duration-settle after:ease-swell after:content-[''] hover:after:scale-y-100 motion-reduce:after:transition-none";

export const SLOT = {
  index:
    "hidden pl-2 xs:block xs:col-start-1 xs:row-start-1 xs:row-span-5 lg:row-span-2 lg:pl-0",
  code: "xs:col-start-2 lg:col-start-2 lg:row-start-1 lg:row-span-2",
  name: "xs:col-start-2 lg:col-start-3 lg:row-start-1",
  body: "xs:col-start-2 lg:col-start-3 lg:row-start-2",
  detail: "xs:col-start-2 lg:col-start-4 lg:row-start-1 lg:row-span-2",
  meta: "justify-self-start xs:col-start-2 lg:col-start-5 lg:row-start-1 lg:row-span-2 lg:justify-self-auto lg:pr-2",
};
