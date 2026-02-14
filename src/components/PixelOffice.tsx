'use client';

import { useState, useEffect } from 'react';

interface Agent {
  id: string;
  name: string;
  role: string;
  type: 'caleb' | 'coder' | 'researcher' | 'writer' | 'analyst';
  status: 'idle' | 'working' | 'busy';
  currentTask?: string;
  x: number;
  y: number;
  facing: 'north' | 'south' | 'east' | 'west';
}

interface PixelOfficeProps {
  agents?: Agent[];
  missions?: Array<{
    id: string;
    title: string;
    status: string;
    assignedAgent: string;
  }>;
}

const defaultAgents: Agent[] = [
  { id: 'caleb', name: 'Caleb', role: 'Chief of Staff', type: 'caleb', status: 'working', currentTask: 'Overseeing operations', x: 4, y: 4, facing: 'south' },
  { id: 'code-01', name: 'Code-01', role: 'Lead Developer', type: 'coder', status: 'working', currentTask: 'API integration', x: 1, y: 1, facing: 'east' },
  { id: 'code-02', name: 'Code-02', role: 'Backend Dev', type: 'coder', status: 'busy', currentTask: 'Debugging auth', x: 1, y: 3, facing: 'east' },
  { id: 'research-01', name: 'Research-01', role: 'Data Scout', type: 'researcher', status: 'working', currentTask: 'Market analysis', x: 7, y: 1, facing: 'west' },
  { id: 'writer-01', name: 'Writer-01', role: 'Content Lead', type: 'writer', status: 'working', currentTask: 'Drafting blog post', x: 7, y: 3, facing: 'west' },
  { id: 'analyst-01', name: 'Analyst-01', role: 'Metrics', type: 'analyst', status: 'idle', x: 4, y: 7, facing: 'north' },
];

const agentColors = {
  caleb: { primary: '#00ffc8', secondary: '#00b4d8', glow: 'rgba(0, 255, 200, 0.5)' },
  coder: { primary: '#3182ce', secondary: '#2c5282', glow: 'rgba(49, 130, 206, 0.5)' },
  researcher: { primary: '#805ad5', secondary: '#6b46c1', glow: 'rgba(128, 90, 213, 0.5)' },
  writer: { primary: '#d69e2e', secondary: '#b7791f', glow: 'rgba(214, 158, 46, 0.5)' },
  analyst: { primary: '#38a169', secondary: '#2f855a', glow: 'rgba(56, 161, 105, 0.5)' },
};

// Desk SVG component
function Desk({ agent, isOccupied }: { agent?: Agent; isOccupied: boolean }) {
  const colors = agent ? agentColors[agent.type] : { primary: '#4a5568', secondary: '#2d3748', glow: 'rgba(100,100,100,0.3)' };

  return (
    <div className="relative w-full h-full">
      {/* Desk surface */}
      <svg viewBox="0 0 64 64" className="w-full h-full" style={{ imageRendering: 'pixelated' }}>
        {/* Desk shadow */}
        <rect x="4" y="4" width="56" height="56" fill="rgba(0,0,0,0.3)" />

        {/* Desk top */}
        <rect x="8" y="8" width="48" height="48" fill="#2d3748" />
        <rect x="8" y="8" width="48" height="8" fill="#4a5568" />
        <rect x="8" y="48" width="48" height="8" fill="#1a202c" />

        {/* Monitor */}
        <rect x="20" y="16" width="24" height="16" fill="#1a1a2e" stroke={colors.primary} strokeWidth="2" />
        {isOccupied && (
          <>
            <rect x="22" y="18" width="20" height="12" fill="#0f3460">
              <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite" />
            </rect>
            {/* Screen glow lines */}
            <line x1="24" y1="22" x2="40" y2="22" stroke={colors.primary} strokeWidth="1" opacity="0.7" />
            <line x1="24" y1="26" x2="36" y2="26" stroke={colors.primary} strokeWidth="1" opacity="0.5" />
          </>
        )}

        {/* Monitor stand */}
        <rect x="28" y="32" width="8" height="4" fill="#4a5568" />
        <rect x="24" y="36" width="16" height="4" fill="#4a5568" />

        {/* Keyboard */}
        <rect x="24" y="44" width="16" height="4" fill="#4a5568" />
        {isOccupied && agent?.status === 'working' && (
          <rect x="26" y="45" width="12" height="2" fill={colors.primary} opacity="0.5">
            <animate attributeName="width" values="12;10;12" dur="0.3s" repeatCount="indefinite" />
          </rect>
        )}

        {/* Chair */}
        <rect x="52" y="24" width="8" height="16" fill="#2d3748" />
        <rect x="52" y="20" width="8" height="8" fill="#4a5568" />
      </svg>

      {/* Status indicator */}
      {isOccupied && (
        <div
          className="absolute -top-1 -right-1 w-3 h-3 border-2 border-gray-900"
          style={{
            backgroundColor: agent?.status === 'working' ? '#fbbf24' : agent?.status === 'busy' ? '#f87171' : '#6b7280',
            boxShadow: agent?.status === 'working' ? '0 0 8px #fbbf24' : agent?.status === 'busy' ? '0 0 8px #f87171' : 'none',
          }}
        >
          {agent?.status === 'working' && (
            <div className="w-full h-full animate-pulse" style={{ backgroundColor: '#fbbf24' }} />
          )}
        </div>
      )}
    </div>
  );
}

