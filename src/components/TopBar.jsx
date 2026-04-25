// ═══════════════════════════════════
// GeoIntel AI — Top Status Bar
// ═══════════════════════════════════

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

export default function TopBar({ eventCount = 0, loading = false }) {
  const navigate = useNavigate()
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="h-12 glass-panel rounded-none border-t-0 border-x-0 flex items-center justify-between px-4 md:px-6 z-50 relative"
      style={{ borderBottom: '1px solid rgba(0,255,159,0.15)' }}
    >
      {/* Left: Logo */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          id="home-btn"
        >
          <div className="relative">
            <div className="w-7 h-7 rounded-full border border-[rgba(0,255,159,0.5)] flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-[#00FF9F]" style={{ boxShadow: '0 0 8px #00FF9F' }} />
            </div>
            <motion.div
              className="absolute inset-0 rounded-full border border-[rgba(0,255,159,0.2)]"
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
          <span
            className="text-sm tracking-[3px] text-[#00FF9F] hidden md:block"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            GEOINTEL
          </span>
        </button>
        <div className="hidden md:block h-5 w-px bg-[rgba(0,255,159,0.2)]" />
        <span className="hidden md:block text-[10px] tracking-[2px] text-gray-500" style={{ fontFamily: 'var(--font-mono)' }}>
          DASHBOARD v2.1
        </span>
      </div>

      {/* Center: Status indicators */}
      <div className="flex items-center gap-4 md:gap-8">
        <div className="flex items-center gap-1.5">
          <motion.div
            className={`w-1.5 h-1.5 rounded-full ${loading ? 'bg-[#ffd93b]' : 'bg-[#00FF9F]'}`}
            animate={loading ? { opacity: [1, 0.3, 1] } : {}}
            transition={{ duration: 0.8, repeat: Infinity }}
            style={{ boxShadow: loading ? '0 0 6px #ffd93b' : '0 0 6px #00FF9F' }}
          />
          <span className="text-[10px] text-gray-500 tracking-wider hidden sm:block" style={{ fontFamily: 'var(--font-mono)' }}>
            {loading ? 'SYNCING' : 'LIVE'}
          </span>
        </div>

        <div className="text-[10px] text-gray-500 tracking-wider" style={{ fontFamily: 'var(--font-mono)' }}>
          <span className="text-[#00FF9F]">{eventCount}</span> EVENTS
        </div>
      </div>

      {/* Right: Time */}
      <div className="flex items-center gap-4">
        <div className="text-right">
          <div className="text-[11px] text-[#00FF9F] tracking-wider" style={{ fontFamily: 'var(--font-mono)' }}>
            {time.toISOString().split('T')[1].split('.')[0]}
          </div>
          <div className="text-[9px] text-gray-600 tracking-wider" style={{ fontFamily: 'var(--font-mono)' }}>
            UTC
          </div>
        </div>
      </div>
    </motion.div>
  )
}
