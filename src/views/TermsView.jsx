import PagePlate from "../components/page/PagePlate";
import LegalBody from "../components/sections/LegalBody";
import CtaStrip from "../components/page/CtaStrip";
import { TERMS_SECTIONS, TERMS_UPDATED } from "../app/content/legal";
import { MAIN_ID } from "../app/constants/landmarks";
import { useSeoMeta } from "../app/hooks/useSeoMeta";
import { ROUTE_META } from "../app/router/routes";

function TermsView() {
  useSeoMeta(ROUTE_META.terms);
  return (
    <main id={MAIN_ID} tabIndex={-1}>
      <PagePlate
        eyebrow="Terms"
        title="Terms of use for this website."
        subtitle="What the pages here mean and what they do not. The lease itself is a separate document, signed for the job."
      />
      <LegalBody
        sections={TERMS_SECTIONS}
        updated={TERMS_UPDATED}
        label="Terms of Use"
        id="terms-body"
      />
      <CtaStrip
        title="Looking for the lease terms?"
        body="Those live in the written agreement for your facility. Call and we will send you the current one."
      />
    </main>
  );
}

export default TermsView;
