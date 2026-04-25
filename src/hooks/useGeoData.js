// ═══════════════════════════════════
// GeoIntel AI — Data Fetching Hooks
// ═══════════════════════════════════

import { useState, useEffect, useCallback } from 'react'
import {
  mockConflictEvents,
  mockNaturalEvents,
  mockEconomicEvents,
  mockTradeRoutes,
} from '../utils/mockData'

// ── Fetch EONET natural events ──
function parseEONETEvents(data) {
  if (!data?.events) return []
  return data.events.slice(0, 15).map((evt, i) => {
    const geo = evt.geometry?.[0]
    let lat = 0, lng = 0
    if (geo?.coordinates) {
      lng = geo.coordinates[0]
      lat = geo.coordinates[1]
    }
    const category = evt.categories?.[0]?.title || 'Unknown'
    let severity = 'Medium'
    if (category.toLowerCase().includes('volcano') || category.toLowerCase().includes('earthquake')) severity = 'High'
    if (category.toLowerCase().includes('severe')) severity = 'Critical'

    return {
      id: `eonet-${evt.id || i}`,
      title: evt.title || 'Natural Event',
      lat,
      lng,
      severity,
      source: 'NASA EONET',
      category: 'natural',
      type: category,
      date: evt.geometry?.[0]?.date?.split('T')[0] || new Date().toISOString().split('T')[0],
    }
  }).filter(e => e.lat !== 0 || e.lng !== 0)
}

// ── Fetch NewsAPI conflict events (with coord estimation) ──
const regionCoords = {
  'ukraine': { lat: 48.38, lng: 31.17 },
  'russia': { lat: 55.75, lng: 37.62 },
  'china': { lat: 39.9, lng: 116.4 },
  'taiwan': { lat: 25.0, lng: 121.5 },
  'iran': { lat: 35.7, lng: 51.4 },
  'israel': { lat: 31.8, lng: 35.2 },
  'gaza': { lat: 31.5, lng: 34.4 },
  'syria': { lat: 33.5, lng: 36.3 },
  'yemen': { lat: 15.4, lng: 44.2 },
  'sudan': { lat: 15.6, lng: 32.5 },
  'myanmar': { lat: 19.8, lng: 96.2 },
  'afghanistan': { lat: 34.5, lng: 69.2 },
  'north korea': { lat: 39.0, lng: 125.8 },
  'pakistan': { lat: 33.7, lng: 73.0 },
  'iraq': { lat: 33.3, lng: 44.4 },
  'libya': { lat: 32.9, lng: 13.2 },
  'somalia': { lat: 2.0, lng: 45.3 },
  'ethiopia': { lat: 9.0, lng: 38.7 },
  'sahel': { lat: 14.0, lng: 2.0 },
  'mali': { lat: 12.6, lng: -8.0 },
  'niger': { lat: 13.5, lng: 2.1 },
  'congo': { lat: -4.3, lng: 15.3 },
  'nato': { lat: 50.8, lng: 4.4 },
  'europe': { lat: 50.0, lng: 10.0 },
  'asia': { lat: 35.0, lng: 105.0 },
  'africa': { lat: 0.0, lng: 25.0 },
  'middle east': { lat: 30.0, lng: 45.0 },
  'south china sea': { lat: 15.0, lng: 114.0 },
  'baltic': { lat: 56.0, lng: 24.0 },
  'arctic': { lat: 71.0, lng: 25.0 },
  'india': { lat: 28.6, lng: 77.2 },
  'lebanon': { lat: 33.9, lng: 35.5 },
  'korea': { lat: 37.6, lng: 127.0 },
}

function estimateCoords(text) {
  const lower = (text || '').toLowerCase()
  for (const [region, coords] of Object.entries(regionCoords)) {
    if (lower.includes(region)) {
      return {
        lat: coords.lat + (Math.random() - 0.5) * 3,
        lng: coords.lng + (Math.random() - 0.5) * 3,
      }
    }
  }
  // Random location if no match
  return {
    lat: (Math.random() - 0.5) * 120,
    lng: (Math.random() - 0.5) * 300,
  }
}

