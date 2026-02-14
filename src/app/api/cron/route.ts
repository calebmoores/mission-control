import { NextResponse } from 'next/server';
import { execSync } from 'child_process';

interface CronJob {
  id: string;
  agentId: string;
  name: string;
  enabled: boolean;
  createdAtMs: number;
  updatedAtMs: number;
  schedule: {
    kind: string;
    expr: string;
    tz: string;
  };
  sessionTarget: string;
  wakeMode: string;
  payload: {
    kind: string;
    message: string;
  };
  delivery: {
    mode: string;
  };
  state: {
    nextRunAtMs: number;
  };
}

interface CronListResponse {
  jobs: CronJob[];
}

// Parse cron expression to human-readable format
function parseCron(expr: string): string {
  const parts = expr.split(' ');
  if (parts.length !== 5) return expr;

  const [minute, hour, dayOfMonth, month, dayOfWeek] = parts;

  // Simple patterns
  if (expr === '0 22 * * *') return 'Daily at 10:00 PM';
  if (expr === '0 7 * * 1-5') return 'Weekdays at 7:00 AM';
  if (expr === '0 */6 * * *') return 'Every 6 hours';
  if (expr === '0 * * * *') return 'Hourly';
  if (expr === '*/15 * * * *') return 'Every 15 minutes';

  return expr;
}

// Determine job type and icon from name
function getJobInfo(name: string): { icon: string; type: 'caleb' | 'coder' | 'researcher' | 'writer' | 'analyst'; category: string } {
  const lowerName = name.toLowerCase();

  if (lowerName.includes('night') || lowerName.includes('content')) {
    return { icon: '🌙', type: 'writer', category: 'Content' };
  }
  if (lowerName.includes('morning') || lowerName.includes('brief')) {
    return { icon: '🌅', type: 'analyst', category: 'Briefing' };
  }
  if (lowerName.includes('heartbeat') || lowerName.includes('health')) {
    return { icon: '💓', type: 'analyst', category: 'Monitoring' };
  }
  if (lowerName.includes('report') || lowerName.includes('stats')) {
    return { icon: '📊', type: 'analyst', category: 'Reporting' };
  }
  if (lowerName.includes('backup') || lowerName.includes('sync')) {
    return { icon: '💾', type: 'coder', category: 'Maintenance' };
  }
  if (lowerName.includes('research') || lowerName.includes('scout')) {
    return { icon: '🔍', type: 'researcher', category: 'Research' };
  }
  if (lowerName.includes('write') || lowerName.includes('draft')) {
    return { icon: '✍️', type: 'writer', category: 'Writing' };
  }
  if (lowerName.includes('code') || lowerName.includes('deploy')) {
    return { icon: '💻', type: 'coder', category: 'Development' };
  }

  return { icon: '⏰', type: 'caleb', category: 'Scheduled' };
}

// Calculate time until next run
function getTimeUntil(nextRunMs: number): string {
  const now = Date.now();
  const diff = nextRunMs - now;

  if (diff < 0) return 'Overdue';
  if (diff < 60000) return 'In < 1 min';
  if (diff < 3600000) return `In ${Math.floor(diff / 60000)} min`;
  if (diff < 86400000) return `In ${Math.floor(diff / 3600000)}h ${Math.floor((diff % 3600000) / 60000)}m`;
  return `In ${Math.floor(diff / 86400000)}d`;
}

export async function GET() {
  try {
    // Call the OpenClaw cron list command
    const result = execSync('openclaw cron list --json', {
      encoding: 'utf-8',
      timeout: 10000,
    });

    const cronData: CronListResponse = JSON.parse(result);

    // Transform cron jobs into activities format
    const activities = cronData.jobs.map((job: CronJob) => {
      const jobInfo = getJobInfo(job.name);
      const isEnabled = job.enabled;
      const timeUntil = getTimeUntil(job.state.nextRunAtMs);

      return {
        id: job.id,
        timestamp: new Date(job.updatedAtMs),
        agent: job.name,
        agentType: jobInfo.type,
        action: isEnabled ? `scheduled ${jobInfo.category.toLowerCase()}` : 'disabled job',
        target: `${parseCron(job.schedule.expr)} • ${timeUntil}`,
        status: isEnabled ? 'in-progress' as const : 'completed' as const,
        nextRun: new Date(job.state.nextRunAtMs).toISOString(),
        deliveryMode: job.delivery.mode,
        icon: jobInfo.icon,
        category: jobInfo.category,
      };
    });

    // Sort by next run time
    activities.sort((a, b) => new Date(a.nextRun).getTime() - new Date(b.nextRun).getTime());

    return NextResponse.json({
      jobs: cronData.jobs,
      activities,
      count: cronData.jobs.length,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Error fetching cron jobs:', error);

    // Return fallback data
    return NextResponse.json({
      jobs: [],
      activities: [],
      count: 0,
      timestamp: Date.now(),
      error: 'Gateway unavailable',
    }, { status: 200 });
  }
}
