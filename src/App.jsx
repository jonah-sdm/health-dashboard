import { useState } from 'react'
import { StoreProvider } from './lib/store.jsx'
import Layout from './components/Layout.jsx'
import DisclaimerModal from './components/DisclaimerModal.jsx'
import Overview from './pages/Overview.jsx'
import LabResults from './pages/LabResults.jsx'
import Supplements from './pages/Supplements.jsx'
import Trends from './pages/Trends.jsx'

export default function App() {
  // Simple tab-based nav (no router dependency). `nav` carries optional params
  // so the Overview can deep-link into Lab Results with a filter/focus.
  const [nav, setNav] = useState({ page: 'overview', params: {} })

  const navigate = (page, params = {}) => {
    setNav({ page, params })
    window.scrollTo({ top: 0 })
  }

  return (
    <StoreProvider>
      <DisclaimerModal />
      <Layout active={nav.page} onNavigate={navigate}>
        {nav.page === 'overview' && <Overview onNavigate={navigate} />}
        {nav.page === 'labs' && (
          <LabResults initialFilter={nav.params.filter || 'all'} focusId={nav.params.focus || null} />
        )}
        {nav.page === 'supplements' && <Supplements />}
        {nav.page === 'trends' && <Trends />}
      </Layout>
    </StoreProvider>
  )
}
