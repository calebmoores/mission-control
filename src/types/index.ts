export interface Mission {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'queued' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  assignedAgent?: string;
  progress?: number; // 0-100
  result?: string;
}

export interface SideHustle {
  id: string;
  name: string;
  description: string;
  status: 'researching' | 'building' | 'launching' | 'running' | 'paused';
  revenue?: number; // in cents or smallest currency unit
  createdAt: Date;
  updatedAt: Date;
  metrics?: {
    views?: number;
    users?: number;
    conversions?: number;
  };
}

export interface SystemStatus {
  uptime: number; // in seconds
  modelUsage: {
    model: string;
    tokensUsed: number;
    requests: number;
  }[];
  apiStatus: {
    service: string;
    status: 'online' | 'offline' | 'degraded';
    responseTime?: number; // in ms
  }[];
  lastUpdated: Date;
}

export interface AgentStatus {
  id: string;
  name: string;
  status: 'online' | 'working' | 'idle' | 'offline';
  currentTask?: string;
  lastActive: Date;
}