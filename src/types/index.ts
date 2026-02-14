export type MissionStatus = 'active' | 'queued' | 'blocked' | 'completed';
export type MissionPriority = 'critical' | 'high' | 'medium' | 'low';
export type AgentType = 'caleb' | 'coder' | 'researcher' | 'writer' | 'analyst';
export type AgentStatus = 'online' | 'working' | 'idle' | 'offline' | 'busy';

export interface Mission {
  id: string;
  title: string;
  description: string;
  status: MissionStatus;
  priority: MissionPriority;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  assignedAgent?: string;
  progress?: number;
  result?: string;
}

export interface SideHustle {
  id: string;
  name: string;
  description: string;
  status: 'researching' | 'building' | 'launching' | 'running' | 'paused';
  revenue?: number;
  createdAt: Date;
  updatedAt: Date;
  metrics?: {
    views?: number;
    users?: number;
    conversions?: number;
  };
}

export interface SystemStatus {
  uptime: number;
  modelUsage: {
    model: string;
    tokensUsed: number;
    requests: number;
  }[];
  apiStatus: {
    service: string;
    status: 'online' | 'offline' | 'degraded';
    responseTime?: number;
  }[];
  lastUpdated: Date;
}

export interface AgentInfo {
  id: string;
  name: string;
  status: AgentStatus;
  currentTask?: string;
  lastActive: Date;
}

export interface Activity {
  id: string;
  timestamp: Date;
  agent: string;
  agentType: AgentType;
  action: string;
  target?: string;
  status: 'completed' | 'in-progress' | 'failed';
}

export interface Minion {
  id: string;
  name: string;
  type: AgentType;
  status: AgentStatus;
  currentTask?: string;
  lastActive: Date;
}

export interface DashboardStats {
  totalMissions: number;
  activeMissions: number;
  completedToday: number;
  blockedMissions: number;
  uptime: number;
  activeAgents: number;
  tasksCompletedToday: number;
}
