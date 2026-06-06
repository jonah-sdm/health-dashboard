import { useState } from 'react'
import { formatDate } from '../lib/dates.js'
import RestockModal from './RestockModal.jsx'

const UNIT_LABEL = { CAPSULE: 'caps', SCOOP: 'scoops', ML: 'mL', CUBE: 'cubes' }

const BAR = {
  green: 'bg-ok',
  amber: 'bg-warn',
  red: 'bg-alert',
}
const BADGE = {
  green: 'text-ok',
  amber: 'text-warn',
  red: 'text-alert',
}

export default function SupplementCard({ supplement, depletion }) {
  const [showModal, setShowModal] = useState(false)
  const unit = UNIT_LABEL[supplement.unit] || ''

  return (
    <div className="card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-medium text-ink">{supplement.name}</h3>
          <p className="text-xs text-slatey">{supplement.brand}</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex-none rounded-lg border border-slate-300 px-2.5 py-1 text-xs font-medium text-slatey hover:bg-slate-50"
        >
          {depletion.configured ? 'Restock' : 'Set up'}
        </button>
      </div>

      <div className="mt-2 text-xs text-slatey">
        AM {supplement.amDose} · PM {supplement.pmDose} · {supplement.dailyConsumption} {unit}/day
      </div>

      {depletion.configured ? (
        <>
          <div className="mt-4 flex items-end justify-between">
            <div>
              <div className={`text-3xl font-bold leading-none ${BADGE[depletion.colorState]}`}>
                {depletion.daysRemaining}
              </div>
              <div className="text-xs text-slatey">days remaining</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-ink">{formatDate(depletion.runOutDate)}</div>
              <div className="text-xs text-slatey">projected run-out</div>
            </div>
          </div>

          <div className="mt-3">
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full ${BAR[depletion.colorState]}`}
                style={{ width: `${Math.round(depletion.progress * 100)}%` }}
              />
            </div>
            <div className="mt-1 flex justify-between text-[11px] text-slatey">
              <span>
                {depletion.quantityRemaining} / {supplement.unitsPerContainer} {unit}
              </span>
              {depletion.colorState !== 'green' && (
                <span className={BADGE[depletion.colorState]}>
                  {depletion.colorState === 'red' ? 'Reorder now' : 'Reorder soon'}
                </span>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="mt-4 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 py-4 text-center text-sm text-slatey">
          Not set up yet. Add container size + current quantity to start the countdown.
        </div>
      )}

      {supplement.notes && <p className="mt-3 text-xs italic text-slate-400">{supplement.notes}</p>}

      {showModal && <RestockModal supplement={supplement} onClose={() => setShowModal(false)} />}
    </div>
  )
}
