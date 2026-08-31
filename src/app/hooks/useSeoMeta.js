import { useEffect } from "react";

// The default from the static head. A route that overrides it (the 404 sets
// noindex) hands back this value when the next route mounts.
const DEFAULT_ROBOTS = "index,follow,max-image-preview:large,max-snippet:-1";

function upsertMeta(attr, key, content) {
  let tag = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (content == null) {
    if (tag) tag.remove();
    return;
  }
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

// One index.html serves every route, so on its own the head only ever
// describes the home page. Each view hands its metadata here and the head is
// rewritten to match the route the reader actually landed on.
export function useSeoMeta(meta) {
  useEffect(() => {
    const { title, description, canonical, robots, openGraph } = meta;
    const og = openGraph || {};
    document.title = title;
    upsertMeta("name", "description", description);
    upsertMeta("name", "robots", robots || DEFAULT_ROBOTS);
    upsertMeta("property", "og:title", og.title || title);
    upsertMeta("property", "og:description", og.description || description);
    upsertMeta("property", "og:url", "url" in og ? og.url : canonical);
    upsertMeta("name", "twitter:title", og.title || title);
    upsertMeta("name", "twitter:description", og.description || description);
    let link = document.head.querySelector('link[rel="canonical"]');
    if (canonical) {
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        document.head.appendChild(link);
      }
      link.setAttribute("href", canonical);
    } else if (link) {
      link.remove();
    }
  }, [meta]);
}
