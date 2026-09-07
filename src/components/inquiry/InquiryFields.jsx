import { INQUIRY_FIELDS } from "../../lib/inquiryForm";
import { FIELD } from "../ui/Field";

// The message box grows with what is in it, so a long note is read back whole
// rather than through a four-line window.
//
// Where the browser can size the box itself it does, and this runs no
// measurement at all. The branch below is for the browsers with no such
// property, and it costs a synchronous layout per keystroke, which is why it is
// the fallback rather than the rule.
const SIZES_ITSELF =
  typeof CSS !== "undefined" &&
  typeof CSS.supports === "function" &&
  CSS.supports("field-sizing", "content");

function growToFit(el) {
  if (SIZES_ITSELF) return;
  el.style.height = "auto";
  el.style.height = `${el.scrollHeight}px`;
}

// The five fields, rendered into whatever grid the surrounding form sets. Both
// forms keep their own layout while the labelling, the required marks and the
// error wiring stay identical.
function InquiryFields({
  idPrefix,
  values,
  errors,
  shown,
  onChange,
  onBlur,
  counter,
  firstFieldRef,
}) {
  return INQUIRY_FIELDS.map((field) => {
    const invalid = shown(field.key);
    const inputId = `${idPrefix}-${field.key}`;
    const errorId = `${inputId}-error`;
    const hintId = `${inputId}-hint`;
    const describedBy =
      [field.hint ? hintId : null, invalid ? errorId : null]
        .filter(Boolean)
        .join(" ") || undefined;
    const Tag = field.multiline ? "textarea" : "input";
    return (
      <div
        key={field.key}
        className={`${FIELD.root} ${field.multiline ? FIELD.full : ""}`.trim()}
      >
        <label className={FIELD.label} htmlFor={inputId}>
          {field.label}
        </label>
        {field.hint ? (
          <span className={FIELD.hint} id={hintId}>
            {field.hint}
          </span>
        ) : null}
        <Tag
          id={inputId}
          name={field.key}
          ref={field.key === "firstName" ? firstFieldRef : undefined}
          className={`${field.multiline ? FIELD.textarea : FIELD.input} ${
            invalid ? FIELD.invalid : FIELD.valid
          }`}
          type={field.multiline ? undefined : field.type || "text"}
          rows={field.multiline ? 5 : undefined}
          inputMode={field.inputMode}
          autoComplete={field.autoComplete}
          placeholder={field.placeholder}
          value={values[field.key]}
          required
          aria-required="true"
          onChange={(event) => {
            if (field.multiline) growToFit(event.target);
            onChange(field.key, event.target.value);
          }}
          onBlur={() => onBlur(field.key)}
          aria-invalid={invalid ? true : undefined}
          aria-describedby={describedBy}
        />
        {field.multiline && counter ? counter : null}
        <span className={FIELD.error} id={errorId} role="alert">
          {invalid ? errors[field.key] : ""}
        </span>
      </div>
    );
  });
}

export default InquiryFields;
