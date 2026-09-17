import { SERVICES } from "../../app/content/services";
import { Container, Section, SectionHead } from "../ui/Layout";
import { Reveal, Stagger, staggerChild } from "../ui/Reveal";
import ServiceRow from "./ServiceRow";

// The full register: the same seven rows the home page carries, opened out to
// the reading that answers what the job actually involves and how often it is
// wanted. Each row keeps the service's own id, because the search palette and
// the navigation both link a service straight to its line here.
function ServicesRegister({ surface = "dark" }) {
  return (
    <Section surface={surface} id="services-detail" aria-label="Services">
      <Container className="flex flex-col gap-7 md:gap-9">
        <Reveal>
          <SectionHead
            eyebrow="What we do"
            title="Seven jobs the crew already covers."
            subtitle="A lease here comes with the people who work the dock. Anything not on the list, call and ask."
          />
        </Reveal>

        <Stagger
          as="ol"
          aria-label="Service List"
          className="m-0 list-none p-0"
        >
          {SERVICES.map((service, i) => (
            <ServiceRow
              key={service.id}
              service={service}
              detailed
              className={staggerChild(i)}
            />
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}

export default ServicesRegister;
