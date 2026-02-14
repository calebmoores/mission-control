'use client';

import { useEffect, useRef } from 'react';

interface Activity {
  id: string;
  timestamp: Date;
  agent: string;
  agentType: 'caleb' | 'coder' | 'researcher' | 'writer' | 'analyst';
  action: string;
  target?: string;
  status: 'completed' | 'in-progress' | 'failed';
}

interface ActivityFeedProps {
  activities: Activity[];
}

const agentIcons: Record<string, string> = {
  caleb: '🦉',
  coder: '💻',
  researcher: '🔍',
  writer: '✍️',
  analyst: '📊',
};

const statusColors = {
  completed: 'text-green-400',
  'in-progress': 'text-yellow-400',
  failed: 'text-red-400',
};

export default function ActivityFeed({ activities }: ActivityFeedProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new activities arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activities]);

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-pixel text-sm text-pink-400">ACTIVITY LOG</h2>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 animate-pulse" />
          <span className="font-terminal text-xs text-gray-400">LIVE</span>
        </div>
      </div>

      {/* Activity List */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-1 pr-2 font-mono text-sm"
        style={{ maxHeight: '300px' }}
      >
        {activities.map((activity, index) => (
          <div
            key={activity.id}
            className={`activity-item py-2 ${index === 0 ? 'active' : ''} animate-fade-in-left`}
            style={{ animationDelay: `${index * 0.02}s` }}
          >
            {/* Timestamp */}
            <div className="font-terminal text-xs text-gray-600 mb-1">
              [{formatTime(activity.timestamp)}]
            </div>

            {/* Content */}
            <div className="flex items-start gap-2">
              {/* Agent Icon */}
              <span className="text-lg">{agentIcons[activity.agentType]}</span>

              <div className="flex-1 min-w-0">
                {/* Agent Name */}
                <span className="font-terminal text-cyan-400 text-xs uppercase">
                  {activity.agent}
                </span>

                {/* Action */}
                <span className="font-terminal text-gray-300 ml-2">
                  {activity.action}
                </span>

                {/* Target */}
                {activity.target && (
                  <span className="font-terminal text-purple-400 ml-1 truncate block">
                    → {activity.target}
                  </span>
                )}

                {/* Status Indicator */}
                <div className="flex items-center gap-2 mt-1">
                  <span className={`font-terminal text-xs ${statusColors[activity.status]}`}>
                    {activity.status === 'in-progress' ? '▶ RUNNING' : 
                     activity.status === 'completed' ? '✓ DONE' : 
                     '✗ FAILED'}
                  </span>
                  
                  {activity.status === 'in-progress' && (
                    <div className="typing-indicator scale-50 origin-left">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Empty State */}
        {activities.length === 0 && (
          <div className="text-center py-8">
            <span className="font-terminal text-gray-600">NO ACTIVITY RECORDED</span>
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="mt-3 pt-3 border-t border-gray-800">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="font-pixel text-xs text-green-400">
              {activities.filter(a => a.status === 'completed').length}
            </div>
            <div className="font-terminal text-xs text-gray-500">DONE</div>
          </div>
          <div>
            <div className="font-pixel text-xs text-yellow-400">
              {activities.filter(a => a.status === 'in-progress').length}
            </div>
            <div className="font-terminal text-xs text-gray-500">ACTIVE</div>
          </div>
          <div>
            <div className="font-pixel text-xs text-red-400">
              {activities.filter(a => a.status === 'failed').length}
            </div>
            <div className="font-terminal text-xs text-gray-500">FAILED</div>
          </div>
        </div>
      </div>
    </div>
  );
}
