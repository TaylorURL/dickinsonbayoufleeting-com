import PagePlate from "../components/page/PagePlate";
import AboutStory from "../components/sections/AboutStory";
import ServiceArea from "../components/sections/ServiceArea";
import CtaStrip from "../components/page/CtaStrip";
import Button from "../components/ui/Button";
import { MAIN_ID } from "../app/constants/landmarks";
import { useSeoMeta } from "../app/hooks/useSeoMeta";
import { ROUTE_META } from "../app/router/routes";

function AboutView() {
  useSeoMeta(ROUTE_META.about);
  return (
    <main id={MAIN_ID} tabIndex={-1}>
      <PagePlate
        eyebrow="About"
        title="The people who will be on your dock."
        subtitle="Two yards on the upper Texas Gulf Coast, and a shore crew already on site at both of them."
      >
        <Button variant="primary" to="/contact">
          Get Lease Terms
        </Button>
        <Button variant="ghost" to="/services">
          See All Services
        </Button>
      </PagePlate>
      <AboutStory />
      <ServiceArea />
      <CtaStrip
        title="Come and walk the yard."
        body="Operators see either dock before signing anything. Call ahead and we will have the person who works it there to walk it with you."
        primary={{ label: "Book a Yard Walk", to: "/contact" }}
      />
    </main>
  );
}

export default AboutView;
