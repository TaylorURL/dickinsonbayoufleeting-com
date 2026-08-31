import PagePlate from "../components/PagePlate";
import ContactSection from "../components/ContactSection";
import Location from "../components/Location";
import { MAIN_ID } from "../app/constants/landmarks";
import { useSeoMeta } from "../app/hooks/useSeoMeta";

export const metadata = {
  title: "Ask About a Dock Lease | Dickinson Bayou Fleeting",
  description:
    "One number covers both yards. Call, email or send the form for lease terms, a yard walk, or slip availability.",
  canonical: "https://dickinsonbayoufleeting.com/contact",
  openGraph: {
    title: "Ask About a Dock Lease | Dickinson Bayou Fleeting",
    description:
      "One number covers both yards. Call, email or send the form for lease terms, a yard walk, or slip availability.",
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
        subtitle="Ask for lease terms, book a yard walk, or check a slip. Call any time, email through the working day, or send the form below."
      />
      <ContactSection />
      <Location />
    </main>
  );
}

export default ContactView;
