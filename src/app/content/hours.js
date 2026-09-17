// When somebody gets an answer, held in one place because the rail above the
// navigation, the footer and the contact page each state it and three copies
// of an opening time is how two of them end up wrong.
//
// Each row carries its hours twice: `value` is what a reader is shown, and
// `days`, `opens` and `closes` are the same hours as a machine reads them, for
// the structured data the build writes. They sit on one row so that changing
// one without the other takes looking straight past it.
const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const EVERY_DAY = [...WEEKDAYS, "Saturday", "Sunday"];

export const HOURS = [
  {
    id: "office",
    label: "Office",
    value: "Mon-Fri · 7a-5p CT",
    days: WEEKDAYS,
    opens: "07:00",
    closes: "17:00",
  },
  {
    id: "shore-crew",
    label: "Shore Crew",
    value: "24 / 7 · On-call answered",
    days: EVERY_DAY,
    opens: "00:00",
    closes: "23:59",
  },
];

// The rail has one line for this, so it carries the shorter reading: the hours
// somebody would plan a call around.
export const HOURS_SHORT = "Mon-Fri 7a-5p CT · Shore crew 24/7";
