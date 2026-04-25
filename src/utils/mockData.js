// ═══════════════════════════════════
// GeoIntel AI — Mock Data
// ═══════════════════════════════════

export const mockMilitaryBases = [
  { id: 'mb-1', name: 'Fort Liberty', lat: 35.1392, lng: -79.0063, country: 'USA', type: 'Army', personnel: '53,000' },
  { id: 'mb-2', name: 'Ramstein Air Base', lat: 49.4400, lng: 7.6028, country: 'Germany', type: 'Air Force', personnel: '9,200' },
  { id: 'mb-3', name: 'Camp Humphreys', lat: 36.9628, lng: 127.0318, country: 'South Korea', type: 'Army', personnel: '36,000' },
  { id: 'mb-4', name: 'Naval Station Norfolk', lat: 36.9483, lng: -76.3039, country: 'USA', type: 'Navy', personnel: '85,000' },
  { id: 'mb-5', name: 'Diego Garcia', lat: -7.3133, lng: 72.4111, country: 'UK/US', type: 'Joint', personnel: '3,000' },
  { id: 'mb-6', name: 'RAF Lakenheath', lat: 52.4093, lng: 0.5610, country: 'UK', type: 'Air Force', personnel: '4,500' },
  { id: 'mb-7', name: 'Yokota Air Base', lat: 35.7485, lng: 139.3488, country: 'Japan', type: 'Air Force', personnel: '14,000' },
  { id: 'mb-8', name: 'Incirlik Air Base', lat: 37.0020, lng: 35.4259, country: 'Turkey', type: 'Air Force', personnel: '5,000' },
]

export const mockTradeRoutes = [
  {
    id: 'tr-1',
    name: 'Strait of Malacca',
    coordinates: [[100.3, 2.5], [103.8, 1.3], [104.5, 1.2]],
    volume: '$5.3T annually',
    risk: 'Medium',
    description: 'Critical shipping lane connecting Indian and Pacific Oceans',
  },
  {
    id: 'tr-2',
    name: 'Suez Canal',
    coordinates: [[32.3, 31.2], [32.35, 30.9], [32.55, 30.0]],
    volume: '$1T annually',
    risk: 'High',
    description: 'Key maritime route between Mediterranean and Red Sea',
  },
  {
    id: 'tr-3',
    name: 'Panama Canal',
    coordinates: [[-79.9, 9.4], [-79.6, 9.2], [-79.5, 9.0]],
    volume: '$270B annually',
    risk: 'Low',
    description: 'Vital waterway connecting Atlantic and Pacific Oceans',
  },
  {
    id: 'tr-4',
    name: 'Strait of Hormuz',
    coordinates: [[56.0, 26.6], [56.3, 26.5], [56.5, 26.4]],
    volume: '$1.2T – 30% global oil',
    risk: 'Critical',
    description: 'World\'s most important oil chokepoint',
  },
  {
    id: 'tr-5',
    name: 'Cape of Good Hope Route',
    coordinates: [[18.5, -34.3], [20.0, -35.0], [25.0, -34.5]],
    volume: '$400B annually',
    risk: 'Medium',
    description: 'Alternative route around southern Africa',
  },
]

export const mockConflictEvents = [
  { id: 'mc-1', title: 'Military escalation in Eastern Europe', lat: 48.3794, lng: 31.1656, severity: 'Critical', source: 'GeoIntel Analysis', date: '2026-04-25' },
  { id: 'mc-2', title: 'Border tensions in South China Sea', lat: 15.0, lng: 114.0, severity: 'High', source: 'Maritime Intelligence', date: '2026-04-24' },
  { id: 'mc-3', title: 'Civil unrest in Sahel region', lat: 14.0, lng: 2.0, severity: 'Medium', source: 'Regional Monitor', date: '2026-04-23' },
  { id: 'mc-4', title: 'Proxy conflict in Horn of Africa', lat: 8.0, lng: 45.0, severity: 'High', source: 'GeoIntel Analysis', date: '2026-04-22' },
  { id: 'mc-5', title: 'Militia activity in Myanmar', lat: 19.7, lng: 96.2, severity: 'Medium', source: 'OSINT Feed', date: '2026-04-21' },
  { id: 'mc-6', title: 'Political instability in Middle East', lat: 33.3, lng: 44.4, severity: 'High', source: 'GeoIntel Analysis', date: '2026-04-25' },
  { id: 'mc-7', title: 'NATO exercise near Baltic states', lat: 56.9, lng: 24.1, severity: 'Low', source: 'Defense Monitor', date: '2026-04-20' },
]

export const mockNaturalEvents = [
  { id: 'mn-1', title: 'Category 4 Cyclone – Bay of Bengal', lat: 15.0, lng: 85.0, severity: 'Critical', source: 'NASA EONET', type: 'Storm', date: '2026-04-25' },
  { id: 'mn-2', title: 'Volcanic eruption – Indonesia', lat: -7.5, lng: 110.4, severity: 'High', source: 'NASA EONET', type: 'Volcano', date: '2026-04-24' },
  { id: 'mn-3', title: 'Wildfire – California, USA', lat: 37.7, lng: -122.0, severity: 'Medium', source: 'NASA EONET', type: 'Wildfire', date: '2026-04-23' },
  { id: 'mn-4', title: 'Earthquake 6.2M – Turkey', lat: 38.4, lng: 38.3, severity: 'High', source: 'NASA EONET', type: 'Earthquake', date: '2026-04-22' },
  { id: 'mn-5', title: 'Flooding – Bangladesh', lat: 23.7, lng: 90.4, severity: 'Medium', source: 'NASA EONET', type: 'Flood', date: '2026-04-21' },
]

export const mockEconomicEvents = [
  { id: 'me-1', title: 'Oil price surge – OPEC meeting', lat: 24.4, lng: 54.6, severity: 'Medium', source: 'Market Intel', date: '2026-04-25' },
  { id: 'me-2', title: 'Semiconductor trade restrictions', lat: 25.0, lng: 121.5, severity: 'High', source: 'Trade Monitor', date: '2026-04-24' },
  { id: 'me-3', title: 'Port congestion – Rotterdam', lat: 51.9, lng: 4.5, severity: 'Low', source: 'Maritime Intel', date: '2026-04-23' },
]
