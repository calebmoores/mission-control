import { NextResponse } from 'next/server';
import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';

interface HealthResponse {
  ok: boolean;
  ts: number;
  durationMs: number;
  channels?: Record<string, {
    configured: boolean;
    running: boolean;
    probe?: {
      ok: boolean;
      bot?: {
        username: string;
      };
    };
  }>;
  agents?: Array<{
    agentId: string;
    isDefault: boolean;
  }>;
  sessions?: {
    count: number;
    recent: Array<{
      key: string;
      updatedAt: number;
      age: number;
    }>;
  };
  heartbeatSeconds?: number;
  defaultAgentId?: string;
}

interface ConfigData {
  gateway?: {
    port?: number;
    auth?: {
      token?: string;
    };
  };
  agents?: {
    defaults?: {
      model?: {
        primary?: string;
      };
    };
  };
}

// Get uptime from process start time (approximate)
function getGatewayUptime(): number {
  try {
    // Try to get process info
    const result = execSync('ps -eo pid,etime,comm | grep -E "(openclaw|gateway)" | grep -v grep | head -1', {
      encoding: 'utf-8',
      timeout: 5000,
    });

    if (result) {
      const parts = result.trim().split(/\s+/);
      if (parts.length >= 2) {
        const timeStr = parts[1];
        // Parse etime format (DD-HH:MM:SS or HH:MM:SS or MM:SS)
        const timeParts = timeStr.split('-');
        let days = 0;
        let timePart = timeStr;

        if (timeParts.length === 2) {
          days = parseInt(timeParts[0], 10);
          timePart = timeParts[1];
        }

        const [hours = 0, minutes = 0, seconds = 0] = timePart.split(':').map(Number).reverse();
        return days * 86400 + hours * 3600 + minutes * 60 + seconds;
      }
    }
  } catch (e) {
    // Ignore errors
  }
  return 0;
}

export async function GET() {
  try {
    // Get health data from gateway
    const healthResult = execSync('openclaw health --json', {
      encoding: 'utf-8',
      timeout: 10000,
    });

    const health: HealthResponse = JSON.parse(healthResult);

    // Read config for additional info
    let config: ConfigData = {};
    try {
      const configPath = join(homedir(), '.openclaw', 'openclaw.json');
      const configContent = readFileSync(configPath, 'utf-8');
      config = JSON.parse(configContent);
    } catch (e) {
      console.warn('Could not read config file');
    }

    // Calculate uptime
    const uptime = getGatewayUptime();

    // Count active channels
    const channels = health.channels || {};
    const activeChannels = Object.values(channels).filter(c => c.running).length;
    const configuredChannels = Object.values(channels).filter(c => c.configured).length;

    // Get session stats
    const sessionCount = health.sessions?.count || 0;
    const recentSessions = health.sessions?.recent || [];
    const activeSessions = recentSessions.filter(s => s.age < 60000).length;

    // Get model info
    const model = config.agents?.defaults?.model?.primary || 'unknown';

    return NextResponse.json({
      status: 'online',
      version: '2026.2.13',
      uptime,
      uptimeFormatted: formatUptime(uptime),
      timestamp: Date.now(),
      gatewayTime: health.ts,
      responseTime: health.durationMs,
      model,
      channels: {
        active: activeChannels,
        configured: configuredChannels,
        details: channels,
      },
      sessions: {
        total: sessionCount,
        active: activeSessions,
        recent: recentSessions.slice(0, 5),
      },
      agents: health.agents || [],
      heartbeatInterval: health.heartbeatSeconds || 3600,
      defaultAgent: health.defaultAgentId || 'main',
    });
  } catch (error) {
    console.error('Error fetching status:', error);

    return NextResponse.json({
      status: 'offline',
      version: 'unknown',
      uptime: 0,
      uptimeFormatted: '00:00:00',
      timestamp: Date.now(),
      error: 'Gateway unavailable',
    }, { status: 200 });
  }
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (days > 0) {
    return `${days}d ${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
