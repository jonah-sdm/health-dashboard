const NAV = [
  { id: 'overview', label: 'Overview', icon: IconHome },
  { id: 'labs', label: 'Lab Results', icon: IconBeaker },
  { id: 'supplements', label: 'Supplements', icon: IconPill },
  { id: 'trends', label: 'Trends', icon: IconChart },
]

export default function Layout({ active, onNavigate, children }) {
  return (
    <div className="min-h-screen md:flex">
      {/* Desktop left nav */}
      <aside className="hidden w-60 flex-none border-r border-slate-200 bg-white md:flex md:flex-col">
        <div className="px-5 py-5">
          <div className="text-lg font-semibold text-ink">Vitals</div>
          <div className="text-xs text-slatey">Personal health dashboard</div>
        </div>
        <nav className="flex-1 space-y-1 px-3">
          {NAV.map((item) => (
            <NavButton key={item.id} item={item} active={active === item.id} onClick={() => onNavigate(item.id)} />
          ))}
        </nav>
        <div className="px-5 py-4 text-[11px] leading-relaxed text-slate-400">
          Personal record &amp; inventory tracker. Not medical advice — confirm any concern with your doctor.
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile header */}
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 md:hidden">
          <span className="font-semibold text-ink">Vitals</span>
          <span className="text-xs text-slatey">{NAV.find((n) => n.id === active)?.label}</span>
        </header>

        <main className="flex-1 px-4 py-5 pb-24 sm:px-6 md:px-8 md:pb-10">
          <div className="mx-auto max-w-5xl">{children}</div>
        </main>

        {/* Persistent disclaimer footer (desktop) */}
        <footer className="hidden border-t border-slate-200 bg-white px-8 py-3 text-center text-[11px] text-slate-400 md:block">
          Vitals is a personal record and inventory tracker, not medical advice. Lab interpretation and protocol
          changes should be confirmed with a physician.
        </footer>
      </div>

      {/* Mobile bottom tab bar */}
      <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-slate-200 bg-white md:hidden">
        {NAV.map((item) => {
          const Icon = item.icon
          const isActive = active === item.id
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] ${
                isActive ? 'text-ink' : 'text-slate-400'
              }`}
            >
              <Icon className="h-5 w-5" active={isActive} />
              {item.label.split(' ')[0]}
            </button>
          )
        })}
      </nav>
    </div>
  )
}

function NavButton({ item, active, onClick }) {
  const Icon = item.icon
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${
        active ? 'bg-ink text-white' : 'text-slatey hover:bg-slate-100'
      }`}
    >
      <Icon className="h-5 w-5" active={active} />
      {item.label}
    </button>
  )
}

/* --- Minimal inline icons (no icon dependency) --- */
function IconHome({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 11l9-8 9 8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 10v10h14V10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function IconBeaker({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M9 3h6M10 3v6l-5 9a2 2 0 002 3h10a2 2 0 002-3l-5-9V3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function IconPill({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="8" width="18" height="8" rx="4" />
      <path d="M12 8v8" />
    </svg>
  )
}
function IconChart({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 19V5M4 19h16M8 15l3-4 3 2 4-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
