// The two legal pages read from here so the pages themselves stay layout and
// the wording stays in one place. Every claim below describes something the
// site actually does: the form posts to the inquiry endpoint, the analytics
// and error scripts are in index.html, and the maps are Google embeds.

export const PRIVACY_UPDATED = "August 2026";

export const PRIVACY_SECTIONS = [
  {
    id: "what-we-collect",
    heading: "What we collect",
    body: [
      "The quote form and the lease inquiry form ask for a first name, a last name, an email address, a phone number, and whatever you write in the message field. Nothing else on the site asks you for anything.",
      "The site also counts page views and records browser errors so we can tell when a page is broken. Those records hold the page address, the browser and version, and the error text. They carry no name and no email address.",
    ],
  },
  {
    id: "why-we-collect-it",
    heading: "Why we collect it",
    body: [
      "To answer you. A form submission reaches the yard and is used to quote the job, arrange a slip, or point you to somebody who handles what you need.",
      "We do not sell what you send us, and we do not pass it to anyone outside the companies we work with to answer your request.",
    ],
  },
  {
    id: "who-else-sees-it",
    heading: "Who else sees it",
    body: [
      "Form submissions travel to a hosted service we run the site on, which stores them until somebody has answered.",
      "The facility maps are Google Maps embeds. Loading a page with a map on it tells Google that a browser at your address requested it, the same as visiting Google Maps directly.",
    ],
  },
  {
    id: "how-long-we-keep-it",
    heading: "How long we keep it",
    body: [
      "Inquiries stay on file as a record of the conversation. Ask us to delete yours and we will.",
      "Traffic counts and error records are kept for troubleshooting and are not tied to a person.",
    ],
  },
  {
    id: "cookies",
    heading: "Cookies",
    body: ["The site sets no advertising cookies and runs no tracking pixels."],
  },
  {
    id: "reaching-us",
    heading: "Reaching us",
    body: [
      "Call the direct line or send a note through the contact page and ask for whatever you need: a copy of what we hold, a correction, or deletion.",
    ],
  },
];

export const TERMS_UPDATED = "August 2026";

export const TERMS_SECTIONS = [
  {
    id: "what-this-covers",
    heading: "What this covers",
    body: [
      "These terms cover the use of this website. They are not the lease. Fleeting, mooring, handling and dock lease work is governed by the written agreement signed for that job.",
    ],
  },
  {
    id: "what-the-site-says",
    heading: "What the site says",
    body: [
      "Rates, acreage, facility details and service descriptions on this site describe what we normally offer. They are a starting point for a conversation, not an offer, and the figures that bind either of us are the ones in a signed agreement.",
      "Availability changes. A slip listed here may already be spoken for by the time you call.",
    ],
  },
  {
    id: "using-the-site",
    heading: "Using the site",
    body: [
      "Read it, print it, send it to a colleague. Do not scrape it, republish it as your own, or use the forms to send anything you would not want a person to read.",
      "The name, the mark and the photography belong to Dickinson Bayou Fleeting.",
    ],
  },
  {
    id: "other-sites",
    heading: "Other sites",
    body: [
      "The maps and any outbound link lead somewhere we do not run. What happens there is between you and them.",
    ],
  },
  {
    id: "availability",
    heading: "Availability",
    body: [
      "We keep the site up and correct as best we can. It can still be down, and a page can still be out of date. When the answer matters, call and get it from a person.",
    ],
  },
];
