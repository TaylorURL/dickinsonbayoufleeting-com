import { Component } from "react";
import { PHONE_NUMBER } from "../app/constants/phoneNumber";
import Button from "./ui/Button";
import { Container } from "./ui/Layout";

// A route arrives as its own file, which means a deploy can land while a tab
// is still open: the document in that tab names files the server has just
// replaced, and the next route the reader asks for fails to fetch. Nothing
// about that is visible to the reader except a page that stops.
//
// One reload fixes it, because it fetches the new document and the new names
// with it. The flag holds that to one attempt: a chunk missing for any other
// reason would otherwise reload for as long as the tab stays open. It is
// cleared by the next route that does land.
const RELOAD_FLAG = "dbf:chunk-reload";

const MISSING_CHUNK =
  /ChunkLoadError|Loading chunk|Loading CSS chunk|dynamically imported module|module script failed/i;

function isMissingChunk(error) {
  return MISSING_CHUNK.test(`${error?.name || ""} ${error?.message || ""}`);
}

function readFlag() {
  try {
    return window.sessionStorage.getItem(RELOAD_FLAG) === "1";
  } catch (unavailable) {
    return true;
  }
}

function writeFlag(value) {
  try {
    if (value) window.sessionStorage.setItem(RELOAD_FLAG, "1");
    else window.sessionStorage.removeItem(RELOAD_FLAG);
  } catch (unavailable) {
    // Private browsing refuses the write. One reload is still worth trying;
    // it simply cannot be remembered, so readFlag treats that as spent.
  }
}

export function clearChunkReloadFlag() {
  writeFlag(false);
}

class RouteBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    if (isMissingChunk(error) && !readFlag()) {
      writeFlag(true);
      window.location.reload();
    }
  }

  componentDidUpdate(prevProps) {
    if (this.state.failed && prevProps.path !== this.props.path) {
      this.setState({ failed: false });
    }
  }

  render() {
    if (!this.state.failed) return this.props.children;
    // Sits where the page header would have been, at the same height and on
    // the same ground, so a route that fails still hands the reader a page
    // rather than a gap between the bar and the footer.
    return (
      <div
        data-surface="dark"
        className="relative flex min-h-header flex-col gap-0 bg-bg-deep bg-hull bg-hull-grid pb-10 pt-plate-top text-primary"
      >
        <Container className="my-auto flex flex-col items-start gap-4">
          <p className="font-mono text-xs font-medium uppercase tracking-eyebrow text-highlight">
            Page did not load
          </p>
          <h1 className="max-w-display text-h2 font-bold text-primary">
            Something went wrong here.
          </h1>
          <p className="max-w-prose text-lead text-secondary">
            Reload the page to try again. If it still will not open, the
            yard can answer anything the site would have told you.
          </p>
          <div className="mt-3 flex flex-wrap gap-3">
            <Button variant="primary" onClick={() => window.location.reload()}>
              Reload the Page
            </Button>
            <Button
              variant="ghost"
              href={`tel:1${PHONE_NUMBER.replace(/[^0-9]/g, "")}`}
            >
              {PHONE_NUMBER}
            </Button>
          </div>
        </Container>
      </div>
    );
  }
}

export default RouteBoundary;
