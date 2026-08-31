// One icon family for the whole site: 24-unit box, stroked in currentColor,
// square caps and mitred joins to match the ticks and rules the layout is
// drawn with. Every mark is hidden from assistive tech, because each one sits
// inside a control that already carries its own name.
//
// Size is a number of pixels and defaults to the small step. Two marks that
// need to be a different size are the two the layout sizes explicitly.

const BASE = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "square",
  strokeLinejoin: "miter",
  "aria-hidden": "true",
  focusable: "false",
};

const DEFAULT_SIZE = 14;

export function ArrowRightIcon({ size = DEFAULT_SIZE, className }) {
  return (
    <svg
      {...BASE}
      aria-hidden="true"
      focusable="false"
      className={className}
      width={size}
      height={size}
      strokeWidth="1.8"
    >
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  );
}

export function ArrowUpIcon({ size = DEFAULT_SIZE, className }) {
  return (
    <svg
      {...BASE}
      aria-hidden="true"
      focusable="false"
      className={className}
      width={size}
      height={size}
      strokeWidth="1.6"
    >
      <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
  );
}

export function ChevronDownIcon({ size = DEFAULT_SIZE, className }) {
  return (
    <svg
      {...BASE}
      aria-hidden="true"
      focusable="false"
      className={className}
      width={size}
      height={size}
      strokeWidth="1.6"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

// The phone and the tick are the two marks drawn with round ends: both are
// pictures of an object rather than a rule, and a mitred corner on either
// reads as a drafting mark instead.
export function PhoneIcon({ size = 18, className }) {
  return (
    <svg
      {...BASE}
      aria-hidden="true"
      focusable="false"
      className={className}
      width={size}
      height={size}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
    </svg>
  );
}

export function CheckIcon({ size = 22, strokeWidth = "2.4", className }) {
  return (
    <svg
      {...BASE}
      aria-hidden="true"
      focusable="false"
      className={className}
      width={size}
      height={size}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m5 12.5 4.5 4.5L19 7" />
    </svg>
  );
}
