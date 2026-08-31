import PagePlate from "../components/PagePlate";
import AboutStory from "../components/AboutStory";
import ServiceArea from "../components/ServiceArea";
import CtaStrip from "../components/CtaStrip";
import Button from "../components/ui/Button";
import { MAIN_ID } from "../app/constants/landmarks";
import { useSeoMeta } from "../app/hooks/useSeoMeta";

export const metadata = {
  title: "About the Company | Dickinson Bayou Fleeting",
  description:
    "Dickinson Bayou Fleeting is a small coastal fleeting company: two yards on the upper Texas Gulf Coast and a shore crew close enough to reach either dock.",
  canonical: "https://dickinsonbayoufleeting.com/about",
  openGraph: {
    title: "About the Company | Dickinson Bayou Fleeting",
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
        title="A small coastal fleeting company that picks up the phone."
        subtitle="Two yards on the upper Texas Gulf Coast, and a shore crew that lives close enough to be at either one in the time it takes you to call."
      >
        <Button variant="primary" to="/contact">
          Get in Touch
        </Button>
        <Button variant="ghost" to="/services">
          See Our Services
        </Button>
      </PagePlate>
      <AboutStory />
      <ServiceArea surface="gray" />
      <CtaStrip
        eyebrow="Visit a yard"
        title="Come and see the dock."
        body="Operators can walk either yard before signing anything. Call ahead and we will have the right person there to show you round."
      />
    </main>
  );
}

export default AboutView;
