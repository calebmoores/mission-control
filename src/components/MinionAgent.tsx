'use client';

interface MinionAgentProps {
  name: string;
  type: 'coder' | 'researcher' | 'writer' | 'analyst';
  status: 'idle' | 'working' | 'busy';
  currentTask?: string;
}

const minionColors = {
  coder: { main: '#3182ce', dark: '#2c5282', light: '#63b3ed' },
  researcher: { main: '#805ad5', dark: '#6b46c1', light: '#b794f4' },
  writer: { main: '#d69e2e', dark: '#b7791f', light: '#f6e05e' },
  analyst: { main: '#38a169', dark: '#2f855a', light: '#68d391' },
};

export default function MinionAgent({ name, type, status, currentTask }: MinionAgentProps) {
  const colors = minionColors[type];
  const isWorking = status === 'working' || status === 'busy';
  
  return (
    <div 
      className={`relative flex flex-col items-center ${isWorking ? 'animate-minion-shake' : ''}`}
    >
      {/* Status Glow */}
      {isWorking && (
        <div 
          className="absolute inset-0 blur-xl opacity-50 rounded-full"
          style={{ backgroundColor: colors.main }}
        />
      )}
      
      {/* Minion SVG */}
      <div className="relative">
        <svg 
          width="48" 
          height="48" 
          viewBox="0 0 16 20" 
          style={{ imageRendering: 'pixelated' }}
        >
          {/* Body */}
          <rect x="4" y="6" width="8" height="10" fill={colors.main} />
          <rect x="3" y="7" width="1" height="8" fill={colors.dark} />
          <rect x="12" y="7" width="1" height="8" fill={colors.dark} />
          
          {/* Head */}
          <rect x="4" y="4" width="8" height="4" fill={colors.main} />
          <rect x="3" y="5" width="1" height="3" fill={colors.dark} />
          <rect x="12" y="5" width="1" height="3" fill={colors.dark} />
          
          {/* Eyes */}
          <rect x="5" y="5" width="2" height="2" fill="#1a202c" />
          <rect x="9" y="5" width="2" height="2" fill="#1a202c" />
          <rect x="6" y="5" width="1" height="1" fill="#fff" />
          <rect x="10" y="5" width="1" height="1" fill="#fff" />
          
          {/* Eye highlight animation when working */}
          {isWorking && (
            <>
              <rect x="5" y="5" width="2" height="2" fill={colors.light} opacity="0.5" className="animate-pulse-eye">
                <animate attributeName="opacity" values="0.5;0.8;0.5" dur="0.5s" repeatCount="indefinite" />
              </rect>
              <rect x="9" y="5" width="2" height="2" fill={colors.light} opacity="0.5">
                <animate attributeName="opacity" values="0.5;0.8;0.5" dur="0.5s" repeatCount="indefinite" begin="0.25s" />
              </rect>
            </>
          )}
          
          {/* Type-specific features */}
          {type === 'coder' && (
            <>
              {/* Glasses */}
              <rect x="4" y="4" width="4" height="3" fill="none" stroke="#00ffc8" strokeWidth="0.5" />
              <rect x="8" y="4" width="4" height="3" fill="none" stroke="#00ffc8" strokeWidth="0.5" />
              <line x1="8" y1="5.5" x2="8" y2="5.5" stroke="#00ffc8" strokeWidth="0.5" />
            </>
          )}
          
          {type === 'researcher' && (
            <>
              {/* Magnifying glass */}
              <circle cx="11" cy="6" r="1.5" fill="none" stroke="#ffd700" strokeWidth="0.5" />
              <line x1="12" y1="7" x2="13" y2="8" stroke="#ffd700" strokeWidth="0.5" />
            </>
          )}
          
          {type === 'writer' && (
            <>
              {/* Pen behind ear */}
              <rect x="11" y="3" width="1" height="3" fill="#e53e3e" transform="rotate(30 11 4.5)" />
            </>
          )}
          
          {type === 'analyst' && (
            <>
              {/* Chart symbol */}
              <polyline points="5,8 7,6 9,8" fill="none" stroke="#00ffc8" strokeWidth="0.5" />
            </>
          )}
          
          {/* Arms */}
          {isWorking ? (
            <>
              {/* Typing/Working arms */}
              <rect x="2" y="10" width="2" height="1" fill={colors.dark}>
                <animateTransform attributeName="transform" type="rotate" values="0 3 10; -10 3 10; 0 3 10" dur="0.3s" repeatCount="indefinite" />
              </rect>
              <rect x="12" y="10" width="2" height="1" fill={colors.dark}>
                <animateTransform attributeName="transform" type="rotate" values="0 13 10; 10 13 10; 0 13 10" dur="0.3s" repeatCount="indefinite" />
              </rect>
            </>
          ) : (
            <>
              <rect x="2" y="10" width="2" height="3" fill={colors.dark} />
              <rect x="12" y="10" width="2" height="3" fill={colors.dark} />
            </>
          )}
          
          {/* Legs */}
          <rect x="5" y="16" width="2" height="2" fill={colors.dark} />
          <rect x="9" y="16" width="2" height="2" fill={colors.dark} />
        </svg>
        
        {/* Status Indicator */}
        <div className="absolute -top-1 -right-1">
          <div className={`w-3 h-3 ${
            status === 'idle' ? 'bg-gray-500' :
            status === 'working' ? 'bg-yellow-400 animate-pulse' :
            'bg-red-400 animate-pulse'
          }`} style={{ boxShadow: status !== 'idle' ? `0 0 8px currentColor` : 'none' }} />
        </div>
      </div>
      
      {/* Name Label */}
      <div className="mt-2 text-center">
        <div className="font-terminal text-sm text-gray-300">{name}</div>
        <div className="font-terminal text-xs text-gray-500 uppercase">{type}</div>
      </div>
      
      {/* Task Tooltip */}
      {currentTask && isWorking && (
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 border border-gray-700 px-2 py-1 whitespace-nowrap z-20 animate-fade-in">
          <span className="text-xs font-terminal text-cyan-400">{currentTask}</span>
        </div>
      )}
    </div>
  );
}
