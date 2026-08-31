// The one shape both inquiry forms take: the panel in the modal and the form on
// the contact page ask for the same five things, so the fields, the rules, the
// words shown when a rule fails, and where a completed one is sent live here
// rather than twice.

export const INQUIRY_FIELDS = [
  {
    key: "firstName",
    label: "First Name",
    autoComplete: "given-name",
  },
  {
    key: "lastName",
    label: "Last Name",
    autoComplete: "family-name",
  },
  {
    key: "email",
    label: "Email",
    type: "email",
    inputMode: "email",
    autoComplete: "email",
  },
  {
    key: "phone",
    label: "Phone",
    type: "tel",
    inputMode: "tel",
    autoComplete: "tel",
    hint: "Digits only or formatted, either works.",
  },
  {
    key: "message",
    label: "Tell Us About the Job",
    multiline: true,
    autoComplete: "off",
    hint: "Vessel particulars, timing and port pairs are what we need to quote it.",
  },
];

export const MESSAGE_MIN_WORDS = 5;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SEVEN_DIGITS = /[0-9]{7,}/;

// Each message names the thing that is wrong and what to type instead, because
// a field that only says "Invalid" leaves the reader guessing which half of the
// address they got wrong.
export function validateInquiry(values) {
  const errors = {};
  if (!values.firstName.trim()) {
    errors.firstName = "Enter a first name so we know who to ask for.";
  }
  if (!values.lastName.trim()) {
    errors.lastName = "Enter a last name.";
  }
  if (!EMAIL.test(values.email)) {
    errors.email =
      "Enter an address with an @ and a domain, like name@company.com.";
  }
  if (!SEVEN_DIGITS.test(values.phone.replace(/[^0-9]/g, ""))) {
    errors.phone = "Enter a phone number with at least seven digits.";
  }
  if (values.message.trim().length < MESSAGE_MIN_WORDS) {
    errors.message = "Say a few words about the job so we can quote it.";
  }
  return errors;
}

const INQUIRY_ENDPOINT =
  "https://gujgtjqqurildqurpffh.supabase.co/functions/v1/inquiry-service";

// A request with no ceiling leaves the submit button reading "Sending" for as
// long as the tab is open, so it gets one.
const INQUIRY_TIMEOUT_MS = 15000;

// Throws on anything but a delivered inquiry, so a caller shows the reader a
// failure rather than a confirmation. Both forms go through here: a visitor who
// is told the message landed has to be right about that.
export async function submitInquiry(data) {
  const response = await fetch(INQUIRY_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    signal: AbortSignal.timeout
      ? AbortSignal.timeout(INQUIRY_TIMEOUT_MS)
      : undefined,
  });
  if (!response.ok) throw new Error("Inquiry submission failed");
}

// What to tell the reader when `submitInquiry` throws. The direct line is in
// both messages because a failed form is the moment the phone number matters.
export function inquiryErrorMessage(error) {
  return error && error.name === "TimeoutError"
    ? "Nothing came back in time. Try again, or call the direct line."
    : "That did not send. Try again, or call the direct line.";
}

// US formatting up to ten digits, then a country code in front of the last ten.
export function formatPhone(value) {
  const digits = value.replace(/[^0-9]/g, "").slice(0, 15);
  if (digits.length < 4) return digits;
  if (digits.length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  if (digits.length < 11) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return `+${digits.slice(0, -10)} (${digits.slice(-10, -7)}) ${digits.slice(-7, -4)}-${digits.slice(-4)}`;
}
