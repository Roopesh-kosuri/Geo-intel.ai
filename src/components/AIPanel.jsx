// ═══════════════════════════════════
// GeoIntel AI — AI Analysis Panel
// ═══════════════════════════════════

import { useMemo, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { analyzeEvent } from '../utils/aiEngine'

function TypewriterLine({ text, delay = 0, speed = 20 }) {
  const [displayed, setDisplayed] = useState('')

  useEffect(() => {
    setDisplayed('')
    const timer = setTimeout(() => {
      let i = 0
      const interval = setInterval(() => {
        if (i <= text.length) {
          setDisplayed(text.slice(0, i))
          i++
        } else {
          clearInterval(interval)
        }
      }, speed)
      return () => clearInterval(interval)
    }, delay)
    return () => clearTimeout(timer)
  }, [text, delay, speed])

  return <span>{displayed}</span>
}

function RiskGauge({ score, color }) {
  return (
    <div className="relative w-full">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-[10px] tracking-[2px] text-gray-500" style={{ fontFamily: 'var(--font-mono)' }}>
          RISK LEVEL
        </span>
        <span className="text-lg font-bold" style={{ fontFamily: 'var(--font-display)', color, textShadow: `0 0 10px ${color}40` }}>
          {score}
        </span>
      </div>
      <div className="risk-meter">
        <motion.div
          className="risk-meter-fill"
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{ background: `linear-gradient(90deg, ${color}80, ${color})`, boxShadow: `0 0 10px ${color}60` }}
        />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-[8px] text-gray-600" style={{ fontFamily: 'var(--font-mono)' }}>0</span>
        <span className="text-[8px] text-gray-600" style={{ fontFamily: 'var(--font-mono)' }}>25</span>
        <span className="text-[8px] text-gray-600" style={{ fontFamily: 'var(--font-mono)' }}>50</span>
        <span className="text-[8px] text-gray-600" style={{ fontFamily: 'var(--font-mono)' }}>75</span>
        <span className="text-[8px] text-gray-600" style={{ fontFamily: 'var(--font-mono)' }}>100</span>
      </div>
    </div>
  )
}