function parseNewsEvents(data) {
  if (!data?.articles) return []
  return data.articles.slice(0, 12).map((article, i) => {
    const coords = estimateCoords(article.title + ' ' + (article.description || ''))
    const title = article.title?.split(' - ')[0] || 'News Event'
    let severity = 'Medium'
    const lower = title.toLowerCase()
    if (lower.includes('war') || lower.includes('attack') || lower.includes('kill') || lower.includes('bomb')) severity = 'Critical'
    else if (lower.includes('conflict') || lower.includes('tension') || lower.includes('crisis')) severity = 'High'
    else if (lower.includes('trade') || lower.includes('sanction') || lower.includes('economic')) severity = 'Medium'

    return {
      id: `news-${i}`,
      title,
      lat: coords.lat,
      lng: coords.lng,
      severity,
      source: article.source?.name || 'NewsAPI',
      category: 'conflict',
      date: article.publishedAt?.split('T')[0] || new Date().toISOString().split('T')[0],
      url: article.url,
    }
  })
}

// ── Main hook ──
export function useGeoData() {
  const [conflictEvents, setConflictEvents] = useState([])
  const [naturalEvents, setNaturalEvents] = useState([])
  const [economicEvents, setEconomicEvents] = useState(mockEconomicEvents.map(e => ({ ...e, category: 'economic' })))
  const [tradeRoutes] = useState(mockTradeRoutes)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)

    // Fetch EONET
    try {
      const eonetRes = await fetch('https://eonet.gsfc.nasa.gov/api/v3/events?limit=15&status=open')
      if (eonetRes.ok) {
        const eonetData = await eonetRes.json()
        const parsed = parseEONETEvents(eonetData)
        if (parsed.length > 0) {
          setNaturalEvents(parsed)
        } else {
          setNaturalEvents(mockNaturalEvents.map(e => ({ ...e, category: 'natural' })))
        }
      } else {
        throw new Error('EONET failed')
      }
    } catch {
      console.warn('EONET API failed, using mock data')
      setNaturalEvents(mockNaturalEvents.map(e => ({ ...e, category: 'natural' })))
    }

    // Fetch News (Free API, Live Data)
    try {
      const newsRes = await fetch(
        'https://saurav.tech/NewsAPI/everything/cnn.json'
      )
      if (newsRes.ok) {
        const newsData = await newsRes.json()
        const parsed = parseNewsEvents(newsData)
        
        // Filter for military, geopolitical, trade, and major global news
        const intelKeywords = ['war', 'conflict', 'military', 'attack', 'strike', 'troop', 'missile', 'russia', 'ukraine', 'gaza', 'israel', 'sudan', 'navy', 'bomb', 'trade', 'geopolitics', 'economy', 'sanction', 'summit', 'government', 'president', 'crisis', 'cyber', 'election', 'diplomat']
        const intelNews = parsed.filter(news => {
          const lower = news.title.toLowerCase()
          return intelKeywords.some(kw => lower.includes(kw))
        })
        
        // Combine live intel news with our highly detailed geopolitical mock data
        const combinedConflicts = [
          ...intelNews,
          ...mockConflictEvents.map(e => ({ ...e, category: 'conflict' }))
        ]
        
        setConflictEvents(combinedConflicts)
      } else {
        throw new Error('News failed')
      }
    } catch {
      console.warn('News API failed, using mock data')
      setConflictEvents(mockConflictEvents.map(e => ({ ...e, category: 'conflict' })))
    }

    setLoading(false)
  }, [])

  useEffect(() => {
    fetchData()
    // Refresh every 5 minutes
    const interval = setInterval(fetchData, 300000)
    return () => clearInterval(interval)
  }, [fetchData])

  const allEvents = [...conflictEvents, ...naturalEvents, ...economicEvents]

  return {
    conflictEvents,
    naturalEvents,
    economicEvents,
    tradeRoutes,
    allEvents,
    loading,
    error,
    refetch: fetchData,
  }
}
