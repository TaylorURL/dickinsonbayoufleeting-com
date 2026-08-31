// The drawn plates under public/art, reached through one component so a plate
// can serve a section here and a panel elsewhere without being drawn twice.
//
// They are one set rather than four drawings: the same viewBox, the same
// horizon at the same height, the same seven colours. Two of them on one page
// read as two views of the same water. What they show is the thing the yard
// actually does; a photograph would show one afternoon at one dock, and a
// library glyph would show a boat that could belong to anyone.
//
// A plate is fetched as its own document, so it cannot reach the page's custom
// properties and each file carries the seven values itself. Every fill in a
// plate names the token it was taken from, in the style block at the top of the
// file, which is the only place a plate's colour is decided.
const PLATES = {
  fleeting:
    "Barges made fast alongside a fleeting wall, mooring wires run to the bollards",
  dock: "A leased dock: bulkhead and cap, bollards along it, pilings driven on the bay side, and a gangway down to the landing",
  towboat: "A towboat made up to a loaded hopper barge, pushing",
  channel:
    "A marked channel through the bay, a triangular day mark to port and a square one to starboard, with a tow standing between them",
};

// The plate is sized off the column it lands in rather than the window, and it
// declares its box so nothing moves when the file arrives.
function Plate({ name, className = "" }) {
  return (
    <img
      src={`/art/${name}.svg`}
      alt={PLATES[name]}
      width="800"
      height="350"
      loading="lazy"
      decoding="async"
      className={`block h-auto w-full border border-border ${className}`.trim()}
    />
  );
}

export default Plate;
