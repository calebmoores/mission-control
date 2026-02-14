'use client';

import { motion } from 'framer-motion';
import { Mission } from '@/types';

interface MissionCardProps {
  mission: Mission;
  index: number;
}

export default function MissionCard({ mission, index }: MissionCardProps) {
  const getPriorityColor = (priority: Mission['priority']) => {
    switch (priority) {
      case 'critical': return 'border-red-500';
      case 'high': return 'border-orange-500';
      case 'medium': return 'border-yellow-500';
      case 'low': return 'border-green-500';
      default: return 'border-gray-500';
    }
  };

  const getStatusColor = (status: Mission['status']) => {
    switch (status) {
      case 'active': return 'bg-blue-500';
      case 'queued': return 'bg-gray-500';
      case 'completed': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className={`bg-card-bg border border-card-border rounded-lg p-4 mb-4 relative overflow-hidden ${mission.status === 'active' ? 'card-pulse' : ''}`}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-lg mb-1">{mission.title}</h3>
          <p className="text-gray-400 text-sm mb-3">{mission.description}</p>
        </div>
        <div className="flex items-center">
          {mission.status === 'active' && (
            <span className="minion-working mr-2">🤖</span>
          )}
          <span className={`inline-block w-3 h-3 rounded-full ${getStatusColor(mission.status)}`}></span>
        </div>
      </div>
      
      <div className="flex justify-between items-center mt-2">
        <div className="text-xs text-gray-500">
          {mission.assignedAgent && (
            <span>Agent: {mission.assignedAgent}</span>
          )}
        </div>
        
        <div className={`text-xs px-2 py-1 rounded ${getPriorityColor(mission.priority)} border`}>
          {mission.priority}
        </div>
      </div>
      
      {mission.progress !== undefined && mission.status === 'active' && (
        <div className="mt-3">
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full" 
              style={{ width: `${mission.progress}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-400 mt-1 text-right">
            {mission.progress}%
          </div>
        </div>
      )}
    </motion.div>
  );
}