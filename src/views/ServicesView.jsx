import PageHeader from "../components/PageHeader";
import ServicesList from "../components/ServicesList";
import LeasePackage from "../components/LeasePackage";
import Faq from "../components/Faq";
import CtaStrip from "../components/CtaStrip";
import { Link } from "../app/router/Link";

function scrollToServices(e) {
  e.preventDefault();
  document
    .getElementById("services-detail")
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function ServicesView() {
  return (
    <main>
      <PageHeader
        eyebrow="Services"
        title="Coastal barge fleeting, marine services & dock leasing."
        subtitle="Everything we offer at the San Leon and Freeport yards — what each service includes, who it is for, and how to get started."
      >
        <Link className="btn btn--primary" to="/contact">
          Request a quote
        </Link>
        <a className="btn btn--ghost" href="#services-detail" onClick={scrollToServices}>
          Jump to services
        </a>
      </PageHeader>
      <ServicesList surface="light" />
      <LeasePackage />
      <Faq surface="light" />
      <CtaStrip
        title="Not sure which service fits?"
        body="Give us a call and describe the job — we will tell you which of our services applies (or recommend a partner if it is outside our scope)."
        primary={{ label: "Send a request", to: "/contact" }}
      />
    </main>
  );
}

export default ServicesView;
