import PagePlate from "../components/PagePlate";
import LegalBody from "../components/LegalBody";
import CtaStrip from "../components/CtaStrip";
import { TERMS_SECTIONS, TERMS_UPDATED } from "../app/constants/legal";
import { MAIN_ID } from "../app/constants/landmarks";
import { useSeoMeta } from "../app/hooks/useSeoMeta";

export const metadata = {
  title: "Terms of Use | Dickinson Bayou Fleeting",
  description:
    "These terms are the rules for use of this website. The lease itself is a separate agreement, signed for a slip or a yard at either facility.",
  canonical: "https://dickinsonbayoufleeting.com/terms",
  openGraph: {
    title: "Terms of Use | Dickinson Bayou Fleeting",
    description:
      "These terms are the rules for use of this website. The lease itself is a separate agreement, signed for a slip or a yard at either facility.",
    url: "https://dickinsonbayoufleeting.com/terms",
  },
};

function TermsView() {
  useSeoMeta(metadata);
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
        seam={{ into: "dark" }}
      />
      <CtaStrip
        title="Looking for the lease terms?"
        body="Those live in the written agreement for your facility. Call and we will send you the current one."
      />
    </main>
  );
}

export default TermsView;
