import HeroSection from "../components/sections/Hero";
import YardChart from "../components/sections/YardChart";
import HomeRegister from "../components/sections/HomeRegister";
import Standing from "../components/sections/Standing";
import CtaStrip from "../components/page/CtaStrip";
import { MAIN_ID } from "../app/constants/landmarks";
import { useSeoMeta } from "../app/hooks/useSeoMeta";
import { ROUTE_META } from "../app/router/routes";

function HomeView() {
  useSeoMeta(ROUTE_META.home);
  return (
    <main id={MAIN_ID} tabIndex={-1}>
      <HeroSection />
      <YardChart />
      <HomeRegister />
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
