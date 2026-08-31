import "./styles/RouteFallback.css";
import WaveDivider from "./WaveDivider";

// Stands in for a route while its chunk is in flight. It holds the shape of a
// page header at the plate's own height: the same five slots in the same
// order, each box the size of the line it stands in for, and the same closing
// wave, so nothing below moves when the real header arrives.
//
// It stays invisible for its first fraction of a second. A chunk that is
// already cached swaps in well inside that window, and a placeholder that
// appears and leaves inside two frames reads as a flicker rather than as
// loading.
function RouteFallback() {
  return (
    <div
      className="routeFallback"
      data-surface="dark"
      role="status"
      aria-label="Loading the page"
    >
      <div className="routeFallback__inner container" aria-hidden="true">
        <span className="routeFallback__bar routeFallback__bar--crumbs" />
        <span className="routeFallback__bar routeFallback__bar--eyebrow" />
        <span className="routeFallback__block routeFallback__block--title">
          <span className="routeFallback__bar routeFallback__bar--title" />
          <span className="routeFallback__bar routeFallback__bar--titleShort" />
        </span>
        <span className="routeFallback__block routeFallback__block--lead">
          <span className="routeFallback__bar routeFallback__bar--line" />
          <span className="routeFallback__bar routeFallback__bar--lineShort" />
        </span>
        <span className="routeFallback__bar routeFallback__bar--actions" />
      </div>
      <WaveDivider />
    </div>
  );
}

export default RouteFallback;
