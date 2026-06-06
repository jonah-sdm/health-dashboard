import { useEffect, useMemo, useRef, useState } from 'react'
import { useStore } from '../lib/store.jsx'
import { isFlagged } from '../lib/status.js'
import { formatDate } from '../lib/dates.js'
import MarkerCard from '../components/MarkerCard.jsx'

// Canonical group order (PRD §4.2.1).
const GROUP_ORDER = [
  'Thyroid & Autoimmune',
  'Metabolic & Blood Sugar',
  'Lipids & Cardiovascular',
  'Hormones',
  'Liver & Biliary',
  'Kidney & Electrolytes',
  'Iron & Blood',
  'Vitamins & Minerals',
  'Inflammation',
  'Complete Blood Count',
  'Urinalysis',
  'Other / Misc',
]

export default function LabResults({ initialFilter = 'all', focusId = null }) {
  const { state } = useStore()
  const panel = state.labs.panels[0]
  const markers = panel?.markers || []

  const [filter, setFilter] = useState(initialFilter)
  const [groupFilter, setGroupFilter] = useState('all')
  const [query, setQuery] = useState('')
  const [collapsed, setCollapsed] = useState({})
  const focusRef = useRef(null)

  useEffect(() => setFilter(initialFilter), [initialFilter])

  // Scroll a focused marker into view when arriving from the attention list.
  useEffect(() => {
    if (focusId && focusRef.current) {
      focusRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [focusId])

  const groupsPresent = useMemo(() => {
    const set = new Set(markers.map((m) => m.group))
    return GROUP_ORDER.filter((g) => set.has(g))
  }, [markers])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return markers.filter((m) => {
      if (filter === 'flagged' && !isFlagged(m.status)) return false
      if (groupFilter !== 'all' && m.group !== groupFilter) return false
      if (q && !m.name.toLowerCase().includes(q)) return false
      return true
    })
  }, [markers, filter, groupFilter, query])

  const byGroup = useMemo(() => {
    const map = {}
    for (const m of filtered) (map[m.group] ||= []).push(m)
    return map
  }, [filtered])

  const visibleGroups = groupsPresent.filter((g) => byGroup[g]?.length)

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-ink">Lab Results</h1>
          {panel && (
            <p className="text-sm text-slatey">
              {panel.labName} · collected {formatDate(panel.collectionDate)} · {panel.fasting ? 'fasting' : 'non-fasting'}
            </p>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="card flex flex-col gap-3 p-3 sm:flex-row sm:items-center">
        <div className="flex gap-1 rounded-lg bg-slate-100 p-1">
          {[
            ['all', 'All'],
            ['flagged', 'Flagged'],
          ].map(([id, label]) => (
            <button
              key={id}
              onClick={() => setFilter(id)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium ${
                filter === id ? 'bg-white text-ink shadow-sm' : 'text-slatey'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <select
          value={groupFilter}
          onChange={(e) => setGroupFilter(e.target.value)}
          className="input sm:w-56"
        >
          <option value="all">All systems</option>
          {groupsPresent.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>

        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search markers…"
          className="input flex-1"
        />
      </div>

      {visibleGroups.length === 0 && (
        <div className="card px-4 py-10 text-center text-sm text-slatey">No markers match these filters.</div>
      )}

      {visibleGroups.map((group) => {
        const items = byGroup[group]
        const flaggedCount = items.filter((m) => isFlagged(m.status)).length
        const isCollapsed = collapsed[group]
        return (
          <section key={group}>
            <button
              onClick={() => setCollapsed((c) => ({ ...c, [group]: !c[group] }))}
              className="mb-2 flex w-full items-center justify-between text-left"
            >
              <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
                {group}
                <span className="text-xs font-normal normal-case text-slate-400">({items.length})</span>
                {flaggedCount > 0 && (
                  <span className="pill bg-warnbg text-warn">{flaggedCount} flagged</span>
                )}
              </h2>
              <svg
                className={`h-4 w-4 text-slate-400 transition-transform ${isCollapsed ? '-rotate-90' : ''}`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
              </svg>
            </button>
            {!isCollapsed && (
              <div className="space-y-2">
                {items.map((m) => (
                  <div key={m.id} ref={m.id === focusId ? focusRef : null}>
                    <MarkerCard marker={m} />
                  </div>
                ))}
              </div>
            )}
          </section>
        )
      })}
    </div>
  )
}
