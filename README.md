# 🦉 Mission Control — Caleb AI Dashboard

> A retro pixel-art styled Mission Control dashboard for Caleb, the AI Chief of Staff.

![Version](https://img.shields.io/badge/version-1.0.0-cyan)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![Tailwind](https://img.shields.io/badge/Tailwind-4-blue)

## ✨ Features

### v1 Core Features
- **Status Board** — Kanban-style mission tracking with real-time status updates
- **Activity Feed** — Live log of all Caleb and sub-agent activities
- **System Stats** — Uptime, task completion, resource gauges, and activity graphs
- **Quick Actions** — One-click commands for common operations
- **Minion Squad** — Visual representation of all active sub-agents

### Design Highlights
- 🎮 **Pixel Art Aesthetic** — Retro game-inspired UI with crisp pixel borders
- 🌈 **Neon Accents** — Cyan, pink, and yellow neon glow effects
- 📺 **CRT Effects** — Scanlines and flicker for authentic retro feel
- 🎭 **Animated Characters** — Caleb the Owl and his minion agents with working animations
- ✨ **Smooth Animations** — Framer Motion powered transitions

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone or navigate to the project
cd mission-control

# Install dependencies
npm install

# Start development server
npm run dev
```

The dashboard will be available at:
- Local: `http://localhost:3000`
- Network: `http://0.0.0.0:3000` (use `npm run dev:network`)

### Build for Production

```bash
npm run build
npm start
```

## 🏗️ Project Structure

```
mission-control/
├── src/
│   ├── app/
│   │   ├── globals.css      # Global styles with pixel-art theme
│   │   ├── layout.tsx       # Root layout with CRT effects
│   │   └── page.tsx         # Main dashboard page
│   ├── components/
│   │   ├── CalebOwl.tsx     # Main character component
│   │   ├── MinionAgent.tsx  # Sub-agent visual component
│   │   ├── StatusBoard.tsx  # Mission kanban board
│   │   ├── ActivityFeed.tsx # Real-time activity log
│   │   ├── SystemStats.tsx  # Stats and gauges
│   │   └── QuickActions.tsx # Action buttons panel
│   ├── data/
│   │   └── mockData.ts      # Realistic mock data
│   └── types/
│       └── index.ts         # TypeScript definitions
├── public/                  # Static assets
└── package.json
```

## 🎨 Customization

### Adding New Minion Types
Edit `src/components/MinionAgent.tsx`:
```typescript
const minionColors = {
  yourType: { main: '#yourColor', dark: '#darkVariant', light: '#lightVariant' },
};
```

### Adding New Quick Actions
Edit `src/components/QuickActions.tsx`:
```typescript
const defaultActions: QuickAction[] = [
  { id: 'your-action', label: 'YOUR LABEL', icon: '🔧', color: 'cyan' },
];
```

### Customizing the Theme
Edit `src/app/globals.css`:
```css
:root {
  --primary: 100 220 180;    /* Cyan accent */
  --secondary: 255 120 180;  /* Pink accent */
  --accent: 255 200 80;      /* Yellow accent */
}
```

## 🔌 API Integration

To connect to a real backend, modify the data fetching in `src/app/page.tsx`:

```typescript
useEffect(() => {
  // Replace mock data with real API calls
  fetch('/api/missions')
    .then(res => res.json())
    .then(data => setMissions(data));
}, []);
```

## 🖥️ Display Requirements

For the best retro experience:
- **Recommended Resolution**: 1920x1080 or higher
- **Browser**: Chrome, Firefox, Safari (latest)
- **Pixel Rendering**: CSS `image-rendering: pixelated` enabled

## 📝 Future Enhancements

- [ ] WebSocket integration for real-time updates
- [ ] User authentication and role management
- [ ] Mission creation/editing interface
- [ ] Historical analytics and reporting
- [ ] Mobile-responsive layout
- [ ] Dark/Light theme toggle
- [ ] Sound effects and ambient audio

## 🤝 Credits

Built with:
- [Next.js](https://nextjs.org/) — React framework
- [Tailwind CSS](https://tailwindcss.com/) — Utility-first CSS
- [Framer Motion](https://www.framer.com/motion/) — Animations
- [VT323](https://fonts.google.com/specimen/VT323) & [Press Start 2P](https://fonts.google.com/specimen/Press+Start+2P) — Pixel fonts

---

<p align="center">
  <strong>🦉 CALEB — CHIEF OF STAFF</strong><br>
  <em>Mission Control Dashboard v1.0.0</em>
</p>
