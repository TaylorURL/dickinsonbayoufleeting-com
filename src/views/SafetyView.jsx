import PageHeader from "../components/PageHeader";
import SafetyContent from "../components/SafetyContent";
import CtaStrip from "../components/CtaStrip";
import { Link } from "../app/router/Link";

function SafetyView() {
  return (
    <main>
      <PageHeader
        eyebrow="Safety & compliance"
        title="Quietly serious about how we run the dock."
        subtitle="Our customers depend on us being predictable, well-insured and easy to audit. These pages describe what that looks like in practice — the training, the procedures and the paperwork."
      >
        <a className="btn btn--primary" href="#pillars" onClick={(e) => {
          e.preventDefault();
          document.getElementById("pillars")?.scrollIntoView({ behavior: "smooth", block: "start" });
        }}>
          The pillars
        </a>
        <Link className="btn btn--ghost" to="/contact">
          Request documents
        </Link>
      </PageHeader>
      <SafetyContent />
      <CtaStrip
        eyebrow="Vendor onboarding"
        title="Need certificates or our SMS summary?"
        body="Tell us which documents your team needs and we will send them straight from the office — typically the same business day."
        primary={{ label: "Request documents", to: "/contact" }}
      />
    </main>
  );
}

export default SafetyView;
