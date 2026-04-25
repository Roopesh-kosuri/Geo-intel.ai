// ═══════════════════════════════════
// GeoIntel AI — Map Component (Leaflet + OpenStreetMap)
// No API key needed!
// ═══════════════════════════════════

import { useEffect, useRef, useCallback, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Dark map tiles — free, no key needed
const DARK_TILES = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
const DARK_ATTRIBUTION = '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'

function createMarkerIcon(color) {
  return L.divIcon({
    className: '',
    html: `
      <div style="
        width: 16px; height: 16px; border-radius: 50%;
        background: ${color};
        box-shadow: 0 0 12px ${color}, 0 0 24px ${color}66;
        cursor: pointer;
        position: relative;
      ">
        <div style="
          position: absolute; top: 50%; left: 50%;
          width: 100%; height: 100%; border-radius: 50%;
          transform: translate(-50%, -50%);
          background: ${color};
          animation: marker-pulse 2s ease-out infinite;
        "></div>
      </div>
    `,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    popupAnchor: [0, -12],
  })
}

const conflictIcon = createMarkerIcon('#ff3b3b')
const naturalIcon = createMarkerIcon('#3b9dff')
const economicIcon = createMarkerIcon('#ffd93b')

export default function MapView({
  conflictEvents = [],
  naturalEvents = [],
  economicEvents = [],
  tradeRoutes = [],
  layers = { conflicts: true, natural: true, trade: true },
  onMarkerClick,
}) {
  const mapContainerRef = useRef(null)
  const mapRef = useRef(null)
  const layerGroupsRef = useRef({
    conflicts: null,
    natural: null,
    economic: null,
    trade: null,
  })

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return

    const map = L.map(mapContainerRef.current, {
      center: [20, 30],
      zoom: 2.5,
      minZoom: 2,
      maxZoom: 18,
      zoomControl: false,
      attributionControl: false,
    })

    L.tileLayer(DARK_TILES, {
      attribution: DARK_ATTRIBUTION,
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map)

    // Add zoom control bottom-right
    L.control.zoom({ position: 'bottomright' }).addTo(map)
    L.control.attribution({ position: 'bottomleft', prefix: false }).addTo(map)

    // Initialize layer groups
    layerGroupsRef.current.conflicts = L.layerGroup().addTo(map)
    layerGroupsRef.current.natural = L.layerGroup().addTo(map)
    layerGroupsRef.current.economic = L.layerGroup().addTo(map)
    layerGroupsRef.current.trade = L.layerGroup().addTo(map)

    // Map click for reverse geocoding 'No Intel' spots
    map.on('click', async (e) => {
      const { lat, lng } = e.latlng
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=3&addressdetails=1`, {
          headers: { 'Accept-Language': 'en' }
        })
        const data = await res.json()
        const countryName = data.address?.country
        
        if (countryName) {
          onMarkerClick?.({
            id: `intel-sweep-${Date.now()}`,
            title: `No latest Intel from ${countryName} yet`,
            lat,
            lng,
            severity: 'Low',
            source: 'Reconnaissance Sweep',
            category: 'economic',
            date: new Date().toISOString().split('T')[0]
          })
        }
      } catch (err) {
        console.warn('Reverse geocode failed', err)
      }
    })

    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [onMarkerClick])

  // Update markers when data or layers change
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    const groups = layerGroupsRef.current

    // Clear all layer groups
    Object.values(groups).forEach(g => g?.clearLayers())

    const addMarker = (event, icon, group) => {
      if (!event.lat || !event.lng) return

      const marker = L.marker([event.lat, event.lng], { icon })

      // Custom popup with cyber styling
      const popupContent = `
        <div style="font-family: 'Rajdhani', sans-serif; min-width: 200px;">
          <div style="font-size: 13px; font-weight: 600; color: #fff; margin-bottom: 6px;">
            ${event.title}
          </div>
          <div style="font-size: 10px; color: #888; font-family: 'JetBrains Mono', monospace; margin-bottom: 4px;">
            SRC: ${event.source || 'Unknown'} • ${event.date || '—'}
          </div>
          <div style="font-size: 10px; padding: 3px 8px; border-radius: 4px; display: inline-block;
            color: ${event.severity === 'Critical' ? '#ff3b3b' : event.severity === 'High' ? '#ffa53b' : '#00FF9F'};
            background: ${event.severity === 'Critical' ? 'rgba(255,59,59,0.15)' : event.severity === 'High' ? 'rgba(255,165,59,0.15)' : 'rgba(0,255,159,0.15)'};
            border: 1px solid ${event.severity === 'Critical' ? 'rgba(255,59,59,0.3)' : event.severity === 'High' ? 'rgba(255,165,59,0.3)' : 'rgba(0,255,159,0.3)'};
            font-family: 'Orbitron', monospace; letter-spacing: 1px;">
            ${event.severity || 'UNKNOWN'}
          </div>
        </div>
      `

      marker.bindPopup(popupContent, {
        className: 'cyber-popup',
        closeButton: true,
        maxWidth: 280,
      })

      marker.on('click', () => {
        onMarkerClick?.(event)
        map.flyTo([event.lat, event.lng], Math.max(map.getZoom(), 5), { duration: 1.2 })
      })

      group.addLayer(marker)
    }

    // Conflict markers
    if (layers.conflicts) {
      conflictEvents.forEach(evt => addMarker(evt, conflictIcon, groups.conflicts))
    }

    // Natural event markers
    if (layers.natural) {
      naturalEvents.forEach(evt => addMarker(evt, naturalIcon, groups.natural))
    }

    // Economic markers (always on)
    economicEvents.forEach(evt => addMarker(evt, economicIcon, groups.economic))

    // Trade routes
    if (layers.trade) {
      tradeRoutes.forEach(route => {
        const latlngs = route.coordinates.map(([lng, lat]) => [lat, lng])
        const polyline = L.polyline(latlngs, {
          color: '#ffd93b',
          weight: 4,
          opacity: 0.8,
          dashArray: '5, 8',
        })
        polyline.bindPopup(`
          <div style="font-family: 'Rajdhani', sans-serif;">
            <div style="font-size: 13px; font-weight: 600; color: #ffd93b;">${route.name}</div>
            <div style="font-size: 11px; color: #aaa; margin-top: 4px;">Volume: ${route.volume}</div>
            <div style="font-size: 11px; color: #aaa;">Risk: ${route.risk}</div>
            <div style="font-size: 10px; color: #888; margin-top: 4px;">${route.description}</div>
          </div>
        `, { className: 'cyber-popup' })
        groups.trade.addLayer(polyline)
      })
    }
  }, [conflictEvents, naturalEvents, economicEvents, tradeRoutes, layers, onMarkerClick])

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainerRef} className="w-full h-full" style={{ background: '#0a0a0f' }} />
    </div>
  )
}
