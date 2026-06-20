import PageHeader from "../components/PageHeader";
import AboutStory from "../components/AboutStory";
import ServiceArea from "../components/ServiceArea";
import CtaStrip from "../components/CtaStrip";
import { Link } from "../app/router/Link";

function AboutView() {
  return (
    <main>
      <PageHeader
        eyebrow="About"
        title="A small coastal fleeting company that picks up the phone."
        subtitle="Two yards on the upper Texas Gulf Coast, a shore crew that lives in the neighborhood, and an office that runs at the speed of a tow company — not a call center."
      >
        <Link className="btn btn--primary" to="/contact">
          Get in touch
        </Link>
        <Link className="btn btn--ghost" to="/services">
          See our services
        </Link>
      </PageHeader>
      <AboutStory />
      <ServiceArea />
      <CtaStrip
        eyebrow="Visit a yard"
        title="Want to come see the dock?"
        body="Operators are welcome to drop by either facility for a walk-through before they sign anything. Call ahead and we will line up the right person."
      />
    </main>
  );
}

export default AboutView;
