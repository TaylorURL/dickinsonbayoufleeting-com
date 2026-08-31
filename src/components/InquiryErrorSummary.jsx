import "./styles/ErrorSummary.css";
import { INQUIRY_FIELDS } from "../app/constants/inquiryForm";

// Shown once a submit has been tried and more than one field still needs work,
// so the reader gets the whole list in one place with a way into each field
// rather than hunting the form for red. The block class carries only what the
// host form's own layout adds; the summary's appearance is in ErrorSummary.css.
function InquiryErrorSummary({ block, idPrefix, errors }) {
  const failing = INQUIRY_FIELDS.filter((field) => errors[field.key]);
  if (failing.length < 2) return null;
  return (
    <div className={`errSummary ${block}__summary`} role="alert">
      <p className="errSummary__title">
        {failing.length} fields still need something.
      </p>
      <ul className="errSummary__list">
        {failing.map((field) => (
          <li key={field.key}>
            <a className="errSummary__link" href={`#${idPrefix}-${field.key}`}>
              {field.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default InquiryErrorSummary;
