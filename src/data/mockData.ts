import { Mission, Activity, Minion } from '@/types';

export const mockMissions: Mission[] = [
  {
    id: 'mission-001',
    title: 'Deploy Mission Control Dashboard',
    description: 'Build and deploy the pixel-art styled Mission Control dashboard for Caleb AI with real-time updates and retro aesthetics.',
    status: 'active',
    priority: 'critical',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    updatedAt: new Date(),
    assignedAgent: 'CODE-MINION-01',
    progress: 78,
  },
  {
    id: 'mission-002',
    title: 'Research: LLM Benchmark Analysis',
    description: 'Evaluate performance metrics of latest AI models including GPT-4, Claude-3, and Gemini for potential integration.',
    status: 'active',
    priority: 'high',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4),
    updatedAt: new Date(),
    assignedAgent: 'RESEARCH-MINION-02',
    progress: 45,
  },
  {
    id: 'mission-003',
    title: 'Write Weekly Status Report',
    description: 'Compile comprehensive weekly report covering all mission outcomes, system metrics, and strategic recommendations.',
    status: 'queued',
    priority: 'medium',
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
    updatedAt: new Date(),
    assignedAgent: 'WRITER-MINION-01',
  },
  {
    id: 'mission-004',
    title: 'Analyze Q1 User Engagement',
    description: 'Process first quarter user interaction data, identify trends, and generate actionable insights for product improvements.',
    status: 'active',
    priority: 'medium',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
    updatedAt: new Date(),
    assignedAgent: 'ANALYST-MINION-01',
    progress: 32,
  },
  {
    id: 'mission-005',
    title: 'Fix Gateway WebSocket Timeout',
    description: 'Debug and resolve intermittent websocket connection timeouts affecting real-time mission updates in production environment.',
    status: 'blocked',
    priority: 'high',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8),
    updatedAt: new Date(),
    assignedAgent: 'CODE-MINION-02',
  },
  {
    id: 'mission-006',
    title: 'Update API Documentation',
    description: 'Refresh all API documentation with newly added endpoints, updated request/response schemas, and code examples.',
    status: 'completed',
    priority: 'low',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    assignedAgent: 'WRITER-MINION-02',
  },
  {
    id: 'mission-007',
    title: 'Database Query Optimization',
    description: 'Optimize slow-performing queries on mission history lookups to reduce latency below 50ms threshold.',
    status: 'queued',
    priority: 'high',
    createdAt: new Date(Date.now() - 1000 * 60 * 15),
    updatedAt: new Date(),
  },
  {
    id: 'mission-008',
    title: 'Security Audit: Auth System',
    description: 'Perform comprehensive security audit on authentication flow, identify vulnerabilities, and implement fixes.',
    status: 'queued',
    priority: 'critical',
    createdAt: new Date(Date.now() - 1000 * 60 * 60),
    updatedAt: new Date(),
  },
];

export const mockActivities: Activity[] = [
  { 
    id: 'act-001', 
    timestamp: new Date(Date.now() - 1000 * 30), 
    agent: 'Caleb', 
    agentType: 'caleb', 
    action: 'reviewed mission progress', 
    target: 'Mission Control v1', 
    status: 'completed' 
  },
  { 
    id: 'act-002', 
    timestamp: new Date(Date.now() - 1000 * 120), 
    agent: 'CodeMinion-01', 
    agentType: 'coder', 
    action: 'deployed update', 
    target: 'Dashboard UI components', 
    status: 'completed' 
  },
  { 
    id: 'act-003', 
    timestamp: new Date(Date.now() - 1000 * 180), 
    agent: 'ResearchMinion-02', 
    agentType: 'researcher', 
    action: 'analyzing benchmarks', 
    target: 'GPT-5 performance data', 
    status: 'in-progress' 
  },
  { 
    id: 'act-004', 
    timestamp: new Date(Date.now() - 1000 * 300), 
    agent: 'WriterMinion-01', 
    agentType: 'writer', 
    action: 'drafted section', 
    target: 'Weekly Report - Executive Summary', 
    status: 'completed' 
  },
  { 
    id: 'act-005', 
    timestamp: new Date(Date.now() - 1000 * 450), 
    agent: 'AnalystMinion-01', 
    agentType: 'analyst', 
    action: 'generated insights', 
    target: 'Q1 User Retention Analysis', 
    status: 'completed' 
  },
  { 
    id: 'act-006', 
    timestamp: new Date(Date.now() - 1000 * 600), 
    agent: 'CodeMinion-02', 
    agentType: 'coder', 
    action: 'investigating error', 
    target: 'Websocket timeout logs', 
    status: 'in-progress' 
  },
  { 
    id: 'act-007', 
    timestamp: new Date(Date.now() - 1000 * 900), 
    agent: 'Caleb', 
    agentType: 'caleb', 
    action: 'assigned new mission', 
    target: 'Database Optimization', 
    status: 'completed' 
  },
  { 
    id: 'act-008', 
    timestamp: new Date(Date.now() - 1000 * 1200), 
    agent: 'WriterMinion-02', 
    agentType: 'writer', 
    action: 'published documentation', 
    target: 'API v2 Reference', 
    status: 'completed' 
  },
  { 
    id: 'act-009', 
    timestamp: new Date(Date.now() - 1000 * 1500), 
    agent: 'ResearchMinion-01', 
    agentType: 'researcher', 
    action: 'completed research', 
    target: 'Competitor Analysis Q1', 
    status: 'completed' 
  },
  { 
    id: 'act-010', 
    timestamp: new Date(Date.now() - 1000 * 1800), 
    agent: 'Caleb', 
    agentType: 'caleb', 
    action: 'approved deployment', 
    target: 'Mission Control v0.9.5', 
    status: 'completed' 
  },
];

export const mockMinions: Minion[] = [
  { 
    id: 'min-001',
    name: 'CODE-01', 
    type: 'coder', 
    status: 'working', 
    currentTask: 'Deploying dashboard...',
    lastActive: new Date() 
  },
  { 
    id: 'min-002',
    name: 'RESEARCH-02', 
    type: 'researcher', 
    status: 'working', 
    currentTask: 'Analyzing benchmarks...',
    lastActive: new Date() 
  },
  { 
    id: 'min-003',
    name: 'WRITER-01', 
    type: 'writer', 
    status: 'idle',
    lastActive: new Date(Date.now() - 1000 * 300) 
  },
  { 
    id: 'min-004',
    name: 'ANALYST-01', 
    type: 'analyst', 
    status: 'working', 
    currentTask: 'Processing data...',
    lastActive: new Date() 
  },
  { 
    id: 'min-005',
    name: 'CODE-02', 
    type: 'coder', 
    status: 'busy', 
    currentTask: 'Debugging timeout...',
    lastActive: new Date() 
  },
  { 
    id: 'min-006',
    name: 'WRITER-02', 
    type: 'writer', 
    status: 'idle',
    lastActive: new Date(Date.now() - 1000 * 600) 
  },
];

// Helper function to generate more realistic timestamps
export function generateRecentTimestamp(minutesAgo: number): Date {
  return new Date(Date.now() - 1000 * 60 * minutesAgo);
}

// Helper to add new activity
export function addActivity(
  activities: Activity[],
  agent: string,
  agentType: Activity['agentType'],
  action: string,
  target?: string,
  status: Activity['status'] = 'completed'
): Activity[] {
  const newActivity: Activity = {
    id: `act-${Date.now()}`,
    timestamp: new Date(),
    agent,
    agentType,
    action,
    target,
    status,
  };
  return [newActivity, ...activities].slice(0, 50); // Keep last 50
}
