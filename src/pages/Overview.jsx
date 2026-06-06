import { useStore } from '../lib/store.jsx'
import { isFlagged } from '../lib/status.js'
import { reorderAlerts } from '../lib/depletion.js'
import { todayISO, formatRelative } from '../lib/dates.js'

export default function Overview({ onNavigate }) {
  const { state, toggleChecklist } = useStore()
  const panel = state.labs.panels[0]
  const markers = panel?.markers || []

  const flagged = markers.filter((m) => isFlagged(m.status))
  const benign = markers.filter((m) => m.status === 'BENIGN_FLAG')
  const inRange = markers.length - flagged.length

  const attention = [...flagged, ...benign].sort((a, b) => b.severityRank - a.severityRank)
  const alerts = reorderAlerts(state.supplements)
  const today = todayISO()
  const checklistToday = state.checklist[today] || {}

  return (
    <div className="space-y-6">
      <PageHeader title="Overview" subtitle={`How am I doing, and what do I need today — ${formatRelative(today)}`} />

      {/* Health summary band */}
      <button
        onClick={() => onNavigate('labs', { filter: 'flagged' })}
        className="card flex w-full items-center justify-between p-5 text-left hover:bg-slate-50"
      >
        <div>
          <div className="text-2xl font-semibold text-ink">
            {inRange} of {markers.length}{' '}
            <span className="text-base font-normal text-slatey">markers in optimal range</span>
          </div>
          <div className="mt-1 text-sm text-slatey">
            {flagged.length > 0
              ? `${flagged.length} flagged${benign.length ? ` · ${benign.length} flagged but benign` : ''} — tap to review`
              : 'Everything in range'}
          </div>
        </div>
        <RingStat inRange={inRange} total={markers.length} />
      </button>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Attention list */}
        <section>
          <SectionTitle>Worth attention</SectionTitle>
          <div className="mt-3 space-y-2">
            {attention.length === 0 && <Empty>No markers flagged.</Empty>}
            {attention.map((m) => (
              <button
                key={m.id}
                onClick={() => onNavigate('labs', { filter: 'all', focus: m.id })}
                className="card flex w-full items-start gap-3 p-3 text-left hover:bg-slate-50"
              >
                <Severity status={m.status} />
                <div className="min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="font-medium text-ink">{m.name}</span>
                    <span className="text-sm text-slatey">
                      {m.value}
                      {m.unit ? ` ${m.unit}` : ''}
                    </span>
                  </div>
                  <p className="mt-0.5 line-clamp-2 text-sm text-slatey">{m.explainer?.whatYoursSuggests}</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        <div className="space-y-6">
          {/* Reorder alerts */}
          <section>
            <SectionTitle>Reorder alerts</SectionTitle>
            <div className="mt-3 space-y-2">
              {alerts.length === 0 && <Empty>Nothing to reorder right now.</Empty>}
              {alerts.map(({ supp, dep }) => (
                <button
                  key={supp.id}
                  onClick={() => onNavigate('supplements')}
                  className="card flex w-full items-center justify-between p-3 text-left hover:bg-slate-50"
                >
                  <div>
                    <div className="font-medium text-ink">Reorder {supp.name}</div>
                    <div className="text-xs text-slatey">{supp.brand}</div>
                  </div>
                  <span
                    className={`pill ${dep.colorState === 'red' ? 'bg-alertbg text-alert' : 'bg-warnbg text-warn'}`}
                  >
                    {dep.daysRemaining} days left
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* Today's supplements checklist */}
          <section>
            <SectionTitle>Today's supplements</SectionTitle>
            <p className="mt-1 text-xs text-slate-400">A "did I take it" reminder — does not affect inventory.</p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <ChecklistColumn
                title="AM"
                items={state.supplements.filter((s) => s.amDose > 0)}
                slot="am"
                checklist={checklistToday}
                onToggle={(key) => toggleChecklist(today, key)}
              />
              <ChecklistColumn
                title="PM"
                items={state.supplements.filter((s) => s.pmDose > 0)}
                slot="pm"
                checklist={checklistToday}
                onToggle={(key) => toggleChecklist(today, key)}
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

function ChecklistColumn({ title, items, slot, checklist, onToggle }) {
  return (
    <div className="card p-3">
      <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">{title}</div>
      <ul className="space-y-1.5">
        {items.map((s) => {
          const key = `${s.id}:${slot}`
          const checked = !!checklist[key]
          const dose = slot === 'am' ? s.amDose : s.pmDose
          return (
            <li key={key}>
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onToggle(key)}
                  className="h-4 w-4 rounded border-slate-300 text-ink focus:ring-ink"
                />
                <span className={checked ? 'text-slate-400 line-through' : 'text-ink'}>
                  {s.name} <span className="text-slate-400">×{dose}</span>
                </span>
              </label>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function RingStat({ inRange, total }) {
  const pct = total ? inRange / total : 1
  const r = 26
  const c = 2 * Math.PI * r
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" className="flex-none">
      <circle cx="36" cy="36" r={r} fill="none" stroke="#e2e8f0" strokeWidth="7" />
      <circle
        cx="36"
        cy="36"
        r={r}
        fill="none"
        stroke="#3f9d6b"
        strokeWidth="7"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - pct)}
        transform="rotate(-90 36 36)"
      />
      <text x="36" y="40" textAnchor="middle" className="fill-ink text-sm font-semibold">
        {Math.round(pct * 100)}%
      </text>
    </svg>
  )
}

function Severity({ status }) {
  const color = status === 'BORDERLINE' ? 'bg-warn' : status === 'BENIGN_FLAG' ? 'bg-info' : 'bg-alert'
  return <span className={`mt-1.5 h-2.5 w-2.5 flex-none rounded-full ${color}`} />
}

function PageHeader({ title, subtitle }) {
  return (
    <div>
      <h1 className="text-xl font-semibold text-ink">{title}</h1>
      {subtitle && <p className="text-sm text-slatey">{subtitle}</p>}
    </div>
  )
}
function SectionTitle({ children }) {
  return <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">{children}</h2>
}
function Empty({ children }) {
  return <div className="card px-4 py-6 text-center text-sm text-slatey">{children}</div>
}
