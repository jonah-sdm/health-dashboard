import { useStore } from '../lib/store.jsx'
import { formatDate } from '../lib/dates.js'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceArea,
  CartesianGrid,
} from 'recharts'

// Priority markers to trend given the current picture (PRD §4.4).
const PRIORITY = [
  'tpo-ab',
  'tg-ab',
  'tsh',
  'free-t4',
  'free-t3',
  'vitamin-d-25oh',
  'dhea-s',
  'reverse-t3',
]

export default function Trends() {
  const { state } = useStore()
  const panels = state.labs.panels

  if (panels.length < 2) {
    return (
      <div className="space-y-5">
        <div>
          <h1 className="text-xl font-semibold text-ink">Trends</h1>
          <p className="text-sm text-slatey">Longitudinal view across blood draws.</p>
        </div>
        <div className="card p-8 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-infobg text-info">
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M4 19V5M4 19h16M8 15l3-4 3 2 4-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h2 className="font-medium text-ink">Trends populate after your next blood draw</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-slatey">
            You currently have one panel ({formatDate(panels[0]?.collectionDate)}). Once a second panel is added,
            this page will chart each marker's value over time against its reference band.
          </p>
          <div className="mx-auto mt-5 max-w-md text-left">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Markers queued to trend
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {PRIORITY.map((id) => {
                const m = panels[0]?.markers.find((x) => x.id === id)
                if (!m) return null
                return (
                  <span key={id} className="pill bg-slate-100 text-slatey">
                    {m.name}
                  </span>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ≥2 panels: build per-marker series sorted by collection date.
  const ordered = [...panels].sort((a, b) => a.collectionDate.localeCompare(b.collectionDate))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-ink">Trends</h1>
        <p className="text-sm text-slatey">{ordered.length} panels · value over time vs. reference band</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {PRIORITY.map((id) => (
          <MarkerTrend key={id} markerId={id} panels={ordered} />
        ))}
      </div>
    </div>
  )
}

function MarkerTrend({ markerId, panels }) {
  const series = panels
    .map((p) => {
      const m = p.markers.find((x) => x.id === markerId)
      if (!m || typeof m.value !== 'number') return null
      return { date: p.collectionDate, value: m.value, marker: m }
    })
    .filter(Boolean)

  if (series.length < 2) return null
  const ref = series[series.length - 1].marker
  const values = series.map((s) => s.value)
  const lo = ref.refLow
  const hi = ref.refHigh
  const min = Math.min(...values, lo ?? Infinity)
  const max = Math.max(...values, hi ?? -Infinity)
  const pad = (max - min) * 0.15 || 1

  return (
    <div className="card p-4">
      <div className="mb-1 flex items-baseline justify-between">
        <h3 className="font-medium text-ink">{ref.name}</h3>
        <span className="text-xs text-slatey">{ref.unit}</span>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={series} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eef2f6" />
          {lo != null && hi != null && (
            <ReferenceArea y1={lo} y2={hi} fill="#e8f4ec" fillOpacity={0.7} />
          )}
          <XAxis
            dataKey="date"
            tickFormatter={(d) => formatDate(d, { month: 'short', year: '2-digit' })}
            tick={{ fontSize: 11, fill: '#5b6776' }}
          />
          <YAxis domain={[min - pad, max + pad]} tick={{ fontSize: 11, fill: '#5b6776' }} width={44} />
          <Tooltip
            formatter={(v) => [`${v} ${ref.unit}`, ref.name]}
            labelFormatter={(d) => formatDate(d)}
          />
          <Line type="monotone" dataKey="value" stroke="#1a2230" strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
