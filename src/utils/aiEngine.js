// ═══════════════════════════════════
// GeoIntel AI — AI Analysis Engine
// Rule-based "AI" logic
// ═══════════════════════════════════

const conflictKeywords = ['war', 'conflict', 'military', 'attack', 'battle', 'invasion', 'escalation', 'militia', 'proxy', 'nato', 'weapon', 'strike', 'casualties', 'troops', 'artillery']
const disasterKeywords = ['earthquake', 'tsunami', 'volcano', 'flood', 'cyclone', 'hurricane', 'typhoon', 'wildfire', 'drought', 'landslide', 'storm']
const economicKeywords = ['trade', 'sanctions', 'tariff', 'oil', 'semiconductor', 'supply chain', 'port', 'blockade', 'embargo', 'inflation']

function countKeywordMatches(text, keywords) {
  const lower = text.toLowerCase()
  return keywords.filter(k => lower.includes(k)).length
}

export function calculateRiskScore(event, allEvents = []) {
  let score = 0
  const title = (event.title || '').toLowerCase()
  const severity = (event.severity || '').toLowerCase()

  // Base score from severity
  if (severity === 'critical') score += 85
  else if (severity === 'high') score += 70
  else if (severity === 'medium') score += 50
  else if (severity === 'low') score += 25
  else score += 40

  // Keyword analysis
  const conflictHits = countKeywordMatches(title, conflictKeywords)
  const disasterHits = countKeywordMatches(title, disasterKeywords)
  const economicHits = countKeywordMatches(title, economicKeywords)

  score += conflictHits * 5
  score += disasterHits * 3
  score += economicHits * 2

  // Category-based adjustments
  if (event.category === 'conflict') score += 10
  if (event.category === 'natural') score += 5

  // Proximity bonus: if multiple events are nearby
  if (allEvents.length > 0 && event.lat && event.lng) {
    const nearbyCount = allEvents.filter(e => {
      if (e.id === event.id) return false
      const dist = Math.sqrt(Math.pow(e.lat - event.lat, 2) + Math.pow(e.lng - event.lng, 2))
      return dist < 10 // ~10 degrees
    }).length
    score += nearbyCount * 8
  }

  return Math.min(Math.max(Math.round(score), 0), 100)
}

export function getRiskLevel(score) {
  if (score >= 75) return { level: 'CRITICAL', color: '#ff3b3b' }
  if (score >= 50) return { level: 'HIGH', color: '#ffa53b' }
  if (score >= 25) return { level: 'MEDIUM', color: '#ffd93b' }
  return { level: 'LOW', color: '#00FF9F' }
}

export function generateSummary(event) {
  const title = event.title || 'Unknown Event'
  const category = event.category || 'unknown'
  const severity = event.severity || 'Unknown'

  const summaries = {
    conflict: [
      `Active conflict zone detected. ${title} represents a significant security concern with potential regional destabilization implications.`,
      `Intelligence indicates ongoing hostile activity. ${title} has been flagged for escalation potential and requires continuous monitoring.`,
      `Multiple indicators suggest heightened threat level. ${title} could trigger cascading security events across adjacent territories.`,
    ],
    natural: [
      `Environmental hazard identified. ${title} poses immediate risk to civilian populations and critical infrastructure in the affected region.`,
      `Natural disaster event tracked. ${title} requires humanitarian response coordination and could disrupt supply chains.`,
      `Geophysical event detected with ${severity} impact assessment. ${title} may compound existing regional vulnerabilities.`,
    ],
    economic: [
      `Economic disruption detected. ${title} has implications for global trade flow and market stability.`,
      `Trade intelligence alert: ${title} may affect strategic resource availability and supply chain resilience.`,
      `Financial sector impact assessment ongoing. ${title} could trigger market volatility across connected economies.`,
    ],
  }

  const options = summaries[category] || summaries.conflict
  return options[Math.floor(Math.random() * options.length)]
}

export function generateWhyMatters(event) {
  const category = event.category || 'conflict'
  const score = event.riskScore || calculateRiskScore(event)

  const reasons = {
    conflict: [
      'Direct impact on regional security architecture and alliance commitments.',
      'Potential for civilian casualties and displacement requires international attention.',
      'Risk of escalation could draw in major powers and reshape geopolitical balance.',
      'Intelligence assets in the region report increased military communications.',
    ],
    natural: [
      'Critical infrastructure vulnerability exposed; cascading failures possible.',
      'Humanitarian corridor assessment needed for response coordination.',
      'Economic impact on regional GDP estimated at significant levels.',
      'Climate pattern analysis suggests increased frequency of similar events.',
    ],
    economic: [
      'Global supply chain disruption risk elevated across interconnected markets.',
      'Strategic resource availability may be constrained, affecting allied nations.',
      'Market volatility indicators suggest broader financial system stress.',
      'Trade route reconfiguration may be necessary, increasing transit costs.',
    ],
  }

  const options = reasons[category] || reasons.conflict
  const selected = options[Math.floor(Math.random() * options.length)]

  if (score >= 75) {
    return `⚠️ PRIORITY ALERT: ${selected} Immediate attention recommended.`
  }
  return selected
}

export function analyzeEvent(event, allEvents = []) {
  const riskScore = calculateRiskScore(event, allEvents)
  const riskLevel = getRiskLevel(riskScore)
  const summary = generateSummary(event)
  const whyMatters = generateWhyMatters({ ...event, riskScore })

  return {
    riskScore,
    riskLevel,
    summary,
    whyMatters,
  }
}
