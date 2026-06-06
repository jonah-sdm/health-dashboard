import { useState } from 'react'
import { useStore } from '../lib/store.jsx'
import { todayISO } from '../lib/dates.js'

const UNIT_LABEL = { CAPSULE: 'capsules', SCOOP: 'scoops', ML: 'mL', CUBE: 'cubes' }

// Restock / first-time setup modal (PRD §4.3.2, §4.3.5). Entering quantity +
// date resets the countdown. unitsPerContainer is the one-time container size.
export default function RestockModal({ supplement, onClose }) {
  const { restock } = useStore()
  const unitLabel = UNIT_LABEL[supplement.unit] || 'units'
  const isFirstSetup = supplement.currentQuantity == null

  const [unitsPerContainer, setUnitsPerContainer] = useState(supplement.unitsPerContainer ?? '')
  const [quantity, setQuantity] = useState(supplement.unitsPerContainer ?? '')
  const [date, setDate] = useState(todayISO())

  function submit(e) {
    e.preventDefault()
    const q = parseFloat(quantity)
    const upc = parseFloat(unitsPerContainer)
    if (Number.isNaN(q) || Number.isNaN(upc)) return
    restock(supplement.id, { quantity: q, date, unitsPerContainer: upc })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4" onClick={onClose}>
      <div className="card w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-base font-semibold text-ink">
          {isFirstSetup ? 'Set up' : 'Restock'} — {supplement.name}
        </h3>
        <p className="mt-1 text-sm text-slatey">
          {isFirstSetup
            ? `Enter the container size and how much you have right now (${unitLabel}).`
            : `Enter the new amount on hand. This resets the countdown.`}
        </p>

        <form onSubmit={submit} className="mt-4 space-y-4">
          <Labeled label={`Units per container (${unitLabel})`}>
            <input
              type="number"
              step="any"
              min="0"
              required
              value={unitsPerContainer}
              onChange={(e) => setUnitsPerContainer(e.target.value)}
              className="input"
              placeholder="e.g. 60"
            />
          </Labeled>

          <Labeled label={`Current quantity on hand (${unitLabel})`}>
            <input
              type="number"
              step="any"
              min="0"
              required
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="input"
              placeholder="what's left right now"
            />
          </Labeled>

          <Labeled label="As of date">
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="input"
            />
          </Labeled>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slatey hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-lg bg-ink px-4 py-2 text-sm font-medium text-white hover:bg-ink/90"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Labeled({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</span>
      {children}
    </label>
  )
}
