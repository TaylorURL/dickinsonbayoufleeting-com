import { INQUIRY_FIELDS } from "../../lib/inquiryForm";

// Shown once a submit has been tried and more than one field still needs work,
// so the reader gets the whole list in one place with a way into each field
// rather than hunting the form for red. A host passes only what its own layout
// adds; the summary's appearance is here, so the two hosts cannot drift apart
// on a list they both show.
function InquiryErrorSummary({ className = "", idPrefix, errors }) {
  const failing = INQUIRY_FIELDS.filter((field) => errors[field.key]);
  if (failing.length < 2) return null;
  return (
    <div
      role="alert"
      className={`flex flex-col gap-2 border border-l-3 border-danger bg-danger-soft px-5 py-4 ${className}`.trim()}
    >
      <p className="font-condensed text-h5 uppercase text-primary [overflow-wrap:anywhere]">
        {failing.length} fields still need something.
      </p>
      <ul className="m-0 flex list-none flex-wrap gap-x-5 gap-y-2 p-0">
        {failing.map((field) => (
          <li key={field.key}>
            <a
              href={`#${idPrefix}-${field.key}`}
              className="font-body text-micro font-semibold text-danger underline-offset-[3px] transition-[color,background-color,border-color,transform,opacity] duration-quick ease-settle hover:text-primary focus-visible:shadow-focus focus-visible:outline-none"
            >
              {field.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default InquiryErrorSummary;
