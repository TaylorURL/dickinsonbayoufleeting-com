<picture>
  <source media="(prefers-color-scheme: dark)" srcset="public/images/DBF-Logo-White.png" />
  <img src="public/images/DBF-Logo-Black.png" width="200" alt="Dickinson Bayou Fleeting" />
</picture>

# Dickinson Bayou Fleeting

Website for Dickinson Bayou Fleeting, a barge fleeting and dock leasing company on the Texas coast.

[dickinsonbayoufleeting.com](https://dickinsonbayoufleeting.com)

<img src="https://img.shields.io/badge/version-2026.44.2-f0a045?style=for-the-badge" alt="Version 2026.44.2" />

Lease rates for both yards, the services, the phone number and a quote form. Most business starts with a phone call from a dock with one bar of signal, so the page has to draw fast.

It's Create React App with a prerender step bolted on. After `react-scripts build`, `scripts/prerender.js` bundles a Node copy of the app with esbuild and writes each route's markup and head into its own file, and `vercel.json` points each path at it. Titles and descriptions live in the route table (`src/app/router/routes.js`), next to a small hand-rolled router with its own `Link`.

Yards, rates, services, hours, the FAQ and the phone number are modules in `src/app/content/`. The pages read them, the search palette reads them, and `scripts/build-jsonld.js` builds the Schema.org graph and geo meta from the same facility records, so the coordinates are written down once.

The quote modal and the contact page share one form definition (`src/lib/inquiryForm.js`) and post to a Supabase edge function.

## Loading on a bad connection

Every route already has its first screen in the HTML, so the bundle only has to make it interactive. `scripts/start-bundle-after-paint.js` holds it until the first frame is painted, which keeps it from fighting the hero image and fonts for bandwidth. If that request drops, it retries twice on a widening gap. A page that looks finished with nothing wired up is worse than a slow one. Background tabs that never paint start on a timer instead.

## Gotchas

- Tailwind's scales are replaced, not extended. A class naming a step that doesn't exist compiles to nothing with no warning, so `scripts/check-spacing-scale.js` runs with lint and fails on one.
- Google tags are off while their IDs in `src/app/tracking/config.js` are blank.
- The sitemap is dated with the build day, since the build writes every document.

```bash
npm install
npm start       # http://localhost:3000
npm run build
```

Nothing to configure. Builds on Node 22. React 19 and Tailwind CSS, on Vercel. Proprietary, see [LICENSE.md](LICENSE.md).

Built and maintained by [TaylorURL](https://www.taylorurl.com).
