'use client';

import { useState, useEffect } from 'react';
import CalebOwl from '@/components/CalebOwl';
import MinionAgent from '@/components/MinionAgent';
import StatusBoard from '@/components/StatusBoard';
import ActivityFeed from '@/components/ActivityFeed';
import SystemStats from '@/components/SystemStats';
import QuickActions from '@/components/QuickActions';
import { Mission, Activity } from '@/types';

interface ApiSession {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'queued' | 'blocked' | 'completed';
  priority: 'critical' | 'high' | 'medium' | 'low';
  createdAt: string;
  updatedAt: string;
  assignedAgent: string;
  progress?: number;
  agentRole?: string;
}

interface ApiStatus {
  status: string;
  version: string;
  uptime: number;
  uptimeFormatted: string;
  timestamp: number;
  responseTime?: number;
  model: string;
  channels: {
    active: number;
    configured: number;
  };
  sessions: {
    total: number;
    active: number;
  };
}

interface ApiActivity {
  id: string;
  timestamp: string;
  agent: string;
  agentType: 'caleb' | 'coder' | 'researcher' | 'writer' | 'analyst';
  action: string;
  target?: string;
  status: 'completed' | 'in-progress' | 'failed';
}

// Fallback mock minions
const mockMinions = [
  { name: 'Code-01', type: 'coder' as const, status: 'working' as const, currentTask: 'API Integration...' },
  { name: 'Research-02', type: 'researcher' as const, status: 'working' as const, currentTask: 'Monitoring...' },
  { name: 'Writer-01', type: 'writer' as const, status: 'idle' as const },
  { name: 'Analyst-01', type: 'analyst' as const, status: 'working' as const, currentTask: 'Processing...' },
  { name: 'Code-02', type: 'coder' as const, status: 'busy' as const, currentTask: 'Debugging...' },
  { name: 'Writer-02', type: 'writer' as const, status: 'idle' as const },
];

// Fallback mock activities
const mockActivities: Activity[] = [
  { id: '1', timestamp: new Date(Date.now() - 1000 * 30), agent: 'Caleb', agentType: 'caleb', action: 'system online', target: 'Mission Control', status: 'completed' },
  { id: '2', timestamp: new Date(Date.now() - 1000 * 120), agent: 'CodeMinion-01', agentType: 'coder', action: 'fetching data', target: 'OpenClaw Gateway', status: 'completed' },
  { id: '3', timestamp: new Date(Date.now() - 1000 * 180), agent: 'System', agentType: 'analyst', action: 'polling', target: 'API endpoints', status: 'in-progress' },
];

// Convert API session to Mission format
function apiSessionToMission(session: ApiSession): Mission {
  return {
    id: session.id,
    title: session.title,
    description: session.description,
    status: session.status,
    priority: session.priority,
    createdAt: new Date(session.createdAt),
    updatedAt: new Date(session.updatedAt),
    assignedAgent: session.assignedAgent,
    progress: session.progress,
  };
}

// Convert API activity to Activity format
function apiActivityToActivity(activity: ApiActivity): Activity {
  return {
    id: activity.id,
    timestamp: new Date(activity.timestamp),
    agent: activity.agent,
    agentType: activity.agentType,
    action: activity.action,
    target: activity.target,
    status: activity.status,
  };
}

