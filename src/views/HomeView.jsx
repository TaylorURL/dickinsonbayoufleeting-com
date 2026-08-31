import HeroSection from "../components/Hero";
import ServicesPreview from "../components/ServicesPreview";
import LeasePackage from "../components/LeasePackage";
import Amenities from "../components/Amenities";
import ServiceArea from "../components/ServiceArea";
import Location from "../components/Location";
import CtaStrip from "../components/CtaStrip";
import { MAIN_ID } from "../app/constants/landmarks";
import { useSeoMeta } from "../app/hooks/useSeoMeta";

export const metadata = {
  title: "Barge Fleeting & Dock Leasing | Dickinson Bayou Fleeting",
  description:
    "Dickinson Bayou Fleeting is a barge fleeting and dock leasing company with yards on Galveston Bay and the Gulf Intracoastal Waterway.",
  canonical: "https://dickinsonbayoufleeting.com/",
  openGraph: {
    title: "Barge Fleeting & Dock Leasing | Dickinson Bayou Fleeting",
    description:
      "Dickinson Bayou Fleeting is a barge fleeting and dock leasing company with yards on Galveston Bay and the Gulf Intracoastal Waterway.",
    url: "https://dickinsonbayoufleeting.com/",
  },
};

function HomeView() {
  useSeoMeta(metadata);
  return (
    <main id={MAIN_ID} tabIndex={-1}>
      <HeroSection />
      <ServicesPreview />
      <LeasePackage />
      <Amenities />
      <ServiceArea />
      <Location />
      <CtaStrip
        eyebrow="Get in touch"
        title="Talk to the operations desk."
        body="Someone answers the direct line during the working day and the on-call line the rest of the time. Quotes come back the same business day."
      />
    </main>
  );
}

export default HomeView;
