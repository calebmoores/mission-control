'use client';

import { useEffect, useState } from 'react';

interface SystemStatsProps {
  uptime: number;
  tasksCompleted: number;
  activeAgents: number;
  totalSessions?: number;
  cpuUsage?: number;
  memoryUsage?: number;
}

export default function SystemStats({
  uptime,
  tasksCompleted,
  activeAgents,
  totalSessions,
  cpuUsage = 45,
  memoryUsage = 62
}: SystemStatsProps) {
  const [displayUptime, setDisplayUptime] = useState(uptime);

  // Animate numbers on change
  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayUptime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${days}d ${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const StatBox = ({ 
    label, 
    value, 
    icon, 
    color, 
    delay 
  }: { 
    label: string; 
    value: string | number; 
    icon: string; 
    color: string;
    delay: number;
  }) => (
    <div 
      className="bg-gray-800/50 border border-gray-700 p-3 relative overflow-hidden group hover:border-cyan-400/50 transition-colors animate-scale-in"
      style={{ animationDelay: `${delay}s` }}
    >
      {/* Corner decorations */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-gray-600 group-hover:border-cyan-400 transition-colors" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-gray-600 group-hover:border-cyan-400 transition-colors" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-gray-600 group-hover:border-cyan-400 transition-colors" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-gray-600 group-hover:border-cyan-400 transition-colors" />

      <div className="flex items-center justify-between">
        <div>
          <div className="font-terminal text-xs text-gray-500 mb-1">{label}</div>
          <div className={`font-pixel text-lg ${color}`}>{value}</div>
        </div>
        <div className="text-2xl opacity-50">{icon}</div>
      </div>
    </div>
  );

  const GaugeBar = ({ 
    label, 
    value, 
    color 
  }: { 
    label: string; 
    value: number; 
    color: string 
  }) => (
    <div className="mb-3">
      <div className="flex justify-between text-xs mb-1">
        <span className="font-terminal text-gray-500">{label}</span>
        <span className={`font-terminal ${color}`}>{value}%</span>
      </div>
      <div className="pixel-progress h-3">
        <div 
          className="pixel-progress-fill h-full animate-expand-width"
          style={{ 
            width: `${value}%`,
            background: value > 80 ? 'linear-gradient(90deg, #f56565, #e53e3e)' :
                        value > 60 ? 'linear-gradient(90deg, #ecc94b, #d69e2e)' :
                        'linear-gradient(90deg, #00ffc8, #00b4d8)',
            boxShadow: `0 0 10px ${value > 80 ? 'rgba(245, 101, 101, 0.5)' : value > 60 ? 'rgba(236, 201, 75, 0.5)' : 'rgba(0, 255, 200, 0.5)'}`,
            animationDelay: '0.5s'
          }}
        />
      </div>
    </div>
  );

  return (
    <div className="h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-pixel text-sm text-yellow-400">SYSTEM STATS</h2>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="font-terminal text-xs text-green-400">ONLINE</span>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <StatBox 
          label="UPTIME" 
          value={formatUptime(displayUptime)} 
          icon="⏱️" 
          color="text-cyan-400"
          delay={0}
        />
        <StatBox 
          label="TASKS TODAY" 
          value={tasksCompleted} 
          icon="✓" 
          color="text-green-400"
          delay={0.1}
        />
        <StatBox
          label="ACTIVE AGENTS"
          value={activeAgents}
          icon="🤖"
          color="text-purple-400"
          delay={0.2}
        />
        {totalSessions !== undefined && (
          <StatBox
            label="SESSIONS"
            value={totalSessions}
            icon="📊"
            color="text-blue-400"
            delay={0.25}
          />
        )}
        <StatBox
          label="EFFICIENCY"
          value={totalSessions !== undefined ? `${Math.min(99, Math.round((tasksCompleted / (totalSessions || 1)) * 100))}%` : '98%'}
          icon="⚡"
          color="text-yellow-400"
          delay={0.3}
        />
      </div>

      {/* Resource Gauges */}
      <div className="bg-gray-800/30 border border-gray-700 p-4 mb-4">
        <h3 className="font-terminal text-xs text-gray-500 mb-3">RESOURCES</h3>
        <GaugeBar label="CPU LOAD" value={cpuUsage} color={cpuUsage > 80 ? 'text-red-400' : cpuUsage > 60 ? 'text-yellow-400' : 'text-green-400'} />
        <GaugeBar label="MEMORY" value={memoryUsage} color={memoryUsage > 80 ? 'text-red-400' : memoryUsage > 60 ? 'text-yellow-400' : 'text-green-400'} />
      </div>

      {/* Mini Graph */}
      <div className="bg-gray-800/30 border border-gray-700 p-4">
        <h3 className="font-terminal text-xs text-gray-500 mb-3">ACTIVITY (24H)</h3>
        <div className="flex items-end gap-1 h-16">
          {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 50, 95].map((height, i) => (
            <div
              key={i}
              className="flex-1 bg-gradient-to-t from-cyan-500/20 to-cyan-400 hover:from-cyan-500/40 hover:to-cyan-300 transition-all animate-grow-up"
              style={{ 
                minWidth: '4px', 
                height: `${height}%`,
                animationDelay: `${i * 0.05}s`
              }}
            />
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs font-terminal text-gray-600">
          <span>00:00</span>
          <span>12:00</span>
          <span>23:59</span>
        </div>
      </div>
    </div>
  );
}
