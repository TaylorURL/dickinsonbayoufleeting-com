<p align="center"><img src="public/images/DBF-Logo-White.png" alt="Dickinson Bayou Fleeting" width="140" /></p>

<h1 align="center">Dickinson Bayou Fleeting</h1>

<p align="center"><strong>Waterfront Dock Space Leasing — Freeport & San Leon, Texas</strong></p>

<p align="center">
  <img src="https://img.shields.io/badge/v1.0.3-release-1e3a5f" alt="v1.0.3" />
  <img src="https://img.shields.io/badge/React-19.1-61DAFB?logo=react&logoColor=white" alt="React 19.1" />
  <img src="https://img.shields.io/badge/CSS-Custom_Properties-1572B6?logo=css3&logoColor=white" alt="CSS Custom Properties" />
  <img src="https://img.shields.io/badge/PWA-Capable-5A0FC8?logo=pwa&logoColor=white" alt="PWA Capable" />
  <img src="https://img.shields.io/badge/Schema.org-JSON--LD-orange" alt="Schema.org Structured Data" />
</p>

---

Dickinson Bayou Fleeting is a single-page marketing and lead-generation website for a Texas-based waterfront dock space leasing company operating two physical facilities — one in Freeport, TX and one in San Leon (Dickinson), TX. The site presents available lease packages, amenities, and facility locations, and drives prospective customers toward a lease inquiry form without requiring any page navigation.

The site is built in React 19.1 with a full CSS custom property token system (~60 variables) that powers comprehensive dark and light theming via `prefers-color-scheme` detection — no Tailwind, no CSS-in-JS. Every component owns its colocated `.css` file and reads from shared design tokens defined in `Theme.css`, ensuring visual consistency without cross-cutting stylesheet dependencies.

---

## Navigation

The sticky navigation bar monitors scroll depth via a `useScrolled` hook and transitions its visual treatment once the user has scrolled past the hero. Active section highlighting is handled by an `IntersectionObserver`-based `useActiveSection` hook that tracks which page section is currently in view and updates the corresponding nav link. On mobile, a hamburger menu opens a drawer that automatically dismisses on outside clicks. The navbar renders two logo variants — white on dark backgrounds, black on light — and selects between them based on the active color scheme. The "Get Quote" call-to-action dispatches a custom `inquiry:open` window event rather than coupling directly to the modal component.

## Hero

The hero section spans the full viewport and plays an autoplay, muted, looping MP4 background video overlaid with a gradient. Three badge pills — "5 Acre Waterfront", "Dedicated Slip", and "On-Site Assistance" — anchor the core value proposition above the primary CTAs. The video-based background communicates the waterfront setting immediately without static imagery.

## Lease Options

The lease options section presents both facilities through an ARIA-compliant tab interface (`role="tablist"`) that switches between the Freeport package ($4,800/month) and the San Leon package ($4,100/month). Both represent full 5-acre waterfront packages. The tab state controls which facility's details are visible without a page reload or modal overlay, keeping the comparison direct and scannable.

## Amenities

Six amenity types are presented in a responsive card grid, each communicating a distinct aspect of the leasing experience. The grid layout adapts across viewport widths without JavaScript-driven breakpoint detection.

## Locations

The locations section surfaces both facility cards with physical addresses and GPS coordinates. An `useAutoCycle` hook automatically advances between the two facilities every 6 seconds, pausing permanently once the user manually selects a facility. The active card expands to reveal a Google Maps link, a direct call link, and a Lease CTA. An embedded Google Maps iframe updates in sync with the selected facility, providing an immediate visual geography reference without leaving the page.

## Inquiry Modal

The global inquiry modal is triggered by listening for the custom `inquiry:open` window event, fully decoupling it from any specific trigger component in the tree. The form collects name, email, phone, and a message (1,200 character limit with a live counter and an auto-growing textarea). Phone input is automatically masked for both US and international formats. The modal implements a full focus trap — Tab and Shift+Tab cycle only within the dialog, and Escape dismisses it. `aria-modal` and `aria-live` regions ensure screen readers receive appropriate context and feedback. On submission, the modal performs a simulated async operation and transitions to a success confirmation with a phone fallback for users who prefer direct contact.

## Footer

The footer assembles the full contact surface: section navigation links, both facility addresses, the company phone number, a Lease CTA, and dual logo variants. The copyright year is computed dynamically. A back-to-top control is included for single-page scroll ergonomics.

---

## Architecture

| Layer          | Technology                                                                                       |
| -------------- | ------------------------------------------------------------------------------------------------ |
| UI Framework   | React 19.1                                                                                       |
| Build Tooling  | Create React App (react-scripts 5)                                                               |
| Styling        | Plain CSS with CSS Custom Properties (~60 tokens in `Theme.css`)                                 |
| Theming        | `prefers-color-scheme` → programmatic `data-theme` on `<html>`                                   |
| Component CSS  | Colocated `.css` file per component                                                              |
| Constants      | `src/app/constants/` — facilities, leaseOptions, navLinks, sectionIds, phoneNumber               |
| Custom Hooks   | `src/app/hooks/` — `useScrolled`, `useActiveSection`, `useAutoCycle`                             |
| Views          | Single view: `HomeView.jsx` composing all sections                                               |
| Event Bus      | `window.dispatchEvent(new Event('inquiry:open'))` for modal decoupling                           |
| Data Integrity | `LEASE_OPTIONS` derived from `FACILITIES` — single source of truth                               |
| SEO            | Open Graph, Twitter Card meta tags, Schema.org JSON-LD (WebSite, Organization, 2x LocalBusiness) |
| PWA            | `manifest.json` + full icon set                                                                  |

---

## Project Stats

| Metric                     | Value |
| -------------------------- | ----- |
| Page Sections              | 5     |
| Physical Facilities        | 2     |
| CSS Custom Property Tokens | 60+   |
| Amenity Types              | 6     |
| Custom React Hooks         | 3     |
| Lease Tiers                | 2     |

---

<p align="center"><sub>Built by <strong>Trenton Taylor</strong></sub></p>
