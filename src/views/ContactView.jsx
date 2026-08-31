import PagePlate from "../components/PagePlate";
import ContactSection from "../components/ContactSection";
import Location from "../components/Location";
import { MAIN_ID } from "../app/constants/landmarks";
import { useSeoMeta } from "../app/hooks/useSeoMeta";

export const metadata = {
  title: "Contact Dickinson Bayou Fleeting | Barge Fleeting, Texas Gulf Coast",
  description:
    "One number covers both yards. Call, email or send the form for slip availability, lease rates and site visits.",
  canonical: "https://dickinsonbayoufleeting.com/contact",
  openGraph: {
    title:
      "Contact Dickinson Bayou Fleeting | Barge Fleeting, Texas Gulf Coast",
    description:
      "One number covers both yards. Call, email or send the form for slip availability, lease rates and site visits.",
    url: "https://dickinsonbayoufleeting.com/contact",
  },
};

function ContactView() {
  useSeoMeta(metadata);
  return (
    <main id={MAIN_ID} tabIndex={-1}>
      <PagePlate
        eyebrow="Contact"
        title="One number for everything dockside."
        subtitle="Call any time, email through the working day, or send the form below. All three reach the same crew."
      />
      <ContactSection />
      <Location />
    </main>
  );
}

export default ContactView;