// Agent character component
function AgentCharacter({ agent }: { agent: Agent }) {
  const colors = agentColors[agent.type];
  const isWorking = agent.status === 'working' || agent.status === 'busy';

  return (
    <div className="relative group cursor-pointer">
      {/* Glow effect */}
      {isWorking && (
        <div
          className="absolute inset-0 blur-md opacity-40"
          style={{ backgroundColor: colors.primary }}
        />
      )}

      {/* Agent sprite */}
      <svg
        viewBox="0 0 32 40"
        className="w-12 h-14 relative z-10"
        style={{ imageRendering: 'pixelated' }}
      >
        {/* Body */}
        <rect x="8" y="16" width="16" height="16" fill={colors.primary} />
        <rect x="6" y="18" width="2" height="12" fill={colors.secondary} />
        <rect x="24" y="18" width="2" height="12" fill={colors.secondary} />

        {/* Head */}
        <rect x="8" y="8" width="16" height="10" fill={colors.primary} />
        <rect x="6" y="10" width="2" height="8" fill={colors.secondary} />
        <rect x="24" y="10" width="2" height="8" fill={colors.secondary} />

        {/* Eyes */}
        <rect x="10" y="12" width="4" height="4" fill="#1a202c" />
        <rect x="18" y="12" width="4" height="4" fill="#1a202c" />
        <rect x="11" y="13" width="1" height="1" fill="#fff" />
        <rect x="19" y="13" width="1" height="1" fill="#fff" />

        {/* Type-specific accessories */}
        {agent.type === 'caleb' && (
          <>
            {/* Owl ears */}
            <rect x="6" y="4" width="4" height="6" fill={colors.secondary} />
            <rect x="22" y="4" width="4" height="6" fill={colors.secondary} />
            {/* Chief badge */}
            <rect x="20" y="20" width="6" height="4" fill="#fbbf24" />
          </>
        )}
        {agent.type === 'coder' && (
          <>
            {/* Glasses */}
            <rect x="8" y="10" width="6" height="6" fill="none" stroke="#00ffc8" strokeWidth="0.5" />
            <rect x="18" y="10" width="6" height="6" fill="none" stroke="#00ffc8" strokeWidth="0.5" />
          </>
        )}
        {agent.type === 'researcher' && (
          <>
            {/* Magnifying glass */}
            <circle cx="26" cy="14" r="2" fill="none" stroke="#ffd700" strokeWidth="0.5" />
          </>
        )}
        {agent.type === 'writer' && (
          <>
            {/* Pen */}
            <rect x="26" y="8" width="2" height="6" fill="#e53e3e" transform="rotate(30 27 11)" />
          </>
        )}

        {/* Arms - animated when working */}
        {isWorking ? (
          <>
            <rect x="4" y="22" width="4" height="2" fill={colors.secondary}>
              <animateTransform attributeName="transform" type="rotate" values="0 6 23; -15 6 23; 0 6 23" dur="0.5s" repeatCount="indefinite" />
            </rect>
            <rect x="24" y="22" width="4" height="2" fill={colors.secondary}>
              <animateTransform attributeName="transform" type="rotate" values="0 26 23; 15 26 23; 0 26 23" dur="0.5s" repeatCount="indefinite" begin="0.25s" />
            </rect>
          </>
        ) : (
          <>
            <rect x="4" y="22" width="4" height="6" fill={colors.secondary} />
            <rect x="24" y="22" width="4" height="6" fill={colors.secondary} />
          </>
        )}

        {/* Legs */}
        <rect x="10" y="32" width="4" height="6" fill={colors.secondary} />
        <rect x="18" y="32" width="4" height="6" fill={colors.secondary} />
      </svg>

      {/* Name tag */}
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap">
        <div className="bg-gray-900/90 border border-gray-700 px-2 py-0.5 text-center">
          <div className="font-pixel text-[8px]" style={{ color: colors.primary }}>
            {agent.name}
          </div>
          <div className="font-terminal text-[6px] text-gray-500">
            {agent.role}
          </div>
        </div>
      </div>

      {/* Task tooltip */}
      {agent.currentTask && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 border border-cyan-400 px-2 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-30">
          <span className="text-xs font-terminal text-cyan-400">{agent.currentTask}</span>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900 border-r border-b border-cyan-400" />
        </div>
      )}
    </div>
  );
}

