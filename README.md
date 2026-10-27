<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="public/images/DBF-Logo-White.png" />
    <img src="public/images/DBF-Logo-Black.png" width="200" alt="Dickinson Bayou Fleeting" />
  </picture>
</p>

<h1 align="center">Dickinson Bayou Fleeting</h1>

<p align="center">Website for Dickinson Bayou Fleeting, a barge fleeting and dock leasing company on the Texas coast.</p>
<p align="center"><a href="https://dickinsonbayoufleeting.com">dickinsonbayoufleeting.com</a></p>

<p align="center">
  <img src="https://img.shields.io/badge/version-2026.42.0-f0a045?style=for-the-badge" alt="Version 2026.42.0" />
</p>

Dickinson Bayou Fleeting runs two waterfront barge yards. One is in Dickinson on Galveston Bay, with access to the Houston Ship Channel. The other is in Freeport on the Gulf Intracoastal Waterway. Both are leased by the month. Most of their business starts with a phone call, so the site is built to load fast on a dock with one bar of signal and put the rates and the phone number up front.

## What's on the site

- Lease rates and details for both yards on the home page.
- The seven services the shore crew covers, from long-term fleeting and barge shifting to repair and survey coordination, with a FAQ.
- The phone number in the nav bar, in the footer, and on a strip that stays on screen on phones.
- A quote form that opens from any button on the site. Requests go to the yard office.
- A contact page with the same form, what to have ready before you call, and maps of both yards.
- An about page with the company story and the towns and waterways the yards serve.

## Running it locally

```bash
npm install
npm start          # dev server on http://localhost:3000
npm run build      # production build to build/
```

There's nothing to configure. The build runs on Node 22.

## Built with

React 19, Create React App and Tailwind CSS. The quote form posts to a Supabase edge function. Hosted on Vercel.

## License

Proprietary. Copyright (c) 2026 TaylorURL LLC, all rights reserved. See [LICENSE.md](LICENSE.md).

Built and maintained by [TaylorURL](https://www.taylorurl.com).
