import HeroSection from "../components/Hero";
import ServiceRegister from "../components/ServiceRegister";
import YardChart from "../components/YardChart";
import Intake from "../components/Intake";
import Standing from "../components/Standing";
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
      <ServiceRegister />
      <YardChart />
      <Intake />
      <Standing />
      <CtaStrip
        eyebrow="Get in touch"
        title="Talk to someone who works the dock."
        body="The line is answered through the working day and carried on call the rest of the time. Quotes come back the same business day."
      />
    </main>
  );
}

export default HomeView;
