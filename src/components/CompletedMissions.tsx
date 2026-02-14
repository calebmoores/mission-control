'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import MissionCard from './MissionCard';
import { gatewayService } from '@/services/gatewayService';
import { Mission } from '@/types';

export default function CompletedMissions() {
  const [missions, setMissions] = useState<Mission[]>([]);

  useEffect(() => {
    // Set up callback for mission updates
    gatewayService.setMissionsUpdateCallback((updatedMissions) => {
      // Filter for completed missions
      const completedMissions = updatedMissions
        .filter(m => m.status === 'completed')
        .sort((a, b) => (b.completedAt?.getTime() || 0) - (a.completedAt?.getTime() || 0))
        .slice(0, 5); // Show only the 5 most recent
      setMissions(completedMissions);
    });

    // Request initial mission data
    gatewayService.sendMessage('get_missions');

    return () => {
      // Clean up callbacks
      gatewayService.setMissionsUpdateCallback(null);
    };
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="mb-8"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center">
          <span className="mr-2">✅</span> Recently Completed
        </h2>
        <span className="bg-green-500 text-xs px-2 py-1 rounded">
          {missions.length} completed
        </span>
      </div>
      
      {missions.length === 0 ? (
        <div className="bg-card-bg border border-card-border rounded-lg p-8 text-center">
          <p className="text-gray-400">No completed missions yet</p>
        </div>
      ) : (
        <div>
          {missions.map((mission, index) => (
            <MissionCard key={mission.id} mission={mission} index={index} />
          ))}
        </div>
      )}
    </motion.section>
  );
}