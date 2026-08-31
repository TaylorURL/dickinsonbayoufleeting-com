import PagePlate from "../components/PagePlate";
import ContactSection from "../components/ContactSection";
import Location from "../components/Location";
import { MAIN_ID } from "../app/constants/landmarks";
import { useSeoMeta } from "../app/hooks/useSeoMeta";

export const metadata = {
  title: "Contact the Operations Desk | Dickinson Bayou Fleeting",
  description:
    "The operations desk is the one contact for both yards. Call, email or send the inquiry form for slip availability, lease rates and site visits.",
  canonical: "https://dickinsonbayoufleeting.com/contact",
  openGraph: {
    title: "Contact the Operations Desk | Dickinson Bayou Fleeting",
    description:
      "The operations desk is the one contact for both yards. Call, email or send the inquiry form for slip availability, lease rates and site visits.",
    url: "https://dickinsonbayoufleeting.com/contact",
  },
};

function ContactView() {
  useSeoMeta(metadata);
  return (
    <main id={MAIN_ID} tabIndex={-1}>
      <PagePlate
        eyebrow="Contact"
        title="One desk for everything dockside."
        subtitle="Call any time, email during business hours, or send the form below. All three land on the operations desk."
      />
      <ContactSection />
      <Location />
    </main>
  );
}

export default ContactView;
