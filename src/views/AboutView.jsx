import PagePlate from "../components/PagePlate";
import AboutStory from "../components/AboutStory";
import ServiceArea from "../components/ServiceArea";
import CtaStrip from "../components/CtaStrip";
import Button from "../components/ui/Button";
import { MAIN_ID } from "../app/constants/landmarks";
import { useSeoMeta } from "../app/hooks/useSeoMeta";

export const metadata = {
  title: "Who Runs the Yards | Dickinson Bayou Fleeting",
  description:
    "Dickinson Bayou Fleeting is a small coastal fleeting company: two yards on the upper Texas Gulf Coast and a shore crew close enough to reach either dock.",
  canonical: "https://dickinsonbayoufleeting.com/about",
  openGraph: {
    title: "Who Runs the Yards | Dickinson Bayou Fleeting",
    description:
      "Dickinson Bayou Fleeting is a small coastal fleeting company: two yards on the upper Texas Gulf Coast and a shore crew close enough to reach either dock.",
    url: "https://dickinsonbayoufleeting.com/about",
  },
};

function AboutView() {
  useSeoMeta(metadata);
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
      <ServiceArea surface="gray" seam={{ into: "dark" }} />
      <CtaStrip
        title="Come and walk the yard."
        body="Operators see either dock before signing anything. Call ahead and we will have the person who works it there to walk it with you."
        primary={{ label: "Book a Yard Walk", to: "/contact" }}
      />
    </main>
  );
}

export default AboutView;
