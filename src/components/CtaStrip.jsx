import "./styles/CtaStrip.css";
import { PHONE_NUMBER } from "../app/constants/phoneNumber";
import { Link } from "../app/router/Link";

/* Lower-page conversion strip. Reused across pages so the call-to-action
 * is consistent and the user always has a clear next step. */
function CtaStrip({
  eyebrow = "Ready to talk",
  title = "Looking for a slip or a long-term lease?",
  body = "Tell us about the job and we will get back to you inside one business day. The direct line is always faster.",
  primary = { label: "Send a request", to: "/contact" },
}) {
  const phoneHref = `tel:1${PHONE_NUMBER.replace(/[^0-9]/g, "")}`;
  return (
    <section className="ctaStrip" data-surface="dark" aria-label="Get in touch">
      <div className="container">
        <div className="ctaStrip__inner">
          <div className="ctaStrip__copy">
            <p className="eyebrow eyebrow--strong mono ctaStrip__eyebrow">
              {eyebrow}
            </p>
            <h2 className="ctaStrip__title">{title}</h2>
            <p className="ctaStrip__body">{body}</p>
          </div>
          <div className="ctaStrip__actions">
            <Link to={primary.to} className="btn btn--primary">
              {primary.label}
            </Link>
            <a href={phoneHref} className="btn btn--ghost">
              {PHONE_NUMBER}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CtaStrip;
