// ═══════════════════════════════════
// GeoIntel AI — Dashboard Page
// ═══════════════════════════════════

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import MapView from '../components/MapView'
import AIPanel from '../components/AIPanel'
import AlertPanel from '../components/AlertPanel'
import LayerControls from '../components/LayerControls'
import TopBar from '../components/TopBar'
import { useGeoData } from '../hooks/useGeoData'

export default function Dashboard() {
  const { conflictEvents, naturalEvents, economicEvents, tradeRoutes, allEvents, loading } = useGeoData()

  const [layers, setLayers] = useState({
    conflicts: true,
    natural: true,
    trade: true,
  })

  const [selectedEvent, setSelectedEvent] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobilePanel, setMobilePanel] = useState(null) // 'ai' | 'alerts' | 'layers' | null

  const handleToggleLayer = useCallback((key) => {
    setLayers(prev => ({ ...prev, [key]: !prev[key] }))
  }, [])

  const handleMarkerClick = useCallback((event) => {
    setSelectedEvent(event)
    // On mobile, open AI panel
    if (window.innerWidth < 768) {
      setMobilePanel('ai')
    }
  }, [])

  const handleAlertClick = useCallback((event) => {
    setSelectedEvent(event)
    if (window.innerWidth < 768) {
      setMobilePanel('ai')
    }
  }, [])

  return (
    <div className="w-full h-full flex flex-col bg-[#0a0a0f] overflow-hidden">
      {/* Top Bar */}
      <TopBar eventCount={allEvents.length} loading={loading} />

      {/* Main Content */}
      <div className="flex-1 flex relative overflow-hidden">
        {/* Map */}
        <div className="flex-1 relative">
          <MapView
            conflictEvents={conflictEvents}
            naturalEvents={naturalEvents}
            economicEvents={economicEvents}
            tradeRoutes={tradeRoutes}
            layers={layers}
            onMarkerClick={handleMarkerClick}
          />

          {/* Layer Controls — Desktop (floating over map) */}
          <div className="hidden md:block absolute top-4 left-4 z-[500]">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-panel p-3"
            >
              <LayerControls layers={layers} onToggle={handleToggleLayer} />
            </motion.div>
          </div>

          {/* Alert panel — Desktop (floating bottom-left) */}
          <div className="hidden md:block absolute bottom-4 left-4 z-[500] w-80">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="glass-panel p-4 max-h-72 overflow-y-auto cyber-scrollbar"
            >
              <AlertPanel allEvents={allEvents} onEventClick={handleAlertClick} />
            </motion.div>
          </div>

          {/* Mobile floating buttons */}
          <div className="md:hidden absolute bottom-4 left-4 right-4 z-[500] flex gap-2">
            {[
              { key: 'layers', label: 'Layers', icon: '◎' },
              { key: 'alerts', label: 'Alerts', icon: '⚡' },
              { key: 'ai', label: 'AI', icon: '🧠' },
            ].map((btn) => (
              <motion.button
                key={btn.key}
                whileTap={{ scale: 0.95 }}
                onClick={() => setMobilePanel(mobilePanel === btn.key ? null : btn.key)}
                className={`flex-1 glass-panel py-2.5 text-center text-xs tracking-wider transition-all ${
                  mobilePanel === btn.key ? 'border-[rgba(0,255,159,0.5)] text-[#00FF9F]' : 'text-gray-400'
                }`}
                style={{ fontFamily: 'var(--font-display)' }}
                id={`mobile-${btn.key}-btn`}
              >
                {btn.icon} {btn.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Right Sidebar — Desktop */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 340, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="hidden md:flex flex-col border-l border-[rgba(0,255,159,0.1)] bg-[rgba(6,8,12,0.95)] overflow-hidden"
            >
              <div className="flex-1 p-4 overflow-y-auto">
                <AIPanel selectedEvent={selectedEvent} allEvents={allEvents} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sidebar toggle — Desktop */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-[510] items-center justify-center w-5 h-12 bg-[rgba(0,255,159,0.1)] border border-[rgba(0,255,159,0.2)] rounded-l-md text-[#00FF9F] text-xs hover:bg-[rgba(0,255,159,0.2)] transition-colors"
          style={{ right: sidebarOpen ? '340px' : '0', transition: 'right 0.4s' }}
          id="sidebar-toggle-btn"
        >
          {sidebarOpen ? '›' : '‹'}
        </button>

        {/* Mobile Panels */}
        <AnimatePresence>
          {mobilePanel && (
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="md:hidden absolute bottom-16 left-0 right-0 z-[510] glass-panel rounded-t-2xl border-t border-[rgba(0,255,159,0.3)] max-h-[60vh] overflow-y-auto"
            >
              {/* Drag handle */}
              <div className="flex justify-center py-2">
                <div className="w-8 h-1 rounded-full bg-[rgba(0,255,159,0.3)]" />
              </div>
              <div className="px-4 pb-4">
                {mobilePanel === 'layers' && (
                  <LayerControls layers={layers} onToggle={handleToggleLayer} />
                )}
                {mobilePanel === 'alerts' && (
                  <AlertPanel allEvents={allEvents} onEventClick={handleAlertClick} />
                )}
                {mobilePanel === 'ai' && (
                  <AIPanel selectedEvent={selectedEvent} allEvents={allEvents} />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
