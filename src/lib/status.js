// Marker status helpers (PRD §4.2.2).
//
// Status is primarily a STORED display attribute per marker (so authored
// overrides like BENIGN_FLAG and severityRank are honoured). We expose a
// derive() that computes a status from value vs. range as a fallback / sanity
// check — but stored status wins, per the PRD's "benign-when-flagged" override.

export const STATUS_META = {
  IN_RANGE: { label: 'In range', tone: 'ok' },
  HIGH: { label: 'High', tone: 'alert' },
  LOW: { label: 'Low', tone: 'alert' },
  BORDERLINE: { label: 'Borderline', tone: 'warn' },
  BENIGN_FLAG: { label: 'Flagged · benign', tone: 'info' },
  QUALITATIVE: { label: 'Qualitative', tone: 'ok' },
}

export function statusMeta(status) {
  return STATUS_META[status] || STATUS_META.QUALITATIVE
}

// True for statuses that should count against the "in optimal range" tally
// and surface on the attention list. Benign + qualitative do not alarm.
export function isFlagged(status) {
  return status === 'HIGH' || status === 'LOW' || status === 'BORDERLINE'
}

// Fallback derivation from numeric value vs. range bounds.
export function deriveStatus(marker) {
  if (typeof marker.value !== 'number') return 'QUALITATIVE'
  const { value, refLow, refHigh } = marker
  if (refHigh != null && value > refHigh) return 'HIGH'
  if (refLow != null && value < refLow) return 'LOW'
  return 'IN_RANGE'
}

export function formatRange(marker) {
  const { refLow, refHigh, unit } = marker
  const u = unit ? ` ${unit}` : ''
  if (refLow != null && refHigh != null) return `${refLow}–${refHigh}${u}`
  if (refHigh != null) return `< ${refHigh}${u}`
  if (refLow != null) return `> ${refLow}${u}`
  return '—'
}
