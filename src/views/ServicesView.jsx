import PagePlate from "../components/PagePlate";
import ServicesList from "../components/ServicesList";
import LeasePackage from "../components/LeasePackage";
import Faq from "../components/Faq";
import CtaStrip from "../components/CtaStrip";
import Button from "../components/ui/Button";
import { MAIN_ID } from "../app/constants/landmarks";
import { useSeoMeta } from "../app/hooks/useSeoMeta";

export const metadata = {
  title: "Services & Lease Rates | Dickinson Bayou Fleeting",
  description:
    "Fleeting, mooring, staging and fleet support are the work of both yards. Monthly dock lease rates for San Leon and Freeport, and what each includes.",
  canonical: "https://dickinsonbayoufleeting.com/services",
  openGraph: {
    title: "Services & Lease Rates | Dickinson Bayou Fleeting",
    description:
      "Fleeting, mooring, staging and fleet support are the work of both yards. Monthly dock lease rates for San Leon and Freeport, and what each includes.",
    url: "https://dickinsonbayoufleeting.com/services",
  },
};

function ServicesView() {
  useSeoMeta(metadata);
  return (
    <main id={MAIN_ID} tabIndex={-1}>
      <PagePlate
        eyebrow="Services"
        title="Coastal barge fleeting, marine services & dock leasing."
        subtitle="Everything we offer at the San Leon and Freeport yards: what each service includes, who it is for, and how to get started."
      >
        <Button variant="primary" to="/contact">
          Request a Quote
        </Button>
        <Button variant="ghost" href="#services-detail">
          Jump to Services
        </Button>
      </PagePlate>
      <ServicesList surface="light" />
      <LeasePackage />
      <Faq surface="light" />
      <CtaStrip
        title="Describe the job and we will place it."
        body="Call and tell us what you need doing. We will say which of these covers it, or give you the name of somebody who handles the part we do not."
        primary={{ label: "Send a Request", to: "/contact" }}
      />
    </main>
  );
}

export default ServicesView;
