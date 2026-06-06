import { useStore } from '../lib/store.jsx'
import { sortedByUrgency } from '../lib/depletion.js'
import SupplementCard from '../components/SupplementCard.jsx'

const UNIT_LABEL = { CAPSULE: 'caps', SCOOP: 'scoops', ML: 'mL', CUBE: 'cubes' }

export default function Supplements() {
  const { state } = useStore()
  const ranked = sortedByUrgency(state.supplements)
  const { lifestyle } = state

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-ink">Supplement Protocol</h1>
        <p className="text-sm text-slatey">
          Depletion tracker — sorted by days remaining, so the next reorder is always first.
        </p>
      </div>

      {/* Depletion tracker grid (core feature) */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {ranked.map(({ supp, dep }) => (
          <SupplementCard key={supp.id} supplement={supp} depletion={dep} />
        ))}
      </div>

      {/* Schedule table */}
      <section>
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">Daily schedule</h2>
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-400">
                  <th className="px-4 py-2.5 font-semibold">Supplement</th>
                  <th className="px-4 py-2.5 font-semibold">Brand</th>
                  <th className="px-4 py-2.5 text-center font-semibold">AM</th>
                  <th className="px-4 py-2.5 text-center font-semibold">PM</th>
                  <th className="px-4 py-2.5 font-semibold">Unit</th>
                </tr>
              </thead>
              <tbody>
                {state.supplements.map((s) => (
                  <tr key={s.id} className="border-b border-slate-100 last:border-0">
                    <td className="px-4 py-2.5 font-medium text-ink">{s.name}</td>
                    <td className="px-4 py-2.5 text-slatey">{s.brand}</td>
                    <td className="px-4 py-2.5 text-center text-ink">{s.amDose || '—'}</td>
                    <td className="px-4 py-2.5 text-center text-ink">{s.pmDose || '—'}</td>
                    <td className="px-4 py-2.5 text-slatey">{UNIT_LABEL[s.unit] || s.unit.toLowerCase()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Lifestyle + daily habits */}
      <div className="grid gap-3 md:grid-cols-2">
        <section className="card p-4">
          <h3 className="text-sm font-semibold text-ink">Lifestyle</h3>
          <ul className="mt-2 space-y-2 text-sm text-slatey">
            <li className="flex gap-2">
              <span aria-hidden>☀️</span>
              <span>{lifestyle?.morning}</span>
            </li>
            <li className="flex gap-2">
              <span aria-hidden>🌙</span>
              <span>{lifestyle?.evening}</span>
            </li>
          </ul>
        </section>
        <section className="card p-4">
          <h3 className="text-sm font-semibold text-ink">Daily habits</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {(lifestyle?.dailyHabits || []).map((h) => (
              <span key={h.label} className="pill bg-okbg text-ok">
                {h.label} — {h.detail}
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
