import HeroSection from "../components/sections/Hero";
import YardChart from "../components/sections/YardChart";
import ServiceRegister from "../components/sections/ServiceRegister";
import Standing from "../components/sections/Standing";
import CtaStrip from "../components/page/CtaStrip";
import { MAIN_ID } from "../app/constants/landmarks";
import { useSeoMeta } from "../app/hooks/useSeoMeta";

export const metadata = {
  title: "Dock Space for Lease | Dickinson Bayou Fleeting, Texas Gulf Coast",
  description:
    "Five-acre gated waterfront yards, long-term lease: Dickinson on Galveston Bay, Freeport on the GIWW. Bulkhead frontage, shore crew on site, from $4,100 a month.",
  canonical: "https://dickinsonbayoufleeting.com/",
  openGraph: {
    title: "Dock Space for Lease | Dickinson Bayou Fleeting, Texas Gulf Coast",
    description:
      "Five-acre gated waterfront yards, long-term lease: Dickinson on Galveston Bay, Freeport on the GIWW. Bulkhead frontage, shore crew on site, from $4,100 a month.",
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
        title="Walk the yard before you sign."
        body="Operators can see either dock before anything is signed. Call ahead and we will have the person who works it there to walk it with you."
        primary={{ label: "Book a Yard Walk", to: "/contact" }}
      />
    </main>
  );
}

export default HomeView;
