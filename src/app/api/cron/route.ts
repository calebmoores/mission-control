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
      const nextRun = new Date(job.state.nextRunAtMs);
      const isEnabled = job.enabled;

      return {
        id: job.id,
        timestamp: new Date(job.updatedAtMs),
        agent: job.name,
        agentType: 'caleb' as const,
        action: isEnabled ? 'scheduled job' : 'disabled job',
        target: `${job.schedule.expr} (${job.schedule.tz})`,
        status: isEnabled ? 'in-progress' as const : 'completed' as const,
        nextRun: nextRun.toISOString(),
        deliveryMode: job.delivery.mode,
      };
    });

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
