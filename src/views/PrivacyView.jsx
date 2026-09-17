import PagePlate from "../components/page/PagePlate";
import LegalBody from "../components/sections/LegalBody";
import CtaStrip from "../components/page/CtaStrip";
import { PRIVACY_SECTIONS, PRIVACY_UPDATED } from "../app/content/legal";
import { MAIN_ID } from "../app/constants/landmarks";
import { useSeoMeta } from "../app/hooks/useSeoMeta";
import { ROUTE_META } from "../app/router/routes";

function PrivacyView() {
  useSeoMeta(ROUTE_META.privacy);
  return (
    <main id={MAIN_ID} tabIndex={-1}>
      <PagePlate
        eyebrow="Privacy"
        title="What we hold, and why."
        subtitle="Two forms, a page counter and an error log. This is the whole of it, in the order it happens."
      />
      <LegalBody
        sections={PRIVACY_SECTIONS}
        updated={PRIVACY_UPDATED}
        label="Privacy Policy"
        id="privacy-body"
      />
      <CtaStrip
        title="Want something removed?"
        body="Call the direct line and ask. There is no form for this and no ticket queue. Whoever picks up handles it."
        primary={{ label: "Get in Touch", to: "/contact" }}
      />
    </main>
  );
}

export default PrivacyView;
