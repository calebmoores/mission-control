import { NextResponse } from 'next/server';
import { execSync } from 'child_process';

const GATEWAY_TOKEN = '31233123';

interface SessionData {
  key: string;
  updatedAt: number;
  age: number;
}

interface HealthResponse {
  ok: boolean;
  ts: number;
  durationMs: number;
  agents?: Array<{
    agentId: string;
    isDefault: boolean;
    sessions?: {
      count: number;
      recent: SessionData[];
    };
  }>;
  sessions?: {
    count: number;
    recent: SessionData[];
  };
}

// Agent name mapping for better display
const AGENT_NAMES: Record<string, string> = {
  'main': 'Caleb (Chief)',
  'discord': 'Discord Bot',
};

// Session key patterns to determine mission type
function getMissionType(sessionKey: string): { title: string; description: string; priority: 'critical' | 'high' | 'medium' | 'low' } {
  const key = sessionKey.toLowerCase();

  if (key.includes('nightcap')) {
    return {
      title: '🌙 Nightcap Content Discovery',
      description: 'Finding and sharing curated content for evening relaxation',
      priority: 'medium'
    };
  }
  if (key.includes('morning') || key.includes('briefing')) {
    return {
      title: '🌅 Morning Briefing',
      description: 'Daily briefing and task planning session',
      priority: 'high'
    };
  }
  if (key.includes('heartbeat')) {
    return {
      title: '💓 System Heartbeat',
      description: 'Periodic system health check and monitoring',
      priority: 'low'
    };
  }
  if (key.includes('subagent')) {
    return {
      title: '🔧 Subagent Task Execution',
      description: 'Delegated task processing by subagent',
      priority: 'high'
    };
  }
  if (key.includes('mission') || key.includes('control')) {
    return {
      title: '🎯 Mission Control Update',
      description: 'Dashboard and mission control operations',
      priority: 'critical'
    };
  }
  if (key.includes('research')) {
    return {
      title: '🔍 Research Task',
      description: 'Information gathering and analysis',
      priority: 'medium'
    };
  }
  if (key.includes('write') || key.includes('content')) {
    return {
      title: '✍️ Content Creation',
      description: 'Writing and content generation task',
      priority: 'high'
    };
  }

  return {
    title: '🤖 AI Session',
    description: 'Active AI agent session',
    priority: 'medium'
  };
}

function getAgentInfo(sessionKey: string): { name: string; role: string; type: 'caleb' | 'coder' | 'researcher' | 'writer' | 'analyst' } {
  const parts = sessionKey.split(':');
  const agentType = parts[2] || 'unknown';
  const agentId = parts[3] || 'unknown';

  if (agentType === 'subagent') {
    // Subagent ID determines role based on common patterns
    const id = agentId.toLowerCase();
    if (id.includes('research')) {
      return { name: `Research-${agentId.slice(0, 6)}`, role: 'Research Assistant', type: 'researcher' };
    }
    if (id.includes('code') || id.includes('dev')) {
      return { name: `Coder-${agentId.slice(0, 6)}`, role: 'Code Minion', type: 'coder' };
    }
    if (id.includes('write')) {
      return { name: `Writer-${agentId.slice(0, 6)}`, role: 'Content Minion', type: 'writer' };
    }
    return { name: `Minion-${agentId.slice(0, 6)}`, role: 'Task Minion', type: 'coder' };
  }

  if (agentType === 'discord') {
    return { name: 'Discord Bot', role: 'Channel Manager', type: 'analyst' };
  }

  return { name: 'Caleb', role: 'Chief of Staff', type: 'caleb' };
}

export async function GET() {
  try {
    // Call the OpenClaw health command to get session data
    const result = execSync('openclaw health --json', {
      encoding: 'utf-8',
      timeout: 10000,
    });

    const health: HealthResponse = JSON.parse(result);

    // Transform session data into our Mission format
    const sessions = health.sessions?.recent || [];
    const sessionCount = health.sessions?.count || 0;

    // Get unique missions from sessions (deduplicate by key prefix)
    const seenKeys = new Set<string>();
    const uniqueSessions = sessions.filter((session: SessionData) => {
      // Extract base key without timestamp
      const baseKey = session.key.split(':').slice(0, 4).join(':');
      if (seenKeys.has(baseKey)) return false;
      seenKeys.add(baseKey);
      return true;
    });

    // Map sessions to missions/tasks
    const missions = uniqueSessions.map((session: SessionData) => {
      // Determine status based on session age
      const isVeryRecent = session.age < 30000; // Less than 30 seconds
      const isRecent = session.age < 300000; // Less than 5 minutes
      const isActive = session.age < 60000; // Less than 1 minute

      let status: 'active' | 'queued' | 'blocked' | 'completed' = 'queued';
      if (isVeryRecent) status = 'active';
      else if (isActive) status = 'active';
      else if (isRecent) status = 'completed';

      const agentInfo = getAgentInfo(session.key);
      const missionInfo = getMissionType(session.key);

      // Calculate progress based on status
      let progress: number | undefined;
      if (status === 'active') progress = Math.floor(Math.random() * 40) + 50; // 50-90%
      else if (status === 'completed') progress = 100;

      // Create mission object from session
      return {
        id: session.key,
        title: missionInfo.title,
        description: missionInfo.description,
        status,
        priority: missionInfo.priority,
        createdAt: new Date(session.updatedAt - session.age),
        updatedAt: new Date(session.updatedAt),
        assignedAgent: agentInfo.name,
        agentRole: agentInfo.role,
        agentType: agentInfo.type,
        progress,
        sessionAge: session.age,
      };
    });

    // Sort by status (active first) then by priority
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    missions.sort((a, b) => {
      if (a.status === 'active' && b.status !== 'active') return -1;
      if (b.status === 'active' && a.status !== 'active') return 1;
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

    return NextResponse.json({
      missions,
      totalCount: sessionCount,
      timestamp: Date.now(),
      gatewayStatus: 'online',
    });
  } catch (error) {
    console.error('Error fetching sessions:', error);

    // Return fallback mock data if gateway is unavailable
    return NextResponse.json({
      missions: [
        {
          id: 'fallback-1',
          title: '⚠️ Gateway Connection Issue',
          description: 'Unable to connect to OpenClaw gateway. Check service status.',
          status: 'blocked',
          priority: 'critical',
          createdAt: new Date(),
          updatedAt: new Date(),
          assignedAgent: 'SYSTEM',
          agentRole: 'System Monitor',
          agentType: 'analyst',
        }
      ],
      totalCount: 0,
      timestamp: Date.now(),
      gatewayStatus: 'offline',
      error: 'Gateway unavailable',
    }, { status: 200 });
  }
}
