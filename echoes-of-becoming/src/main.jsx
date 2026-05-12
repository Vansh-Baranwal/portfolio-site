import React from 'react'
import ReactDOM from 'react-dom/client'
import SpiralJourney from './SpiralJourney'
import CompetitiveArenas from './CompetitiveArenas'

const rootEl = document.getElementById('react-timeline-root')
if (rootEl) {
  // Note: NOT using StrictMode — it double-mounts/unmounts components,
  // which crashes React Three Fiber's Canvas (it manages its own DOM).
  ReactDOM.createRoot(rootEl).render(<SpiralJourney />)
}

const arenasRootEl = document.getElementById('react-arenas-root')
if (arenasRootEl) {
  ReactDOM.createRoot(arenasRootEl).render(<CompetitiveArenas />)
}