export default function MissionControl() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [uptime, setUptime] = useState(0);
  const [calebTyping, setCalebTyping] = useState(true);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [activities, setActivities] = useState<Activity[]>(mockActivities);
  const [systemStatus, setSystemStatus] = useState<ApiStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from API
  const fetchData = async () => {
    try {
      // Fetch all endpoints in parallel
      const [sessionsRes, cronRes, statusRes] = await Promise.all([
        fetch('/api/sessions'),
        fetch('/api/cron'),
        fetch('/api/status'),
      ]);

      const sessionsData = await sessionsRes.json();
      const cronData = await cronRes.json();
      const statusData = await statusRes.json();

      // Check if any response contains an error
      const hasError = sessionsData.error || cronData.error || statusData.error;

      // Update missions from sessions
      if (sessionsData.missions) {
        const mappedMissions = sessionsData.missions.map(apiSessionToMission);
        setMissions(mappedMissions);
      }

      // Update activities from cron jobs
      if (cronData.activities) {
        const mappedActivities = cronData.activities.map(apiActivityToActivity);
        // Combine with mock activities if we have fewer than 3
        if (mappedActivities.length < 3) {
          setActivities([...mappedActivities, ...mockActivities.slice(0, 3 - mappedActivities.length)]);
        } else {
          setActivities(mappedActivities);
        }
      }

      // Update system status
      if (statusData) {
        setSystemStatus(statusData);
        setUptime(statusData.uptime);
      }

      // Clear error if we got data successfully
      if (!hasError) {
        setError(null);
      } else {
        setError('Gateway returned partial data');
      }

      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to fetch data from gateway');
      setIsLoading(false);
    }
  };

  // Initial fetch and polling
  useEffect(() => {
    // Fetch immediately
    fetchData();

    // Set up polling every 10 seconds
    const pollInterval = setInterval(fetchData, 10000);

    return () => clearInterval(pollInterval);
  }, []);

  // Clock timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      setUptime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulate Caleb typing state
  useEffect(() => {
    const typingInterval = setInterval(() => {
      setCalebTyping(prev => !prev);
    }, 5000);
    return () => clearInterval(typingInterval);
  }, []);

  const activeMinions = mockMinions.filter(m => m.status === 'working' || m.status === 'busy').length;
  const tasksCompleted = missions.filter(m => m.status === 'completed').length;

  // Get model name for display
  const modelName = systemStatus?.model
    ? systemStatus.model.split('/').pop()?.toUpperCase() || 'CLAUDE'
    : 'CLAUDE-OPUS';

  return (
    <div className="min-h-screen p-4 md:p-6">
      {/* Header */}
      <header className="mb-6 animate-fade-in-down">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Logo & Title */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <CalebOwl isTyping={calebTyping} mood="focused" />
            </div>
            <div>
              <h1 className="font-pixel text-2xl md:text-3xl text-cyan-400 tracking-wider">
                MISSION CONTROL
              </h1>
              <p className="font-terminal text-gray-500">
                <span className="text-purple-400">CALEB</span> — CHIEF OF STAFF // SYSTEM ONLINE
              </p>
            </div>
          </div>

          {/* Status Bar */}
          <div className="flex items-center gap-6 bg-gray-900/50 border border-gray-800 px-4 py-2">
            <div className="text-center">
              <div className="font-terminal text-xs text-gray-500">TIME</div>
              <div className="font-pixel text-sm text-cyan-400">
                {currentTime.toLocaleTimeString('en-US', { hour12: false })}
              </div>
            </div>
            <div className="w-px h-8 bg-gray-700" />
            <div className="text-center">
              <div className="font-terminal text-xs text-gray-500">UPTIME</div>
              <div className="font-pixel text-sm text-green-400">
                {systemStatus?.uptimeFormatted ||
                  `${Math.floor(uptime / 3600).toString().padStart(2, '0')}:` +
                  `${Math.floor((uptime % 3600) / 60).toString().padStart(2, '0')}:` +
                  `${(uptime % 60).toString().padStart(2, '0')}`}
              </div>
            </div>
            <div className="w-px h-8 bg-gray-700" />
            <div className="text-center">
              <div className="font-terminal text-xs text-gray-500">VERSION</div>
              <div className="font-pixel text-sm text-yellow-400">
                {systemStatus?.version || 'v1.0.0'}
              </div>
            </div>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mt-4 bg-red-900/30 border border-red-500/50 px-4 py-2 animate-pulse">
            <span className="font-terminal text-sm text-red-400">
              ⚠️ {error} — Using fallback data
            </span>
          </div>
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="mt-4 bg-cyan-900/20 border border-cyan-500/30 px-4 py-2">
            <span className="font-terminal text-sm text-cyan-400">
              <span className="inline-block animate-pulse">⟳</span> Connecting to OpenClaw gateway...
            </span>
          </div>
        )}
      </header>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

        {/* Left Sidebar - Minions */}
        <div
          className="lg:col-span-2 space-y-4 animate-fade-in-left"
          style={{ animationDelay: '0.1s' }}
        >
          {/* Minion Squad */}
          <div className="bg-gray-900/50 border-2 border-gray-800 p-4">
            <h2 className="font-pixel text-xs text-purple-400 mb-4">MINION SQUAD</h2>
            <div className="grid grid-cols-2 gap-4">
              {mockMinions.map((minion, index) => (
                <div
                  key={minion.name}
                  className="animate-scale-in"
                  style={{ animationDelay: `${0.2 + index * 0.05}s` }}
                >
                  <MinionAgent {...minion} />
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-900/50 border-2 border-gray-800 p-4">
            <QuickActions />
          </div>
        </div>

        {/* Center - Status Board */}
        <div
          className="lg:col-span-7 animate-fade-in-up"
          style={{ animationDelay: '0.2s' }}
        >
          <div className="bg-gray-900/50 border-2 border-gray-800 p-4 h-full">
            <StatusBoard
              missions={missions.length > 0 ? missions : [{
                id: 'loading',
                title: 'Loading sessions...',
                description: 'Fetching data from OpenClaw gateway',
                status: 'active',
                priority: 'high',
                createdAt: new Date(),
                updatedAt: new Date(),
                assignedAgent: 'SYSTEM',
                progress: 50,
              }]}
            />
          </div>
        </div>

        {/* Right Sidebar */}
        <div
          className="lg:col-span-3 space-y-4 animate-fade-in-right"
          style={{ animationDelay: '0.3s' }}
        >
          {/* System Stats */}
          <div className="bg-gray-900/50 border-2 border-gray-800 p-4">
            <SystemStats
              uptime={uptime}
              tasksCompleted={tasksCompleted}
              activeAgents={systemStatus?.sessions?.active || activeMinions}
              totalSessions={systemStatus?.sessions?.total}
              cpuUsage={42}
              memoryUsage={58}
            />
          </div>

          {/* Activity Feed */}
          <div className="bg-gray-900/50 border-2 border-gray-800 p-4">
            <ActivityFeed activities={activities} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer
        className="mt-6 border-t-2 border-gray-800 pt-4 animate-fade-in"
        style={{ animationDelay: '0.5s' }}
      >
        <div className="flex flex-col md:flex-row justify-between items-center gap-2 font-terminal text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <span className="text-cyan-400">🦉</span>
            <span>CALEB AI — CHIEF OF STAFF</span>
            <span className="text-gray-700">|</span>
            <span className={systemStatus?.status === 'online' ? 'text-green-400' : 'text-red-400'}>
              {systemStatus?.status === 'online' ? 'OPENCLAW GATEWAY CONNECTED' : 'GATEWAY OFFLINE'}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span>WS: <span className={systemStatus?.status === 'online' ? 'text-green-400' : 'text-red-400'}>
              {systemStatus?.status === 'online' ? 'ONLINE' : 'OFFLINE'}
            </span></span>
            <span>LATENCY: <span className="text-yellow-400">{systemStatus?.responseTime || '24'}ms</span></span>
            <span>MODEL: <span className="text-purple-400">{modelName}</span></span>
          </div>
        </div>
      </footer>
    </div>
  );
}
