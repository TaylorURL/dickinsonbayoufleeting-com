import PagePlate from "../components/PagePlate";
import ContactSection from "../components/ContactSection";
import BeforeYouCall from "../components/BeforeYouCall";
import Location from "../components/Location";
import { MAIN_ID } from "../app/constants/landmarks";
import { useSeoMeta } from "../app/hooks/useSeoMeta";

export const metadata = {
  title: "Ask About a Dock Lease | Dickinson Bayou Fleeting",
  description:
    "One number covers both yards. Call it or send the form for lease terms, a yard walk, or whether a slip is open.",
  canonical: "https://dickinsonbayoufleeting.com/contact",
  openGraph: {
    title: "Ask About a Dock Lease | Dickinson Bayou Fleeting",
    description:
      "One number covers both yards. Call it or send the form for lease terms, a yard walk, or whether a slip is open.",
    url: "https://dickinsonbayoufleeting.com/contact",
  },
};

function ContactView() {
  useSeoMeta(metadata);
  return (
    <main id={MAIN_ID} tabIndex={-1}>
      <PagePlate
        eyebrow="Contact"
        title="One number for both yards."
        subtitle="Ask for lease terms, book a yard walk, or check whether a slip is open. The line is answered around the clock; the form reaches whoever is on shift."
      />
      <ContactSection seam={{ shape: "fade", into: "gray" }} />
      <BeforeYouCall seam={{ into: "dark" }} />
      <Location />
    </main>
  );
}

export default ContactView;
