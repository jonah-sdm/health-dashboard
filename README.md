# Vitals — Personal Health Dashboard

A private, single-user health dashboard that turns bloodwork and a supplement
protocol into something legible at a glance. **Not a medical product** — it does
not diagnose, prescribe, or replace a physician.

## What's live

- **Overview** — health summary, attention list, today's AM/PM supplement
  checklist, reorder alerts, daily habits.
- **Lab Results** — every marker grouped by body system, with status indicators
  and plain-language explainers (What it is / Why it matters / What yours
  suggests). *Real panel data.*
- **Supplement Protocol** — the daily stack with a calendar-driven depletion
  countdown (days remaining, run-out date, restock flow). *Real protocol data.*
- **Records** — your stored lab panels (local-only).
- **Devices** — connect-wearable screens (Apple Watch, Oura, WHOOP, Withings,
  Garmin, Dexcom). No device is connected by default.

## Coming soon (not backed by real data yet)

- **Genetics** — DNA-variant mapping linked to bloodwork.
- **Training** — movement protocol built around the panel.
- **Trends** — longitudinal charts; populate once a second lab panel is added.

These show honest "coming soon" / "connect device" states rather than
placeholder data.

## Architecture

A single self-contained `index.html`: inline CSS (theme system — calm/warm/vivid
× light/dark), inline seed data, and React components transpiled in the browser
via Babel standalone. React, ReactDOM, Babel, and fonts load from CDN. State
(checklist, restocks, device connections, disclaimer) persists in
`localStorage`. The `.jsx`/`.css`/`data.js` files in the source zip are the
un-inlined mirror of what's inside `index.html`.

## Deploy

Zero-build static site. `vercel.json` copies `index.html` + `favicon.svg` into
`dist/` and serves it — no framework, no bundler. Works on any static host.

## Data

Lab markers and the supplement protocol are seeded in the inline `VITALS` object
in `index.html`. To correct a value to your actual Dynacare report, edit the
relevant marker there.

## Privacy

Local-first: health data stays in the browser and is never transmitted. A
medical disclaimer appears on first run and persists in the footer. (React/Babel/
font assets do load from public CDNs; your data does not.)
