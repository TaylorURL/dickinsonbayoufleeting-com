// The one path measurement leaves the site by: the tag loader, the three
// actions worth counting, and the click identifier that ties a lease signed
// weeks later back to the ad that produced it.
//
// Nothing here reaches the network until an identifier in
// ../constants/tracking is filled in, and a missing conversion label silences
// that one action rather than the module.

import {
  ADS_CONVERSION_LABELS,
  CALL_VALUE,
  CONVERSION_CURRENCY,
  GA4_EVENTS,
  GA4_MEASUREMENT_ID,
  GOOGLE_ADS_ID,
  INQUIRY_VALUE,
} from "../constants/tracking";

const GTAG_SRC = "https://www.googletagmanager.com/gtag/js";

// Google identifies an ad click with gclid on the open web and with wbraid or
// gbraid where the browser withholds it, so a visitor arriving without a gclid
// has not necessarily arrived without an ad click.
const CLICK_ID_PARAMS = ["gclid", "wbraid", "gbraid"];

// The router rewrites the address bar on the first in-site navigation and the
// query string does not survive it, so the identifier is read once on arrival
// and held for the length of the tab.
const CLICK_ID_KEY = "dbf.click_id";

const MAPS_HREF =
  /^https?:\/\/(?:www\.)?(?:maps\.google\.|google\.[a-z.]+\/maps)/i;

let started = false;

function gtag() {
  // gtag reads its arguments object back out of the queue, so the call has to
  // push `arguments` itself; an array assembled from a rest parameter is a
  // different shape and the tag discards it.
  window.dataLayer.push(arguments);
}

function readClickId() {
  try {
    const params = new URL(window.location.href).searchParams;
    for (const name of CLICK_ID_PARAMS) {
      const value = params.get(name);
      if (value) return `${name}:${value}`;
    }
  } catch (ignored) {
    // An address the browser will not parse carries nothing worth keeping.
  }
  return "";
}

function captureClickId() {
  const found = readClickId();
  if (!found) return;
  try {
    window.sessionStorage.setItem(CLICK_ID_KEY, found);
  } catch (ignored) {
    // The value is only worth anything if it can be read back, and a browser
    // refusing to store it will refuse to return it too.
  }
}

// The ad click that brought this visitor in, as "<parameter>:<value>", or an
// empty string where there was none. A browser that refuses session storage
// yields the same empty string as a visitor who arrived without a click, which
// is the right answer in both cases: neither can be matched to a campaign.
export function clickId() {
  try {
    return window.sessionStorage.getItem(CLICK_ID_KEY) || "";
  } catch (ignored) {
    return "";
  }
}

// Google drops a phone number that is not in E.164, and the form accepts
// whatever the visitor typed. Ten digits are read as the US number they are;
// anything longer is assumed to already carry its country code.
function toE164(phone) {
  const digits = String(phone || "").replace(/[^0-9]/g, "");
  if (!digits) return "";
  return digits.length === 10 ? `+1${digits}` : `+${digits}`;
}

function sendAdsConversion(action, params) {
  const label = ADS_CONVERSION_LABELS[action];
  if (!GOOGLE_ADS_ID || !label) return;
  gtag("event", "conversion", {
    send_to: `${GOOGLE_ADS_ID}/${label}`,
    ...params,
  });
}

// Addressed to the GA4 property by name. An event sent without `send_to`
// reaches every configured tag, which would file a GA4 event name in the Ads
// account as well.
function sendGa4Event(action, params) {
  if (!GA4_MEASUREMENT_ID) return;
  gtag("event", GA4_EVENTS[action], {
    send_to: GA4_MEASUREMENT_ID,
    ...params,
  });
}

// Called once per inquiry the desk actually received, never on a submission
// that failed. The contact details go up ahead of the conversion so enhanced
// conversions can match the lead to its click where the cookie alone cannot;
// gtag normalises and hashes them in the browser, so the plain values do not
// leave it.
export function trackInquiry(values) {
  if (!started) return;
  const email = String((values && values.email) || "")
    .trim()
    .toLowerCase();
  const phone = toE164(values && values.phone);
  if (GOOGLE_ADS_ID && (email || phone)) {
    const userData = {};
    if (email) userData.email = email;
    if (phone) userData.phone_number = phone;
    gtag("set", "user_data", userData);
  }
  const payload = { value: INQUIRY_VALUE, currency: CONVERSION_CURRENCY };
  sendAdsConversion("inquiry", payload);
  sendGa4Event("inquiry", payload);
}

export function trackCall() {
  if (!started) return;
  const payload = { value: CALL_VALUE, currency: CONVERSION_CURRENCY };
  sendAdsConversion("call", payload);
  sendGa4Event("call", payload);
}

// Carries no value. A visitor opening the map has not reached the desk, and a
// secondary action priced like a lead teaches the bidder to buy map clicks.
export function trackDirections() {
  if (!started) return;
  sendAdsConversion("directions", {});
  sendGa4Event("directions", {});
}

// One listener for every telephone and map link on the site, in the capture
// phase so it runs before the browser hands the click to the dialler. Adding a
// link anywhere in the tree is enough to have it counted; there is no handler
// to remember to attach.
function onDocumentClick(event) {
  const target = event.target;
  const link = target && target.closest ? target.closest("a[href]") : null;
  if (!link) return;
  const href = link.getAttribute("href") || "";
  if (href.startsWith("tel:")) {
    trackCall();
  } else if (MAPS_HREF.test(href)) {
    trackDirections();
  }
}

// Runs before the first render so the click identifier is read while it is
// still in the address bar. Calling it twice is harmless; the second call
// returns without attaching anything.
export function initGoogleTracking() {
  if (started || typeof window === "undefined") return;
  captureClickId();
  if (!GOOGLE_ADS_ID && !GA4_MEASUREMENT_ID) return;
  started = true;
  window.dataLayer = window.dataLayer || [];
  gtag("js", new Date());
  if (GOOGLE_ADS_ID) {
    gtag("config", GOOGLE_ADS_ID, { allow_enhanced_conversions: true });
  }
  if (GA4_MEASUREMENT_ID) {
    gtag("config", GA4_MEASUREMENT_ID);
  }
  const script = document.createElement("script");
  script.async = true;
  script.src = `${GTAG_SRC}?id=${GOOGLE_ADS_ID || GA4_MEASUREMENT_ID}`;
  document.head.appendChild(script);
  document.addEventListener("click", onDocumentClick, true);
}
