// ═══════════════════════════════════
// GeoIntel AI — Layer Controls
// ═══════════════════════════════════

import { motion } from 'framer-motion'

const layerConfig = [
  {
    key: 'conflicts',
    label: 'Conflicts',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2L2 12l10 10 10-10L12 2z" />
        <path d="M12 8v4" />
        <path d="M12 16h.01" />
      </svg>
    ),
    color: '#ff3b3b',
    dotColor: 'bg-[#ff3b3b]',
  },
  {
    key: 'natural',
    label: 'Natural Events',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2v20" />
        <path d="M2 12h20" />
        <circle cx="12" cy="12" r="10" />
      </svg>
    ),
    color: '#3b9dff',
    dotColor: 'bg-[#3b9dff]',
  },
  {
    key: 'trade',
    label: 'Trade Routes',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 12h18" />
        <path d="M3 6h18" />
        <path d="M3 18h18" />
      </svg>
    ),
    color: '#ffd93b',
    dotColor: 'bg-[#ffd93b]',
  },
]

export default function LayerControls({ layers, onToggle }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="text-[10px] tracking-[3px] text-gray-500 uppercase mb-1 px-1" style={{ fontFamily: 'var(--font-mono)' }}>
        Layers
      </div>
      {layerConfig.map((layer) => {
        const active = layers[layer.key]
        return (
          <motion.button
            key={layer.key}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onToggle(layer.key)}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg border transition-all duration-300 text-left w-full ${
              active
                ? 'border-opacity-40 bg-opacity-10'
                : 'border-[rgba(255,255,255,0.05)] bg-transparent opacity-50'
            }`}
            style={{
              borderColor: active ? `${layer.color}40` : undefined,
              background: active ? `${layer.color}10` : undefined,
            }}
            id={`layer-toggle-${layer.key}`}
          >
            {/* Indicator */}
            <div
              className={`w-2 h-2 rounded-full transition-all duration-300 ${active ? '' : 'opacity-30'}`}
              style={{
                background: layer.color,
                boxShadow: active ? `0 0 8px ${layer.color}` : 'none',
              }}
            />
            {/* Icon */}
            <span style={{ color: active ? layer.color : '#666' }}>{layer.icon}</span>
            {/* Label */}
            <span
              className={`text-[11px] tracking-wider ${active ? 'text-white' : 'text-gray-600'}`}
              style={{ fontFamily: 'var(--font-body)' }}
            >
              {layer.label}
            </span>
            {/* Toggle indicator */}
            <div className="ml-auto">
              <div
                className={`w-7 h-3.5 rounded-full transition-all duration-300 relative ${
                  active ? 'bg-opacity-30' : 'bg-gray-800'
                }`}
                style={{ background: active ? `${layer.color}30` : undefined }}
              >
                <motion.div
                  className="absolute top-0.5 w-2.5 h-2.5 rounded-full"
                  animate={{ left: active ? '14px' : '2px' }}
                  transition={{ duration: 0.2 }}
                  style={{ background: active ? layer.color : '#444' }}
                />
              </div>
            </div>
          </motion.button>
        )
      })}
    </div>
  )
}
