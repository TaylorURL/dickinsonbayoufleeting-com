import HeroSection from "../components/Hero";
import YardChart from "../components/YardChart";
import ServiceRegister from "../components/ServiceRegister";
import Standing from "../components/Standing";
import CtaStrip from "../components/CtaStrip";
import { MAIN_ID } from "../app/constants/landmarks";
import { useSeoMeta } from "../app/hooks/useSeoMeta";

export const metadata = {
  title: "Dock Space for Lease | Dickinson Bayou Fleeting, Texas Gulf Coast",
  description:
    "Five-acre gated waterfront yards for long-term lease at Dickinson on Galveston Bay and Freeport on the GIWW. Bulkhead frontage, shore crew on site, from $4,100 a month.",
  canonical: "https://dickinsonbayoufleeting.com/",
  openGraph: {
    title: "Dock Space for Lease | Dickinson Bayou Fleeting, Texas Gulf Coast",
    description:
      "Five-acre gated waterfront yards for long-term lease at Dickinson on Galveston Bay and Freeport on the GIWW. Bulkhead frontage, shore crew on site, from $4,100 a month.",
    url: "https://dickinsonbayoufleeting.com/",
  },
};

function HomeView() {
  useSeoMeta(metadata);
  return (
    <main id={MAIN_ID} tabIndex={-1}>
      <HeroSection />
      <YardChart />
      <ServiceRegister />
      <Standing />
      <CtaStrip
        eyebrow="Next step"
        title="Walk the yard before you sign."
        body="Operators can see either dock before anything is signed. Call ahead and we will have the person who works it there to walk it with you."
      />
    </main>
  );
}

export default HomeView;
