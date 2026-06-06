import { useStore } from '../lib/store.jsx'

// First-run modal (PRD §6). Calm, non-alarming. Blocks until acknowledged.
export default function DisclaimerModal() {
  const { state, acceptDisclaimer } = useStore()
  if (state.settings.disclaimerAccepted) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4">
      <div className="card max-w-lg p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-ink">Before you start</h2>
        <div className="mt-3 space-y-3 text-sm leading-relaxed text-slatey">
          <p>
            <strong className="text-ink">Vitals is a personal record and inventory tracker — not medical
            advice.</strong> It does not diagnose, prescribe, or replace a physician.
          </p>
          <p>
            The plain-language explainers describe what markers mean in general terms. Any out-of-range
            value, and any change to your supplement protocol, should be reviewed with your doctor.
          </p>
          <p>
            Your data stays on this device. Nothing here is transmitted to any server.
          </p>
        </div>
        <button
          onClick={acceptDisclaimer}
          className="mt-6 w-full rounded-lg bg-ink px-4 py-2.5 text-sm font-medium text-white hover:bg-ink/90"
        >
          I understand
        </button>
      </div>
    </div>
  )
}
