import PagePlate from "../components/page/PagePlate";
import ServicesRegister from "../components/sections/ServicesRegister";
import LeasePackage from "../components/sections/LeasePackage";
import Faq from "../components/sections/Faq";
import CtaStrip from "../components/page/CtaStrip";
import Button from "../components/ui/Button";
import { MAIN_ID } from "../app/constants/landmarks";
import { useSeoMeta } from "../app/hooks/useSeoMeta";
import { ROUTE_META } from "../app/router/routes";

function ServicesView() {
  useSeoMeta(ROUTE_META.services);
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
      <LeasePackage surface="light" />
      <ServicesRegister surface="dark" />
      <Faq surface="light" />
      <CtaStrip
        title="Take a yard, or just the service."
        body="The lease comes with the crew that works the dock. If you only need one job doing, call and we will say whether it is ours."
        primary={{ label: "Get a Written Quote", to: "/contact" }}
      />
    </main>
  );
}

export default ServicesView;
