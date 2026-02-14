# 🦉 Mission Control Dashboard

A sleek, sci-fi inspired dashboard for Caleb - your AI Chief of Staff. This dashboard provides real-time visibility into active missions, side hustles, and system status by connecting to the OpenClaw gateway.

## 🚀 Features

- **Active Missions**: Real-time view of currently running sub-agent tasks with progress indicators
- **Mission Queue**: Upcoming tasks in the execution queue
- **Recently Completed**: Recently finished tasks with results
- **Side Hustle Tracker**: Monitor ongoing projects and revenue generation
- **System Status**: AI model usage, API health, and uptime metrics
- **Sci-fi Aesthetic**: Dark theme with grid background, animations, and status indicators
- **Real-time Updates**: WebSocket connection to OpenClaw gateway for live data

## 🛠️ Tech Stack

- [Next.js 15](https://nextjs.org/) - React framework with App Router
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [WebSocket](https://github.com/websockets/ws) - Real-time communication

## 🎯 Design Vision

- Dark theme with sci-fi mission control aesthetic
- Main header with owl emoji and status indicator (online/working/idle)
- Animated sections with smooth transitions
- Little animated "minion" icons (🤖) next to active sub-agent tasks
- Subtle particle effects and grid background animation
- Mobile-responsive design

## 🏗️ Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/calebmoores/mission-control.git
   cd mission-control
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser

## 🌐 Network Access

To make the dashboard accessible on your local network:

1. Find your machine's IP address:
   ```bash
   # On Linux/Mac
   ifconfig
   # or
   ip addr show
   
   # On Windows
   ipconfig
   ```

2. Update `next.config.ts` to allow external connections:
   ```typescript
   import type { NextConfig } from "next";
   
   const nextConfig: NextConfig = {
     // Add this to allow external connections
     async rewrites() {
       return [
         {
           source: '/:path*',
           destination: 'http://localhost:3000/:path*'
         }
       ]
     }
   };
   
   export default nextConfig;
   ```

3. Run with host binding:
   ```bash
   npm run dev -- -H 0.0.0.0
   ```

## 📡 OpenClaw Gateway Integration

The dashboard connects to the OpenClaw gateway at `ws://127.0.0.1:18789` to pull session/task data. Ensure the gateway is running for real-time updates.

## 📁 Project Structure

```
src/
├── app/                 # Next.js app router pages
├── components/          # React components
├── services/            # Gateway service and data handling
├── types/               # TypeScript interfaces
└── ...
```

## 🤖 Component Overview

- `Header.tsx` - Main dashboard header with status indicator
- `MissionCard.tsx` - Reusable mission card component
- `ActiveMissions.tsx` - Active mission tracking section
- `MissionQueue.tsx` - Upcoming mission queue
- `CompletedMissions.tsx` - Recently completed tasks
- `SideHustleTracker.tsx` - Side project monitoring
- `SystemStatus.tsx` - System health and metrics
- `gatewayService.ts` - WebSocket connection to OpenClaw

## 🎨 Animations

- Framer Motion for smooth transitions and hover effects
- CSS keyframe animations for status indicators and minion icons
- Staggered loading animations for dashboard sections

## 📱 Responsive Design

- Mobile-first approach with Tailwind's responsive utilities
- Flexible grid layouts that adapt to screen size
- Touch-friendly controls and readable text sizes

## 🚧 Development

1. Make changes to components in `src/components/`
2. Update types in `src/types/` as needed
3. Modify styles in `src/app/globals.css`
4. Test with `npm run dev`

## 📤 Deployment

This dashboard is designed for local network deployment rather than public hosting. For external access:

1. Configure your firewall to allow connections on port 3000
2. Set up reverse proxy with nginx if needed
3. Consider authentication for sensitive data

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🦉 About Caleb

Caleb is your AI Chief of Staff, managing side hustles and background tasks. This dashboard provides a mission control center for monitoring all of Caleb's activities.