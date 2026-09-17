import PagePlate from "../components/page/PagePlate";
import ContactSection from "../components/sections/ContactSection";
import BeforeYouCall from "../components/sections/BeforeYouCall";
import Location from "../components/sections/Location";
import { MAIN_ID } from "../app/constants/landmarks";
import { useSeoMeta } from "../app/hooks/useSeoMeta";
import { ROUTE_META } from "../app/router/routes";

function ContactView() {
  useSeoMeta(ROUTE_META.contact);
  return (
    <main id={MAIN_ID} tabIndex={-1}>
      <PagePlate
        eyebrow="Contact"
        title="One number for both yards."
        subtitle="Ask for lease terms, book a yard walk, or check whether a slip is open. The line is answered around the clock; the form reaches whoever is on shift."
      />
      <ContactSection />
      <BeforeYouCall />
      <Location />
    </main>
  );
}

export default ContactView;
