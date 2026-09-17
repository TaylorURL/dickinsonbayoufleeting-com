import { SERVICES } from "../../app/content/services";
import Button from "../ui/Button";
import { Container, Section } from "../ui/Layout";
import { Reveal, Stagger, staggerChild } from "../ui/Reveal";
import ServiceRow from "./ServiceRow";

// The seven jobs as the home page states them: the claim on the left, the
// register beside it, and one way through to the page that carries the detail.
// The rows are the same rows the services page prints, in their shorter
// reading, so a reader who follows the link meets the list they were already
// looking at.
//
// The head and its button are one column on a wide screen and the two ends of
// the band on a phone, which is why the button is a sibling of the register
// rather than a child of the head: the grid puts it back under the lede above
// 900, and below it the stack leaves it where the markup already had it.
function HomeRegister() {
  return (
    <Section surface="dark" id="services" aria-label="What we do">
      <Container className="flex flex-col gap-7 md:grid md:grid-cols-[minmax(0,448fr)_minmax(0,768fr)] md:grid-rows-[auto_1fr] md:gap-x-10 md:gap-y-6">
        <Reveal className="flex min-w-0 flex-col gap-4 md:col-start-1 md:row-start-1 md:gap-6">
          <h2 className="m-0 text-h2-mobile text-primary md:text-h2">
            The dock is already staffed.
          </h2>
          <p className="m-0 text-lead-mobile text-secondary md:text-lead">
            This is not leasing bare land. The crew that works both yards covers
            all seven, on site whether your lease uses them or not.
          </p>
        </Reveal>

        <Stagger
          as="ol"
          aria-label="What we do"
          className="m-0 list-none p-0 md:col-start-2 md:row-span-2 md:row-start-1"
        >
          {SERVICES.map((service, i) => (
            <ServiceRow
              key={service.id}
              service={service}
              className={staggerChild(i)}
            />
          ))}
        </Stagger>

        <Reveal className="md:col-start-1 md:row-start-2 md:self-start">
          <Button variant="ghost" to="/services" className="w-full xs:w-auto">
            See All Services
          </Button>
        </Reveal>
      </Container>
    </Section>
  );
}

export default HomeRegister;
