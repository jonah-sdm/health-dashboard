import { todayISO, daysBetween, addDays } from './dates.js'

// Option B — calendar-driven decrement (PRD §4.3.4).
//
// Inventory is NOT mutated daily. Instead we derive the live quantity from
// lastRestockedDate + the quantity recorded then, decremented by
// dailyConsumption for each calendar day elapsed. The countdown is always
// current with zero user effort; the user corrects drift via "Restock".

export function computeDepletion(supp, asOfISO = todayISO()) {
  const { dailyConsumption, unitsPerContainer, currentQuantity, lastRestockedDate } = supp

  // Not set up yet — no container size / quantity / restock date entered.
  const configured =
    unitsPerContainer != null &&
    currentQuantity != null &&
    lastRestockedDate != null &&
    dailyConsumption > 0

  if (!configured) {
    return {
      configured: false,
      quantityRemaining: null,
      daysRemaining: null,
      runOutDate: null,
      progress: null,
      colorState: 'unset',
    }
  }

  const elapsed = Math.max(0, daysBetween(lastRestockedDate, asOfISO))
  const consumed = elapsed * dailyConsumption
  const quantityRemaining = Math.max(0, currentQuantity - consumed)
  const daysRemaining = Math.floor(quantityRemaining / dailyConsumption)
  const runOutDate = addDays(asOfISO, daysRemaining)
  const progress = unitsPerContainer > 0 ? quantityRemaining / unitsPerContainer : 0

  const threshold = supp.reorderThresholdDays ?? 10
  let colorState = 'green'
  if (quantityRemaining <= 0 || daysRemaining <= 3) colorState = 'red'
  else if (daysRemaining <= threshold) colorState = 'amber'

  return {
    configured: true,
    quantityRemaining: round2(quantityRemaining),
    daysRemaining,
    runOutDate,
    progress: clamp01(progress),
    colorState,
  }
}

// Supplements at/under their reorder threshold, soonest first (PRD §4.1, §4.3.5).
export function reorderAlerts(supplements, asOfISO = todayISO()) {
  return supplements
    .map((s) => ({ supp: s, dep: computeDepletion(s, asOfISO) }))
    .filter(({ dep, supp }) => dep.configured && dep.daysRemaining <= (supp.reorderThresholdDays ?? 10))
    .sort((a, b) => a.dep.daysRemaining - b.dep.daysRemaining)
}

// All supplements sorted by days-remaining ascending; unconfigured items last.
export function sortedByUrgency(supplements, asOfISO = todayISO()) {
  return supplements
    .map((s) => ({ supp: s, dep: computeDepletion(s, asOfISO) }))
    .sort((a, b) => {
      if (!a.dep.configured && !b.dep.configured) return 0
      if (!a.dep.configured) return 1
      if (!b.dep.configured) return -1
      return a.dep.daysRemaining - b.dep.daysRemaining
    })
}

function round2(n) {
  return Math.round(n * 100) / 100
}
function clamp01(n) {
  return Math.max(0, Math.min(1, n))
}
