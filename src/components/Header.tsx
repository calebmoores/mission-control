'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { gatewayService } from '@/services/gatewayService';
import { AgentStatus } from '@/types';

export default function Header() {
  const [agentStatus, setAgentStatus] = useState<AgentStatus[]>([]);
  const [calebStatus, setCalebStatus] = useState<'online' | 'working' | 'idle' | 'offline'>('offline');

  useEffect(() => {
    // Set up callback for agent status updates
    gatewayService.setAgentStatusUpdateCallback((agents) => {
      setAgentStatus(agents);
      
      // Find Caleb's status (assuming Caleb is the main agent)
      const caleb = agents.find(agent => agent.name === 'Caleb');
      if (caleb) {
        setCalebStatus(caleb.status);
      }
    });

    // Request initial agent status
    gatewayService.sendMessage('get_agent_status');

    return () => {
      // Clean up callbacks
      gatewayService.setAgentStatusUpdateCallback(null);
    };
  }, []);

  return (
    <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <motion.h1 
            className="text-2xl font-bold flex items-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-3xl mr-3">🦉</span>
            CALEB — Chief of Staff
          </motion.h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <span className={`status-indicator status-${calebStatus}`}></span>
            <span className="text-sm capitalize">{calebStatus}</span>
          </div>
          
          <div className="text-sm text-gray-400">
            {agentStatus.filter(a => a.status === 'online' || a.status === 'working').length} agents active
          </div>
        </div>
      </div>
    </header>
  );
}