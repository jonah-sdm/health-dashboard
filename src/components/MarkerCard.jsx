import { useState } from 'react'
import StatusPill from './StatusPill.jsx'
import { formatRange } from '../lib/status.js'

export default function MarkerCard({ marker }) {
  const [open, setOpen] = useState(false)
  const { explainer } = marker

  return (
    <div className="card overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-start gap-3 p-4 text-left hover:bg-slate-50"
        aria-expanded={open}
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="font-medium text-ink">{marker.name}</span>
            <StatusPill status={marker.status} />
          </div>
          <div className="mt-1 flex flex-wrap items-baseline gap-x-3 text-sm text-slatey">
            <span>
              <span className="text-lg font-semibold text-ink">{marker.value}</span>
              {marker.unit ? <span className="ml-1">{marker.unit}</span> : null}
            </span>
            <span className="text-slate-400">·</span>
            <span>Ref: {formatRange(marker)}</span>
          </div>
        </div>
        <svg
          className={`mt-1 h-4 w-4 flex-none text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </button>

      {open && (
        <div className="border-t border-slate-100 bg-slate-50/60 px-4 py-4">
          <dl className="space-y-3 text-sm">
            <Field label="What it is" value={explainer?.whatItIs} />
            <Field label="Why it matters" value={explainer?.whyItMatters} />
            <Field label="What your number suggests" value={explainer?.whatYoursSuggests} />
          </dl>
          {marker.labNote && (
            <p className="mt-4 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs italic text-slatey">
              Lab note: {marker.labNote}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

function Field({ label, value }) {
  if (!value) return null
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</dt>
      <dd className="mt-0.5 leading-relaxed text-ink/90">{value}</dd>
    </div>
  )
}
