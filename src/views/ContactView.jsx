import PageHeader from "../components/PageHeader";
import ContactSection from "../components/ContactSection";
import Location from "../components/Location";

function ContactView() {
  return (
    <main>
      <PageHeader
        eyebrow="Contact"
        title="One desk for everything dockside."
        subtitle="The shortest path between a customer and an answer. Call any time, email during business hours, or send the form below — it lands on the operations desk."
      />
      <ContactSection />
      <Location />
    </main>
  );
}

export default ContactView;
