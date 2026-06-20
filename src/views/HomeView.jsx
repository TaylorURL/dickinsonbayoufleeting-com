import HeroSection from "../components/Hero";
import ServicesPreview from "../components/ServicesPreview";
import LeasePackage from "../components/LeasePackage";
import Amenities from "../components/Amenities";
import ServiceArea from "../components/ServiceArea";
import Location from "../components/Location";
import CtaStrip from "../components/CtaStrip";

function HomeView() {
  return (
    <main>
      <HeroSection />
      <ServicesPreview />
      <LeasePackage />
      <Amenities />
      <ServiceArea />
      <Location />
      <CtaStrip
        eyebrow="Get in touch"
        title="Talk to the operations desk."
        body="A real person will answer — usually inside one ring. Quotes back the same business day."
      />
    </main>
  );
}

export default HomeView;
