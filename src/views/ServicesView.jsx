import PagePlate from "../components/PagePlate";
import ServicesList from "../components/ServicesList";
import LeasePackage from "../components/LeasePackage";
import Faq from "../components/Faq";
import CtaStrip from "../components/CtaStrip";
import Button from "../components/ui/Button";
import { MAIN_ID } from "../app/constants/landmarks";
import { useSeoMeta } from "../app/hooks/useSeoMeta";

export const metadata = {
  title: "Dock Lease Rates & Marine Services | Dickinson Bayou Fleeting",
  description:
    "Monthly lease rates for the Dickinson and Freeport yards, what each lease carries, and the seven jobs the shore crew covers on both docks.",
  canonical: "https://dickinsonbayoufleeting.com/services",
  openGraph: {
    title: "Dock Lease Rates & Marine Services | Dickinson Bayou Fleeting",
    description:
      "Monthly lease rates for the Dickinson and Freeport yards, what each lease carries, and the seven jobs the shore crew covers on both docks.",
    url: "https://dickinsonbayoufleeting.com/services",
  },
};

function ServicesView() {
  useSeoMeta(metadata);
  return (
    <main id={MAIN_ID} tabIndex={-1}>
      <PagePlate
        eyebrow="Services"
        title="Lease the dock. Use the crew as you need it."
        subtitle="What a lease at Dickinson or Freeport carries, and the seven jobs the shore crew already covers on both yards."
      >
        <Button variant="primary" to="/contact">
          Get Lease Terms
        </Button>
        <Button variant="ghost" href="#rates">
          See Lease Rates
        </Button>
      </PagePlate>
      <LeasePackage surface="light" seam={{ shape: "fade", into: "gray" }} />
      <ServicesList surface="gray" seam={{ shape: "fade", into: "light" }} />
      <Faq surface="light" seam={{ into: "dark" }} />
      <CtaStrip
        title="Take a yard, or just the service."
        body="The lease comes with the crew that works the dock. If you only need one job doing, call and we will say whether it is ours."
        primary={{ label: "Get a Written Quote", to: "/contact" }}
      />
    </main>
  );
}

export default ServicesView;
