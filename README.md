# Vitals — Personal Health Dashboard

A private, single-user web dashboard that turns raw bloodwork and a supplement
protocol into something legible at a glance. Two jobs:

1. Make lab results **understandable** — every marker with its value, reference
   range, in/out-of-range status, and a plain-language explainer.
2. Track the supplement protocol with a **depletion countdown** per item, so
   reorders never get missed.

This is a personal tool, **not a medical product**. It does not diagnose,
prescribe, or replace a physician.

## Stack

- React + Vite, Tailwind CSS, Recharts (trend charts)
- **Local-first**: all data lives in the browser's `localStorage`. Nothing is
  transmitted anywhere. Seed data ships as JSON and populates the store on
  first load.

## Run

```bash
npm install
npm run dev      # dev server
npm run build    # production build → dist/
npm run preview  # preview the build
```

It's a static app — deploy `dist/` anywhere (e.g. Vercel).

## Pages

- **Overview** — health summary band (markers in range), attention list, today's
  AM/PM checklist, reorder alerts.
- **Lab Results** — markers grouped by body system, collapsible, with filter
  (all / flagged), system dropdown, free-text search, and expandable explainers.
- **Supplement Protocol** — depletion tracker (days remaining, run-out date,
  progress bar, color state), schedule table, lifestyle + daily-habits cards.
- **Trends** — placeholder until a second panel exists; then per-marker charts
  of value-over-time against the reference band.

## Depletion model (Option B — calendar-driven)

Inventory is **not** mutated daily. Live quantity is derived from
`lastRestockedDate` + the quantity recorded then, decremented by
`dailyConsumption` for each calendar day elapsed:

```
dailyConsumption = amDose + pmDose
elapsedDays      = today - lastRestockedDate
quantityRemaining = currentQuantity - (elapsedDays × dailyConsumption)
daysRemaining    = floor(quantityRemaining / dailyConsumption)
runOutDate       = today + daysRemaining
```

The countdown is always live with zero daily effort. Correct drift with
**Restock** (re-enter quantity + date), which resets the countdown. The daily
AM/PM checklist is purely a "did I take it" reminder, decoupled from inventory.

Each supplement needs a one-time setup: **units per container** + **current
quantity** + **date**. Until then the card shows "Not set up yet."

## Data

Seed files live in `src/data/`:

- `seed-supplements.json` — the 12 protocol items with exact AM/PM doses from
  the PRD. `unitsPerContainer` / `currentQuantity` are `null` for first-run
  setup (the PDF doesn't state bottle sizes).
- `seed-labs.json` — a Dynacare panel (collection 2026-05-25). **The marker
  values here are representative placeholders** authored to exercise every
  system group and status, including the markers the PRD names (TPO, Tg-Ab,
  TSH, Free T4/T3, reverse T3, Vitamin D, DHEA-S, bilirubin/Gilbert's). Replace
  the values with the real panel — the structure, grouping, statuses, severity
  ranks, and explainer text are all in place.

Status is a **stored** per-marker attribute (so `BENIGN_FLAG` overrides like
Gilbert's bilirubin don't alarm); `src/lib/status.js` also derives status from
value vs. range as a sanity check.

## Privacy

Local-first by default. No analytics, no third-party trackers, no external
calls with health data. A medical disclaimer shows on first run and is
persistently accessible in the footer/nav.

## Build phases

Phase 1 (this build): Lab Results, Supplement Protocol + depletion tracker,
Overview, local-first storage, disclaimer. Phase 2/3 (Trends with real second
panel, mobile polish, optional Supabase sync + passcode, PDF import/export)
are noted in the PRD.
