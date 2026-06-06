import { statusMeta } from '../lib/status.js'

const TONE = {
  ok: 'bg-okbg text-ok',
  warn: 'bg-warnbg text-warn',
  alert: 'bg-alertbg text-alert',
  info: 'bg-infobg text-info',
}

const DOT = {
  ok: 'bg-ok',
  warn: 'bg-warn',
  alert: 'bg-alert',
  info: 'bg-info',
}

export default function StatusPill({ status }) {
  const meta = statusMeta(status)
  return (
    <span className={`pill ${TONE[meta.tone]}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${DOT[meta.tone]}`} />
      {meta.label}
    </span>
  )
}
