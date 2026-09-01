// Every Google identifier the site reports to, in one place. An empty value
// switches that piece off: the loader attaches no script and the trackers
// return without sending, so a build with nothing filled in behaves exactly as
// the site does with no measurement at all.
//
// A conversion label is the half after the slash in the snippet Google Ads
// prints when a conversion action is created, so "AW-123456789/AbC-1_dEf" is
// entered below as "AbC-1_dEf" and the account ID in front of it is supplied
// by the sender.

export const GOOGLE_ADS_ID = "";

export const GA4_MEASUREMENT_ID = "";

export const ADS_CONVERSION_LABELS = {
  inquiry: "",
  call: "",
  directions: "",
};

// GA4 counts the same three actions under its own names. `generate_lead` is one
// of GA4's recommended events, so it arrives in the reports already understood;
// the other two have no recommended equivalent and are named for what the
// visitor did.
export const GA4_EVENTS = {
  inquiry: "generate_lead",
  call: "call_click",
  directions: "directions_click",
};

export const CONVERSION_CURRENCY = "USD";

// What one inquiry is worth to the bidder, which is not what a lease earns.
// The honest figure is the monthly package rate multiplied by the share of
// inquiries that become leases and by the months an average lease runs. The
// value below is one month of the San Leon rate standing in for a close rate
// nobody has measured; until it is replaced, Ads is being told every inquiry
// closes and every return figure built on it is high by that whole share.
export const INQUIRY_VALUE = 4100;

// A call reaches the same desk as the form and is treated as the same lead.
export const CALL_VALUE = INQUIRY_VALUE;