export default function AIPanel({ selectedEvent, allEvents = [] }) {
  const analysis = useMemo(() => {
    if (!selectedEvent) return null
    return analyzeEvent(selectedEvent, allEvents)
  }, [selectedEvent, allEvents])

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[rgba(0,255,159,0.15)]">
        <div className="w-2 h-2 rounded-full bg-[#00FF9F] animate-pulse" style={{ boxShadow: '0 0 8px #00FF9F' }} />
        <h2 className="text-sm tracking-[4px] text-[#00FF9F] uppercase" style={{ fontFamily: 'var(--font-display)' }}>
          AI Analysis
        </h2>
      </div>

      <AnimatePresence mode="wait">
        {!selectedEvent ? (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center text-center px-4"
          >
            {/* Animated brain icon */}
            <motion.div
              animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="mb-6"
            >
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#00FF9F" strokeWidth="1" opacity="0.4">
                <path d="M12 2a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V17a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 0 0-7-7z" />
                <path d="M10 21h4" />
                <path d="M12 6v4" />
                <path d="M10 10h4" />
              </svg>
            </motion.div>
            <p className="text-xs text-gray-500 tracking-[2px] mb-2" style={{ fontFamily: 'var(--font-mono)' }}>
              NEURAL ENGINE STANDBY
            </p>
            <p className="text-[11px] text-gray-600" style={{ fontFamily: 'var(--font-body)' }}>
              Select a marker on the map to initiate analysis
            </p>

            {/* Fake processing lines */}
            <div className="mt-6 w-full space-y-1.5 opacity-30">
              {['Scanning global feeds...', 'Monitoring 194 zones...', 'Models loaded: 7/7'].map((line, i) => (
                <div key={i} className="flex items-center gap-2 text-[9px] text-gray-600" style={{ fontFamily: 'var(--font-mono)' }}>
                  <span className="text-[#00FF9F]">▸</span>
                  {line}
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key={selectedEvent.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="flex-1 overflow-y-auto pr-1 space-y-5 cyber-scrollbar"
          >
            {/* Event title */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`w-2.5 h-2.5 rounded-full ${
                  selectedEvent.category === 'conflict' ? 'bg-[#ff3b3b]' :
                  selectedEvent.category === 'natural' ? 'bg-[#3b9dff]' :
                  'bg-[#ffd93b]'
                }`} style={{ boxShadow: selectedEvent.category === 'conflict' ? '0 0 8px #ff3b3b' : selectedEvent.category === 'natural' ? '0 0 8px #3b9dff' : '0 0 8px #ffd93b' }} />
                <span className="text-[10px] tracking-[2px] text-gray-500 uppercase" style={{ fontFamily: 'var(--font-mono)' }}>
                  {selectedEvent.category || 'event'} • {selectedEvent.severity}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-white leading-snug" style={{ fontFamily: 'var(--font-body)' }}>
                {selectedEvent.title}
              </h3>
              <div className="text-[10px] text-gray-600 mt-1" style={{ fontFamily: 'var(--font-mono)' }}>
                SRC: {selectedEvent.source} • {selectedEvent.date}
              </div>
            </div>

            {/* Risk Score */}
            {analysis && (
              <>
                <div>
                  <RiskGauge score={analysis.riskScore} color={analysis.riskLevel.color} />
                  <div className="mt-2 flex items-center gap-2">
                    <span
                      className="px-2 py-0.5 text-[10px] tracking-[2px] rounded font-bold"
                      style={{
                        fontFamily: 'var(--font-display)',
                        color: analysis.riskLevel.color,
                        background: `${analysis.riskLevel.color}15`,
                        border: `1px solid ${analysis.riskLevel.color}30`,
                      }}
                    >
                      {analysis.riskLevel.level}
                    </span>
                  </div>
                </div>

                {/* Summary */}
                <div className="cyber-data-box">
                  <div className="cyber-scan-line"></div>
                  <div className="text-[10px] tracking-[2px] text-[#00FF9F] mb-2 font-bold" style={{ fontFamily: 'var(--font-mono)', textShadow: '0 0 8px rgba(0,255,159,0.5)' }}>
                    [SYS.LOG] INTELLIGENCE SUMMARY
                  </div>
                  <p className="text-xs text-white leading-relaxed tracking-wide" style={{ fontFamily: 'var(--font-body)' }}>
                    <TypewriterLine text={analysis.summary} delay={200} speed={15} />
                  </p>
                </div>

                {/* Why it matters */}
                <div className="cyber-data-box" style={{ borderLeftColor: '#ff3b3b', background: 'linear-gradient(180deg, rgba(255,59,59,0.03) 0%, rgba(255,59,59,0.01) 100%)' }}>
                  <div className="cyber-scan-line" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,59,59,0.8), transparent)', boxShadow: '0 0 8px rgba(255,59,59,0.8)' }}></div>
                  <div className="text-[10px] tracking-[2px] text-[#ff3b3b] mb-2 font-bold" style={{ fontFamily: 'var(--font-mono)', textShadow: '0 0 8px rgba(255,59,59,0.5)' }}>
                    [WARN] STRATEGIC IMPORTANCE
                  </div>
                  <p className="text-xs text-white leading-relaxed tracking-wide" style={{ fontFamily: 'var(--font-body)' }}>
                    <TypewriterLine text={analysis.whyMatters} delay={800} speed={15} />
                  </p>
                </div>

                {/* Coordinates */}
                <div className="pt-3 border-t border-[rgba(0,255,159,0.1)]">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-[9px] tracking-[2px] text-gray-600 block" style={{ fontFamily: 'var(--font-mono)' }}>LAT</span>
                      <span className="text-xs text-[#00FF9F]" style={{ fontFamily: 'var(--font-mono)' }}>{selectedEvent.lat?.toFixed(4)}</span>
                    </div>
                    <div>
                      <span className="text-[9px] tracking-[2px] text-gray-600 block" style={{ fontFamily: 'var(--font-mono)' }}>LNG</span>
                      <span className="text-xs text-[#00FF9F]" style={{ fontFamily: 'var(--font-mono)' }}>{selectedEvent.lng?.toFixed(4)}</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
