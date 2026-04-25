// ═══════════════════════════════════
// GeoIntel AI — Landing Page
// ═══════════════════════════════════

import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useEffect, useState, useRef } from 'react'

function RadarBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Grid */}
      <div
        className="absolute inset-0 animate-grid opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,255,159,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,159,0.3) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Center radar */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        {[300, 220, 140, 60].map((size, i) => (
          <div
            key={i}
            className="absolute rounded-full border"
            style={{
              width: size, height: size,
              top: `calc(50% - ${size / 2}px)`,
              left: `calc(50% - ${size / 2}px)`,
              borderColor: `rgba(0,255,159,${0.08 + i * 0.04})`,
            }}
          />
        ))}
        {/* Sweep */}
        <div
          className="absolute animate-radar"
          style={{
            width: 300, height: 300,
            top: 'calc(50% - 150px)',
            left: 'calc(50% - 150px)',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '50%',
              height: '2px',
              background: 'linear-gradient(90deg, rgba(0,255,159,0.8), transparent)',
              transformOrigin: '0 50%',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '150px',
              height: '150px',
              background: 'conic-gradient(from 0deg, rgba(0,255,159,0.15) 0deg, transparent 40deg)',
              transformOrigin: '0 0',
              borderRadius: '0 150px 0 0',
            }}
          />
        </div>
        {/* Center dot */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#00FF9F]" style={{ boxShadow: '0 0 15px #00FF9F, 0 0 30px rgba(0,255,159,0.5)' }} />
      </div>

      {/* Floating blips */}
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={`blip-${i}`}
          className="absolute w-1.5 h-1.5 rounded-full bg-[#00FF9F]"
          style={{
            top: `${15 + Math.random() * 70}%`,
            left: `${10 + Math.random() * 80}%`,
            boxShadow: '0 0 8px #00FF9F',
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0.5, 1.2, 0.5],
          }}
          transition={{
            duration: 2 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 3,
          }}
        />
      ))}

      {/* Scanline */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,159,0.02) 2px, rgba(0,255,159,0.02) 4px)',
        }}
      />
    </div>
  )
}

function TypewriterText({ text, delay = 0 }) {
  const [displayed, setDisplayed] = useState('')
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  useEffect(() => {
    if (!started) return
    let i = 0
    const interval = setInterval(() => {
      if (i <= text.length) {
        setDisplayed(text.slice(0, i))
        i++
      } else {
        clearInterval(interval)
      }
    }, 40)
    return () => clearInterval(interval)
  }, [started, text])

  return (
    <span>
      {displayed}
      {displayed.length < text.length && started && (
        <span className="animate-flicker text-[#00FF9F]">▊</span>
      )}
    </span>
  )
}

function StatsBar() {
  const stats = [
    { label: 'ACTIVE THREATS', value: '2,847' },
    { label: 'MONITORED ZONES', value: '194' },
    { label: 'DATA SOURCES', value: '12,500+' },
    { label: 'UPTIME', value: '99.97%' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 3.5, duration: 0.8 }}
      className="flex flex-wrap justify-center gap-6 md:gap-10 mt-12"
    >
      {stats.map((stat, i) => (
        <div key={i} className="text-center">
          <div className="text-xl md:text-2xl font-bold text-[#00FF9F]" style={{ fontFamily: 'var(--font-display)', textShadow: '0 0 10px rgba(0,255,159,0.4)' }}>
            {stat.value}
          </div>
          <div className="text-[10px] md:text-xs tracking-[3px] text-gray-500 mt-1" style={{ fontFamily: 'var(--font-mono)' }}>
            {stat.label}
          </div>
        </div>
      ))}
    </motion.div>
  )
}

export default function LandingPage() {
  const navigate = useNavigate()
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative w-full h-full bg-[#0a0a0f] flex items-center justify-center overflow-hidden">
      <RadarBackground />

      {/* Corner decorations */}
      {['top-4 left-4', 'top-4 right-4', 'bottom-4 left-4', 'bottom-4 right-4'].map((pos, i) => (
        <div
          key={i}
          className={`absolute ${pos} w-12 h-12 opacity-30`}
          style={{
            borderTop: i < 2 ? '2px solid #00FF9F' : 'none',
            borderBottom: i >= 2 ? '2px solid #00FF9F' : 'none',
            borderLeft: i % 2 === 0 ? '2px solid #00FF9F' : 'none',
            borderRight: i % 2 === 1 ? '2px solid #00FF9F' : 'none',
          }}
        />
      ))}

      {/* Top bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute top-6 left-0 right-0 flex justify-between items-center px-8 md:px-16"
      >
        <div className="text-[10px] tracking-[4px] text-gray-600" style={{ fontFamily: 'var(--font-mono)' }}>
          SYS.STATUS: <span className="text-[#00FF9F]">ONLINE</span>
        </div>
        <div className="text-[10px] tracking-[2px] text-gray-600" style={{ fontFamily: 'var(--font-mono)' }}>
          {time.toISOString().split('.')[0]}Z
        </div>
      </motion.div>

      {/* Main content */}
      <div className="relative z-10 text-center px-6 max-w-4xl">
        {/* Classification badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-8"
        >
          <span
            className="inline-block px-4 py-1.5 text-[10px] tracking-[5px] border border-[rgba(0,255,159,0.3)] text-[#00FF9F] uppercase"
            style={{ fontFamily: 'var(--font-mono)', background: 'rgba(0,255,159,0.05)' }}
          >
            ▸ CLASSIFIED INTELLIGENCE SYSTEM ▸
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.8, type: 'spring' }}
          className="text-5xl md:text-7xl lg:text-8xl font-black tracking-wider mb-6 animate-glow-pulse"
          style={{
            fontFamily: 'var(--font-display)',
            color: '#00FF9F',
            letterSpacing: '0.1em',
          }}
        >
          GeoIntel AI
        </motion.h1>

        {/* Subtitle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="text-lg md:text-xl text-gray-400 mb-4 tracking-wide"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          <TypewriterText text="Real-Time Global Intelligence Dashboard" delay={1800} />
        </motion.div>

        {/* Sub-subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3 }}
          className="text-xs md:text-sm text-gray-600 mb-10 tracking-[3px] uppercase"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          Monitoring • Analysis • Prediction
        </motion.p>

        {/* Enter button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.2, duration: 0.6 }}
        >
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-neon"
            id="enter-dashboard-btn"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" />
            </svg>
            Enter Dashboard
          </button>
        </motion.div>

        <StatsBar />
      </div>

      {/* Bottom bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 4 }}
        className="absolute bottom-6 left-0 right-0 flex justify-center"
      >
        <div className="text-[9px] tracking-[3px] text-gray-700 uppercase" style={{ fontFamily: 'var(--font-mono)' }}>
          Authorized Personnel Only • Encryption: AES-256 • Protocol: SIGINT-7
        </div>
      </motion.div>
    </div>
  )
}
