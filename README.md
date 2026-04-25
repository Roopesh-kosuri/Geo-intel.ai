# 🌍 GeoIntel AI — Real-Time Global Intelligence Dashboard

A premium cyberpunk-themed intelligence dashboard built with React, Mapbox GL, and Framer Motion. Monitor conflicts, natural disasters, and geopolitical events in real-time on an interactive dark-themed map.

![Landing Page](https://img.shields.io/badge/Status-LIVE-00FF9F?style=for-the-badge)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite)
![Tailwind](https://img.shields.io/badge/TailwindCSS-4-38B2AC?style=for-the-badge&logo=tailwindcss)

---

## ⚡ Quick Start

### 1. Install Dependencies

```bash
npm install --legacy-peer-deps
```

### 2. Configure Environment

Copy `.env.example` to `.env` and add your API keys:

```env
# Required — Get free at https://account.mapbox.com/access-tokens/
VITE_MAPBOX_TOKEN=pk.your_mapbox_token_here

# Optional — Get free at https://newsapi.org/register
VITE_NEWS_API_KEY=your_newsapi_key_here
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🚀 Deploy to Vercel

### Option 1: Vercel CLI

```bash
npm install -g vercel
vercel
```

### Option 2: GitHub Integration

1. Push this project to a GitHub repository
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your repository
4. Add environment variables in Vercel dashboard:
   - `VITE_MAPBOX_TOKEN`
   - `VITE_NEWS_API_KEY`
5. Deploy!

> The `vercel.json` is already configured for SPA routing.

---

## 📁 Project Structure

```
geointel-ai/
├── public/
│   └── favicon.svg          # Radar-style SVG favicon
├── src/
│   ├── components/
│   │   ├── AIPanel.jsx       # Rule-based AI analysis panel
│   │   ├── AlertPanel.jsx    # Top 5 risk events panel
│   │   ├── LayerControls.jsx # Map layer toggles
│   │   ├── MapView.jsx       # Mapbox GL interactive map
│   │   └── TopBar.jsx        # Status bar with live clock
│   ├── hooks/
│   │   └── useGeoData.js     # Data fetching & parsing hook
│   ├── pages/
│   │   ├── Dashboard.jsx     # Main dashboard layout
│   │   └── LandingPage.jsx   # Animated landing page
│   ├── utils/
│   │   ├── aiEngine.js       # Risk scoring & analysis logic
│   │   └── mockData.js       # Fallback mock data
│   ├── App.jsx               # Router setup
│   ├── index.css             # Design system & animations
│   └── main.jsx              # React entry point
├── .env.example              # Environment template
├── vercel.json               # Vercel SPA config
└── package.json
```

---

## 🎛️ Features

| Feature | Description |
|---------|-------------|
| 🗺️ Interactive Map | Fullscreen Mapbox dark map with custom markers |
| 📡 Live Data | NASA EONET events + NewsAPI conflicts |
| 🧠 AI Analysis | Rule-based risk scoring, summaries, and insights |
| 🚨 Alert Panel | Top 5 highest-risk events with severity colors |
| 🎛️ Layer Controls | Toggle conflicts, natural events, trade routes |
| 📱 Responsive | Mobile bottom-sheet panels + desktop sidebar |
| 🎨 Cyber Theme | Neon green, glassmorphism, glow effects |
| ⚡ Animations | Radar sweep, typewriter text, pulse markers |

---

## 🔑 API Keys

| Variable | Required | Free Tier | Purpose |
|----------|----------|-----------|---------|
| `VITE_MAPBOX_TOKEN` | Yes | ✅ 50k loads/mo | Interactive map |
| `VITE_NEWS_API_KEY` | No | ✅ 100 req/day | Conflict news data |

> Without API keys, the app falls back to realistic mock data for all features.

---

## 🛠️ Tech Stack

- **React 19** — UI framework
- **Vite 8** — Build tool
- **Tailwind CSS 4** — Styling
- **Mapbox GL JS** — Interactive map
- **Framer Motion** — Animations
- **NASA EONET API** — Natural events
- **NewsAPI** — Conflict/geopolitical news
