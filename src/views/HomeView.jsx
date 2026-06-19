import HeroSection from "../components/Hero";
import LeasePackage from "../components/LeasePackage";
import Amenities from "../components/Amenities";
import ServiceArea from "../components/ServiceArea";
import Location from "../components/Location";

function HomeView() {
  return (
    <main>
      <HeroSection />
      <LeasePackage />
      <Amenities />
      <ServiceArea />
      <Location />
    </main>
  );
}

export default HomeView;
