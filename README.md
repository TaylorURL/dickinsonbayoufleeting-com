<picture>
  <source media="(prefers-color-scheme: dark)" srcset="public/images/DBF-Logo-White.png" />
  <img src="public/images/DBF-Logo-Black.png" width="200" alt="Dickinson Bayou Fleeting" />
</picture>

# Dickinson Bayou Fleeting

Website for Dickinson Bayou Fleeting, a barge fleeting and dock leasing company on the Texas coast.

[dickinsonbayoufleeting.com](https://dickinsonbayoufleeting.com)

<img src="https://img.shields.io/badge/version-2026.44.0-f0a045?style=for-the-badge" alt="Version 2026.44.0" />

Lease rates for both yards, the services, the phone number and a quote form. Most business starts with a call, so the page has to draw fast on a dock with one bar of signal. React on Create React App, prerendered per route.

## How it's built

- **Content is data.** Yards, rates, services, hours, the FAQ and the phone number are modules in `src/app/content/`. Pages, the JSON-LD and the search palette all read them.
- **Prerendered.** After `react-scripts build`, `scripts/prerender.js` bundles a Node copy of the app with esbuild and writes each public route's markup and head into its own file. `vercel.json` points each path at its file. Unknown paths get the empty shell with a 404.
- **Heads live in the route table.** `src/app/router/routes.js` holds each page's title and description, and the canonical is built from the path. The build stamps them before any view runs, so a crawler that runs no scripts sees the right page.
- **Structured data is generated.** `scripts/build-jsonld.js` fills the geo meta and the Schema.org graph from the same facility records the pages show. Coordinates are stated once.
- **No router library.** `src/app/router/` is a small router with its own `Link`.
- **One form, two places.** The quote modal and the contact page share `src/lib/inquiryForm.js` and `useInquiryForm.js`: fields, rules, error text and where it's sent. It posts to a Supabase edge function.

<details>
<summary>Decisions and tradeoffs</summary>

- The bundle waits until the first frame is painted (`scripts/start-bundle-after-paint.js`). Every route already has its first screen in the HTML, so the bundle only makes it interactive. Loading it early just takes bandwidth from the hero and fonts.
- That injected script retries twice on a widening gap if it fails. Without it, a dropped request leaves a page that looks finished with nothing wired up.
- A background tab that isn't drawing frames starts the bundle on a timer instead.
- `scripts/stamp-sitemap.js` dates the sitemap with the build day. Every document is written by the build, so that's the real last change.
- Tailwind's scales are replaced, not extended. A class naming a missing step compiles to nothing with no warning, so `scripts/check-spacing-scale.js` runs with lint and fails on one.
- Search is built from the content modules (`src/lib/searchIndex.js`). Each entry carries extra match words, so "rate" finds the lease sheet.
- Google tags are switched off by leaving an ID blank in `src/app/tracking/config.js`. Nothing loads until one is filled in.
- `api/version.js` returns the deployed commit, uncached.

</details>

<details>
<summary>Running it locally</summary>

```bash
npm install
npm start          # dev server on http://localhost:3000
npm run build      # production build to build/
```

Nothing to configure. The build runs on Node 22.

</details>

## Built with

React 19, Create React App and Tailwind CSS. The quote form posts to a Supabase edge function. Hosted on Vercel.

<details>
<summary>License</summary>

Proprietary. Copyright (c) 2026 TaylorURL LLC, all rights reserved. See [LICENSE.md](LICENSE.md).

</details>

Built and maintained by [TaylorURL](https://www.taylorurl.com).
