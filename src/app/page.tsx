'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import CalebOwl from '@/components/CalebOwl';
import PixelOffice from '@/components/PixelOffice';
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
  agentType?: 'caleb' | 'coder' | 'researcher' | 'writer' | 'analyst';
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
  icon?: string;
  category?: string;
}

// Office agents with dynamic status based on missions
const getOfficeAgents = (missions: Mission[]) => {
  const baseAgents = [
    { id: 'caleb', name: 'Caleb', role: 'Chief of Staff', type: 'caleb' as const, x: 4, y: 4, facing: 'south' as const },
    { id: 'code-01', name: 'Code-01', role: 'Lead Dev', type: 'coder' as const, x: 1, y: 1, facing: 'east' as const },
    { id: 'code-02', name: 'Code-02', role: 'Backend Dev', type: 'coder' as const, x: 1, y: 3, facing: 'east' as const },
    { id: 'research-01', name: 'Research-01', role: 'Data Scout', type: 'researcher' as const, x: 7, y: 1, facing: 'west' as const },
    { id: 'writer-01', name: 'Writer-01', role: 'Content Lead', type: 'writer' as const, x: 7, y: 3, facing: 'west' as const },
    { id: 'analyst-01', name: 'Analyst-01', role: 'Metrics', type: 'analyst' as const, x: 4, y: 7, facing: 'north' as const },
  ];

  return baseAgents.map(agent => {
    // Find mission for this agent
    const agentMission = missions.find(m =>
      m.assignedAgent?.toLowerCase().includes(agent.name.toLowerCase()) ||
      m.assignedAgent?.toLowerCase().includes(agent.type)
    );

    let status: 'idle' | 'working' | 'busy' = 'idle';
    let currentTask: string | undefined;

    if (agentMission) {
      if (agentMission.status === 'active') {
        status = 'working';
        currentTask = agentMission.title;
      } else if (agentMission.status === 'blocked') {
        status = 'busy';
        currentTask = 'Handling issue...';
      }
    }

    // Caleb is always working if any mission is active
    if (agent.id === 'caleb' && missions.some(m => m.status === 'active')) {
      status = 'working';
      currentTask = 'Overseeing operations';
    }

    return { ...agent, status, currentTask };
  });
};

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
  const [activities, setActivities] = useState<Activity[]>([]);
  const [systemStatus, setSystemStatus] = useState<ApiStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'office' | 'board'>('office');

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

      // Update activities from cron jobs and sessions
      const mappedCronActivities = cronData.activities?.map(apiActivityToActivity) || [];
      const mappedSessionActivities = sessionsData.missions
        ?.filter((m: ApiSession) => m.status === 'active')
        .map((m: ApiSession) => ({
          id: m.id,
          timestamp: new Date(m.updatedAt),
          agent: m.assignedAgent || 'SYSTEM',
          agentType: m.agentType || 'coder',
          action: 'executing mission',
          target: m.title,
          status: 'in-progress' as const,
        })) || [];

      // Combine and deduplicate activities
      const combinedActivities = [...mappedCronActivities, ...mappedSessionActivities]
        .slice(0, 10);

      if (combinedActivities.length > 0) {
        setActivities(combinedActivities);
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

  const activeMinions = missions.filter(m => m.status === 'active').length;
  const tasksCompleted = missions.filter(m => m.status === 'completed').length;

  // Get model name for display
  const modelName = systemStatus?.model
    ? systemStatus.model.split('/').pop()?.toUpperCase() || 'CLAUDE'
    : 'CLAUDE-OPUS';

  // Get office agents based on current missions
  const officeAgents = getOfficeAgents(missions);

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

          {/* Navigation */}
          <div className="flex items-center gap-4">
            <Link
              href="/review"
              className="px-4 py-2 bg-gray-900/50 border border-gray-700 hover:border-cyan-400/50 hover:bg-cyan-400/10 transition-all font-terminal text-sm text-gray-400 hover:text-cyan-400"
            >
              📝 CONTENT REVIEW
            </Link>

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

        {/* View Toggle */}
        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={() => setView('office')}
            className={`px-4 py-2 font-terminal text-sm transition-all ${
              view === 'office'
                ? 'bg-cyan-400/20 border border-cyan-400 text-cyan-400'
                : 'bg-gray-900/50 border border-gray-700 text-gray-500 hover:text-gray-400'
            }`}
          >
            🏢 PIXEL OFFICE
          </button>
          <button
            onClick={() => setView('board')}
            className={`px-4 py-2 font-terminal text-sm transition-all ${
              view === 'board'
                ? 'bg-purple-400/20 border border-purple-400 text-purple-400'
                : 'bg-gray-900/50 border border-gray-700 text-gray-500 hover:text-gray-400'
            }`}
          >
            📋 MISSION BOARD
          </button>
        </div>
      </header>

      {/* Main Content */}
      {view === 'office' ? (
        /* Pixel Office View */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Sidebar - Quick Actions */}
          <div className="lg:col-span-2 space-y-4 animate-fade-in-left" style={{ animationDelay: '0.1s' }}>
            <div className="bg-gray-900/50 border-2 border-gray-800 p-4">
              <QuickActions />
            </div>

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
          </div>

          {/* Center - Pixel Office */}
          <div className="lg:col-span-7 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="bg-gray-900/50 border-2 border-gray-800 p-4 h-[600px]">
              <PixelOffice
                agents={officeAgents}
                missions={missions.map(m => ({ id: m.id, title: m.title, status: m.status, assignedAgent: m.assignedAgent || '' }))}
              />
            </div>
          </div>

          {/* Right Sidebar - Activity & Mini Board */}
          <div className="lg:col-span-3 space-y-4 animate-fade-in-right" style={{ animationDelay: '0.3s' }}>
            {/* Activity Feed */}
            <div className="bg-gray-900/50 border-2 border-gray-800 p-4">
              <ActivityFeed activities={activities} />
            </div>

            {/* Quick Mission Preview */}
            <div className="bg-gray-900/50 border-2 border-gray-800 p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-pixel text-sm text-yellow-400">ACTIVE MISSIONS</h2>
                <button
                  onClick={() => setView('board')}
                  className="text-xs font-terminal text-cyan-400 hover:text-cyan-300"
                >
                  VIEW ALL →
                </button>
              </div>
              <div className="space-y-2">
                {missions.filter(m => m.status === 'active').slice(0, 3).map((mission, i) => (
                  <div key={mission.id} className="bg-gray-800/50 p-2 border-l-2 border-cyan-400">
                    <div className="font-terminal text-xs text-gray-300 truncate">{mission.title}</div>
                    <div className="font-terminal text-[10px] text-gray-500">{mission.assignedAgent}</div>
                  </div>
                ))}
                {missions.filter(m => m.status === 'active').length === 0 && (
                  <div className="text-center py-4 text-gray-600 font-terminal text-sm">
                    NO ACTIVE MISSIONS
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Mission Board View */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Sidebar */}
          <div className="lg:col-span-2 space-y-4 animate-fade-in-left" style={{ animationDelay: '0.1s' }}>
            {/* Quick Actions */}
            <div className="bg-gray-900/50 border-2 border-gray-800 p-4">
              <QuickActions />
            </div>
          </div>

          {/* Center - Status Board */}
          <div className="lg:col-span-7 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
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
          <div className="lg:col-span-3 space-y-4 animate-fade-in-right" style={{ animationDelay: '0.3s' }}>
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
      )}

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
