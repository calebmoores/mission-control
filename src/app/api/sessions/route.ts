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

    // Map sessions to missions/tasks
    const missions = sessions.map((session: SessionData, index: number) => {
      // Determine status based on session age (active if updated recently)
      const isRecent = session.age < 300000; // Less than 5 minutes
      const isActive = session.age < 60000; // Less than 1 minute

      let status: 'active' | 'queued' | 'blocked' | 'completed' = 'queued';
      if (isActive) status = 'active';
      else if (isRecent) status = 'completed';

      // Parse session key to get agent info
      const parts = session.key.split(':');
      const agentType = parts[2] || 'unknown';
      const agentId = parts[3] || 'unknown';

      // Determine agent role from session key
      let assignedAgent = 'Caleb';
      let agentRole = 'caleb';

      if (agentType === 'subagent') {
        assignedAgent = `Subagent-${agentId.slice(0, 8)}`;
        agentRole = 'coder';
      } else if (agentType === 'discord') {
        assignedAgent = 'Discord Bot';
        agentRole = 'coder';
      }

      // Create mission-like object from session
      return {
        id: session.key,
        title: `${agentType === 'subagent' ? 'Subagent Task' : agentType === 'discord' ? 'Discord Interaction' : 'Main Session'}`,
        description: `Session: ${session.key}`,
        status,
        priority: isActive ? 'high' : 'medium' as const,
        createdAt: new Date(session.updatedAt - session.age),
        updatedAt: new Date(session.updatedAt),
        assignedAgent,
        progress: isActive ? 75 : isRecent ? 100 : undefined,
        agentRole,
      };
    });

    return NextResponse.json({
      missions,
      totalCount: sessionCount,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Error fetching sessions:', error);

    // Return fallback mock data if gateway is unavailable
    return NextResponse.json({
      missions: [
        {
          id: 'fallback-1',
          title: 'Gateway Connection',
          description: 'Unable to connect to OpenClaw gateway. Using fallback data.',
          status: 'blocked',
          priority: 'critical',
          createdAt: new Date(),
          updatedAt: new Date(),
          assignedAgent: 'SYSTEM',
        }
      ],
      totalCount: 0,
      timestamp: Date.now(),
      error: 'Gateway unavailable',
    }, { status: 200 });
  }
}
