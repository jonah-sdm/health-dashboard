import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import seedLabs from '../data/seed-labs.json'
import seedSupplements from '../data/seed-supplements.json'
import { todayISO } from './dates.js'

// Local-first storage (PRD §5.2, §6). Everything lives in localStorage; nothing
// is transmitted externally. Seed data populates the store on first run only —
// after that the user's edits (restocks, config, checklist) are authoritative.

const STORAGE_KEY = 'vitals.v1'

function freshState() {
  return {
    version: 1,
    labs: seedLabs,
    supplements: seedSupplements.supplements,
    lifestyle: seedSupplements.lifestyle,
    settings: {
      reorderThresholdDays: seedSupplements.reorderThresholdDaysDefault ?? 10,
      disclaimerAccepted: false,
    },
    // Daily "did I take it" checklist, keyed by date then by `${id}:${slot}`.
    // Purely a reminder — decoupled from inventory (PRD §4.3.4).
    checklist: {},
  }
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return freshState()
    const parsed = JSON.parse(raw)
    // Shallow-merge so new seed fields appear without wiping user data.
    return { ...freshState(), ...parsed, settings: { ...freshState().settings, ...parsed.settings } }
  } catch (e) {
    console.warn('Failed to load state, starting fresh:', e)
    return freshState()
  }
}

const StoreContext = createContext(null)

export function StoreProvider({ children }) {
  const [state, setState] = useState(load)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch (e) {
      console.warn('Failed to persist state:', e)
    }
  }, [state])

  const updateSupplement = useCallback((id, patch) => {
    setState((s) => ({
      ...s,
      supplements: s.supplements.map((sup) => (sup.id === id ? { ...sup, ...patch } : sup)),
    }))
  }, [])

  // Restock resets the countdown: record new quantity + restock date (PRD §4.3.5).
  const restock = useCallback((id, { quantity, date, unitsPerContainer }) => {
    setState((s) => ({
      ...s,
      supplements: s.supplements.map((sup) =>
        sup.id === id
          ? {
              ...sup,
              currentQuantity: quantity,
              lastRestockedDate: date || todayISO(),
              ...(unitsPerContainer != null ? { unitsPerContainer } : {}),
            }
          : sup,
      ),
    }))
  }, [])

  const toggleChecklist = useCallback((dateISO, key) => {
    setState((s) => {
      const day = { ...(s.checklist[dateISO] || {}) }
      day[key] = !day[key]
      return { ...s, checklist: { ...s.checklist, [dateISO]: day } }
    })
  }, [])

  const acceptDisclaimer = useCallback(() => {
    setState((s) => ({ ...s, settings: { ...s.settings, disclaimerAccepted: true } }))
  }, [])

  const setReorderThreshold = useCallback((days) => {
    setState((s) => ({ ...s, settings: { ...s.settings, reorderThresholdDays: days } }))
  }, [])

  const resetAll = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setState(freshState())
  }, [])

  const value = {
    state,
    updateSupplement,
    restock,
    toggleChecklist,
    acceptDisclaimer,
    setReorderThreshold,
    resetAll,
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
