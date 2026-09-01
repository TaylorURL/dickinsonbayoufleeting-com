// Document order matters - the right-rail scroll indicator walks this list
// rather than keeping its own copy.
//
// The labels are short because the rail is narrow: the widest one is what
// decides the width the page gutter has to clear before the rail can be drawn
// at all, and a long label buys nothing a reader could not get from a short
// one sitting beside the section it names.
export const HOME_SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "yards", label: "The Yards" },
  { id: "services", label: "Services" },
];
