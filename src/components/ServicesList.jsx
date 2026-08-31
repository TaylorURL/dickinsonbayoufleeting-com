import { SERVICES } from "../app/constants/services";
import { BAND, Container, Section, SectionHead } from "./ui/Layout";
import { Reveal, Stagger, staggerChild } from "./ui/Reveal";
import { ROW, ROW_INNER, ROW_MARKER, SLOT } from "./ui/Row";

function ServicesList({ surface = "dark" }) {
  return (
    <Section surface={surface} id="services-detail" aria-label="Services">
      <Container className={BAND}>
        <Reveal>
          <SectionHead
            eyebrow="What we do"
            title="Barge fleeting and marine services, in plain language."
            subtitle="Seven services out of two coastal yards, for the towboats, dispatchers and barge operators we work with every day."
          />
        </Reveal>

        <Stagger
          as="ol"
          aria-label="Service List"
          className="m-0 list-none border-t border-border p-0"
        >
          {SERVICES.map((s, idx) => (
            <li
              key={s.id}
              id={s.id}
              className={`scroll-mt-anchor border-b border-border ${staggerChild(idx)}`}
            >
              <div className={`${ROW} ${ROW_INNER} ${ROW_MARKER} py-8`}>
                <span
                  aria-hidden="true"
                  className={`${SLOT.index} font-mono text-xs font-medium tracking-control text-muted`}
                >
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <span
                  className={`${SLOT.code} font-mono text-xs font-medium tracking-control text-faint`}
                >
                  {s.code}
                </span>
                <h3 className={`${SLOT.name} m-0 text-h6 text-primary`}>
                  {s.name}
                </h3>
                <p
                  className={`${SLOT.body} max-w-prose-tight text-md text-secondary`}
                >
                  {s.summary}
                </p>
                <p className={`${SLOT.detail} max-w-prose text-md text-faint`}>
                  {s.detail}
                </p>
                <span
                  className={`${SLOT.meta} whitespace-nowrap font-mono text-xs font-medium uppercase tracking-label text-muted`}
                >
                  {s.meta}
                </span>
              </div>
            </li>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}

export default ServicesList;