// Floor tile component
function FloorTile({ x, y, variant }: { x: number; y: number; variant: number }) {
  const colors = ['#1a202c', '#2d3748', '#1a202c'];
  const color = colors[variant % colors.length];

  return (
    <div
      className="absolute w-full h-full border border-gray-800/30"
      style={{
        backgroundColor: color,
        backgroundImage: 'linear-gradient(45deg, rgba(0,255,200,0.02) 25%, transparent 25%, transparent 75%, rgba(0,255,200,0.02) 75%, rgba(0,255,200,0.02)), linear-gradient(45deg, rgba(0,255,200,0.02) 25%, transparent 25%, transparent 75%, rgba(0,255,200,0.02) 75%, rgba(0,255,200,0.02))',
        backgroundSize: '4px 4px',
        backgroundPosition: '0 0, 2px 2px',
      }}
    />
  );
}

export default function PixelOffice({ agents = defaultAgents, missions = [] }: PixelOfficeProps) {
  const [hoveredCell, setHoveredCell] = useState<{ x: number; y: number } | null>(null);

  // Create 9x9 grid
  const gridSize = 9;
  const cells: Array<{ x: number; y: number; type: 'empty' | 'desk' | 'agent'; agent?: Agent }> = [];

  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const agent = agents.find(a => a.x === x && a.y === y);

      // Define office layout
      let type: 'empty' | 'desk' | 'agent' = 'empty';

      // Desk positions (corners and middle)
      const deskPositions = [
        { x: 1, y: 1 }, { x: 1, y: 3 }, { x: 1, y: 5 },
        { x: 7, y: 1 }, { x: 7, y: 3 }, { x: 7, y: 5 },
        { x: 3, y: 7 }, { x: 5, y: 7 },
        { x: 4, y: 4 }, // Chief's desk in center
      ];

      if (deskPositions.some(p => p.x === x && p.y === y)) {
        type = 'desk';
      }

      if (agent) {
        type = 'agent';
      }

      cells.push({ x, y, type, agent });
    }
  }

  return (
    <div className="relative w-full h-full min-h-[500px] bg-[#0d1117] rounded-lg overflow-hidden border-2 border-gray-800">
      {/* Office header */}
      <div className="absolute top-0 left-0 right-0 bg-gray-900/90 border-b border-gray-800 p-3 z-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 animate-pulse" />
          <span className="font-pixel text-xs text-cyan-400">PIXEL OFFICE</span>
        </div>
        <div className="flex items-center gap-4 font-terminal text-xs text-gray-500">
          <span>AGENTS: {agents.length}</span>
          <span>ACTIVE: {agents.filter(a => a.status === 'working').length}</span>
          <span>IDLE: {agents.filter(a => a.status === 'idle').length}</span>
        </div>
      </div>

      {/* Grid container */}
      <div className="absolute inset-0 pt-14 p-4">
        <div
          className="relative w-full h-full grid"
          style={{
            gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
            gridTemplateRows: `repeat(${gridSize}, 1fr)`,
            gap: '2px',
          }}
        >
          {cells.map((cell) => (
            <div
              key={`${cell.x}-${cell.y}`}
              className="relative aspect-square"
              onMouseEnter={() => setHoveredCell({ x: cell.x, y: cell.y })}
              onMouseLeave={() => setHoveredCell(null)}
            >
              <FloorTile x={cell.x} y={cell.y} variant={(cell.x + cell.y) % 3} />

              {/* Desk */}
              {cell.type === 'desk' && (
                <div className="absolute inset-1 flex items-center justify-center">
                  <Desk agent={cell.agent} isOccupied={!!cell.agent} />
                </div>
              )}

              {/* Agent */}
              {cell.agent && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <AgentCharacter agent={cell.agent} />
                </div>
              )}

              {/* Hover effect */}
              {hoveredCell?.x === cell.x && hoveredCell?.y === cell.y && (
                <div className="absolute inset-0 bg-cyan-400/10 border border-cyan-400/30 z-0" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-0 left-0 right-0 bg-gray-900/90 border-t border-gray-800 p-3 z-20">
        <div className="flex items-center justify-center gap-6">
          {Object.entries(agentColors).map(([type, colors]) => (
            <div key={type} className="flex items-center gap-2">
              <div
                className="w-3 h-3 border border-gray-700"
                style={{ backgroundColor: colors.primary }}
              />
              <span className="font-terminal text-xs text-gray-400 capitalize">{type}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Decorative corners */}
      <div className="absolute top-12 left-2 w-4 h-4 border-t-2 border-l-2 border-cyan-400/50" />
      <div className="absolute top-12 right-2 w-4 h-4 border-t-2 border-r-2 border-cyan-400/50" />
      <div className="absolute bottom-12 left-2 w-4 h-4 border-b-2 border-l-2 border-cyan-400/50" />
      <div className="absolute bottom-12 right-2 w-4 h-4 border-b-2 border-r-2 border-cyan-400/50" />
    </div>
  );
}
