'use client';

import { Mission } from '@/types';

interface StatusBoardProps {
  missions: Mission[];
}

const statusConfig = {
  active: { label: 'ACTIVE', color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400' },
  queued: { label: 'QUEUED', color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400' },
  blocked: { label: 'BLOCKED', color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400' },
  completed: { label: 'DONE', color: 'text-cyan-400', bg: 'bg-cyan-400/10', border: 'border-cyan-400' },
};

const priorityIcons = {
  critical: '!!!',
  high: '!!',
  medium: '!',
  low: '•',
};

export default function StatusBoard({ missions }: StatusBoardProps) {
  // Group missions by status
  const groupedMissions = missions.reduce((acc, mission) => {
    if (!acc[mission.status]) acc[mission.status] = [];
    acc[mission.status].push(mission);
    return acc;
  }, {} as Record<string, Mission[]>);

  const columns = ['active', 'queued', 'blocked', 'completed'] as const;

  return (
    <div className="h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-pixel text-lg text-cyan-400">MISSION BOARD</h2>
        <div className="flex gap-2">
          {columns.map((status) => (
            <div key={status} className="flex items-center gap-1">
              <div className={`w-2 h-2 ${statusConfig[status].bg.replace('/10', '')}`} />
              <span className="font-terminal text-xs text-gray-400 uppercase">{status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Kanban-style Board */}
      <div className="grid grid-cols-4 gap-3 h-[calc(100%-2rem)]">
        {columns.map((status, colIndex) => (
          <div 
            key={status}
            className="flex flex-col animate-fade-in-up"
            style={{ animationDelay: `${colIndex * 0.1}s` }}
          >
            {/* Column Header */}
            <div className={`flex items-center justify-between mb-2 p-2 border-2 ${statusConfig[status].border} ${statusConfig[status].bg}`}>
              <span className={`font-pixel text-xs ${statusConfig[status].color}`}>
                {statusConfig[status].label}
              </span>
              <span className="font-terminal text-sm text-gray-400">
                {groupedMissions[status]?.length || 0}
              </span>
            </div>

            {/* Mission Cards */}
            <div className="flex-1 space-y-2 overflow-y-auto pr-1">
              {groupedMissions[status]?.map((mission, index) => (
                <div
                  key={mission.id}
                  className="bg-gray-800/50 border border-gray-700 p-3 hover:border-cyan-400/50 transition-colors cursor-pointer group animate-fade-in-left"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {/* Priority & Title */}
                  <div className="flex items-start gap-2 mb-2">
                    <span className={`font-pixel text-xs ${
                      mission.priority === 'critical' ? 'text-red-400' :
                      mission.priority === 'high' ? 'text-orange-400' :
                      mission.priority === 'medium' ? 'text-yellow-400' :
                      'text-gray-400'
                    }`}>
                      {priorityIcons[mission.priority]}
                    </span>
                    <h3 className="font-terminal text-sm text-gray-200 leading-tight group-hover:text-cyan-300 transition-colors">
                      {mission.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="font-terminal text-xs text-gray-500 mb-2 line-clamp-2">
                    {mission.description}
                  </p>

                  {/* Progress Bar */}
                  {mission.progress !== undefined && mission.progress > 0 && (
                    <div className="mb-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-terminal text-gray-500">PROGRESS</span>
                        <span className="font-terminal text-cyan-400">{mission.progress}%</span>
                      </div>
                      <div className="pixel-progress h-2">
                        <div 
                          className="pixel-progress-fill"
                          style={{ width: `${mission.progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Footer Info */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-terminal text-gray-500">
                      {mission.assignedAgent || 'UNASSIGNED'}
                    </span>
                    {mission.status === 'active' && (
                      <div className="typing-indicator scale-75">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Empty State */}
              {!groupedMissions[status]?.length && (
                <div className="border-2 border-dashed border-gray-800 p-4 text-center">
                  <span className="font-terminal text-xs text-gray-600">NO MISSIONS</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
