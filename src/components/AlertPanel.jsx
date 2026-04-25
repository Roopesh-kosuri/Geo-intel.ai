// ═══════════════════════════════════
// GeoIntel AI — Alert Panel
// ═══════════════════════════════════

import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { calculateRiskScore, getRiskLevel } from '../utils/aiEngine'

export default function AlertPanel({ allEvents = [], onEventClick }) {
  // Get top 5 events sorted by risk
  const topAlerts = useMemo(() => {
    return allEvents
      .map(evt => {
        const riskScore = calculateRiskScore(evt, allEvents)
        return { ...evt, riskScore, riskLevel: getRiskLevel(riskScore) }
      })
      .sort((a, b) => b.riskScore - a.riskScore)
      .slice(0, 10)
  }, [allEvents])

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-[rgba(0,255,159,0.15)]">
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-2 h-2 rounded-full bg-[#ff3b3b]"
            style={{ boxShadow: '0 0 8px #ff3b3b' }}
          />
          <h2 className="text-sm tracking-[4px] text-[#00FF9F] uppercase" style={{ fontFamily: 'var(--font-display)' }}>
            Alerts
          </h2>
        </div>
        <span className="text-[10px] text-gray-600 tracking-[2px]" style={{ fontFamily: 'var(--font-mono)' }}>
          {allEvents.length} TOTAL
        </span>
      </div>

      {/* Alerts list */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 cyber-scrollbar">
        <AnimatePresence>
          {topAlerts.map((alert, i) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => onEventClick?.(alert)}
              className={`group cursor-pointer rounded-lg p-3 transition-all duration-300 border ${
                alert.riskScore >= 75
                  ? 'border-[rgba(255,59,59,0.3)] bg-[rgba(255,59,59,0.05)] hover:bg-[rgba(255,59,59,0.1)]'
                  : alert.riskScore >= 50
                  ? 'border-[rgba(255,165,59,0.2)] bg-[rgba(255,165,59,0.03)] hover:bg-[rgba(255,165,59,0.08)]'
                  : 'border-[rgba(0,255,159,0.1)] bg-[rgba(0,255,159,0.02)] hover:bg-[rgba(0,255,159,0.05)]'
              }`}
            >
              <div className="flex items-start gap-2.5">
                {/* Category indicator */}
                <div className="mt-0.5 flex-shrink-0">
                  <span className={`block w-2 h-2 rounded-full ${
                    alert.category === 'conflict' ? 'bg-[#ff3b3b]' :
                    alert.category === 'natural' ? 'bg-[#3b9dff]' :
                    'bg-[#ffd93b]'
                  }`} style={{
                    boxShadow: alert.category === 'conflict' ? '0 0 6px #ff3b3b' : alert.category === 'natural' ? '0 0 6px #3b9dff' : '0 0 6px #ffd93b'
                  }} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className="text-[11px] font-semibold text-white truncate leading-tight" style={{ fontFamily: 'var(--font-body)' }}>
                      {alert.title}
                    </h4>
                    <span
                      className="flex-shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded tracking-wider"
                      style={{
                        fontFamily: 'var(--font-display)',
                        color: alert.riskLevel.color,
                        background: `${alert.riskLevel.color}15`,
                      }}
                    >
                      {alert.riskScore}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[9px] text-gray-600" style={{ fontFamily: 'var(--font-mono)' }}>
                    <span>{alert.source}</span>
                    <span>•</span>
                    <span>{alert.date}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {topAlerts.length === 0 && (
          <div className="flex-1 flex items-center justify-center py-8">
            <p className="text-[11px] text-gray-600 tracking-[2px]" style={{ fontFamily: 'var(--font-mono)' }}>
              NO ACTIVE ALERTS
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
