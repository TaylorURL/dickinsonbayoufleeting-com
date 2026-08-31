import { useEffect } from "react";
import { SITE_ORIGIN } from "../constants/site";

// One island, replaced as the reader moves between routes, so the markup
// always describes the trail currently on the page. A route with no trail
// takes the island out rather than leaving the last route's behind.
const SCRIPT_ID = "breadcrumb-schema";

function buildList(route) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${SITE_ORIGIN}${route.path}#breadcrumbs`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${SITE_ORIGIN}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: route.label,
        item: `${SITE_ORIGIN}${route.path}`,
      },
    ],
  };
}

// Writes the BreadcrumbList for the trail the page is rendering. It takes the
// same route object the trail is built from, so the two cannot disagree:
// structured data that contradicts the page is worse than none.
export function useBreadcrumbSchema(route) {
  useEffect(() => {
    const remove = () => {
      const stale = document.getElementById(SCRIPT_ID);
      if (stale) stale.remove();
    };
    if (!route) {
      remove();
      return undefined;
    }
    let script = document.getElementById(SCRIPT_ID);
    if (!script) {
      script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(buildList(route));
    return remove;
  }, [route]);
}
