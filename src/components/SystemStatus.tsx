'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { gatewayService } from '@/services/gatewayService';
import { SystemStatus } from '@/types';

export default function SystemStatus() {
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);

  useEffect(() => {
    // Set up callback for system status updates
    gatewayService.setSystemStatusUpdateCallback((status) => {
      setSystemStatus(status);
    });

    // Request initial system status
    gatewayService.sendMessage('get_system_status');

    // Set up periodic updates
    const interval = setInterval(() => {
      gatewayService.sendMessage('get_system_status');
    }, 30000); // Update every 30 seconds

    return () => {
      // Clean up callbacks and interval
      gatewayService.setSystemStatusUpdateCallback(null);
      clearInterval(interval);
    };
  }, []);

  const getStatusColor = (status: 'online' | 'offline' | 'degraded') => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'degraded': return 'bg-yellow-500';
      case 'offline': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / (24 * 3600));
    const hours = Math.floor((seconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="mb-8"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center">
          <span className="mr-2">🖥️</span> System Status
        </h2>
        <span className="bg-primary text-xs px-2 py-1 rounded">
          Live
        </span>
      </div>
      
      {!systemStatus ? (
        <div className="bg-card-bg border border-card-border rounded-lg p-8 text-center">
          <p className="text-gray-400">Loading system status...</p>
        </div>
      ) : (
        <div className="bg-card-bg border border-card-border rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-800/50 p-4 rounded-lg">
              <div className="text-gray-400 text-sm mb-1">Uptime</div>
              <div className="text-xl font-bold">{formatUptime(systemStatus.uptime)}</div>
            </div>
            
            <div className="bg-gray-800/50 p-4 rounded-lg">
              <div className="text-gray-400 text-sm mb-1">Last Updated</div>
              <div className="text-xl font-bold">
                {new Date(systemStatus.lastUpdated).toLocaleTimeString()}
              </div>
            </div>
            
            <div className="bg-gray-800/50 p-4 rounded-lg">
              <div className="text-gray-400 text-sm mb-1">Model Usage</div>
              <div className="text-xl font-bold">
                {systemStatus.modelUsage.reduce((sum, model) => sum + model.requests, 0)}
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="font-bold mb-3 flex items-center">
              <span className="mr-2">🤖</span> AI Model Usage
            </h3>
            <div className="space-y-2">
              {systemStatus.modelUsage.map((model, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="text-sm">
                    <span className="font-mono">{model.model}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="text-sm mr-3">
                      {model.requests} requests
                    </div>
                    <div className="text-sm text-gray-400">
                      {model.tokensUsed.toLocaleString()} tokens
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-bold mb-3 flex items-center">
              <span className="mr-2">🔌</span> API Status
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {systemStatus.apiStatus.map((api, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between bg-gray-800/50 p-3 rounded"
                >
                  <div className="font-mono text-sm">{api.service}</div>
                  <div className="flex items-center">
                    <span className={`inline-block w-2 h-2 rounded-full mr-2 ${getStatusColor(api.status)}`}></span>
                    <span className="text-sm capitalize">{api.status}</span>
                    {api.responseTime && (
                      <span className="text-xs text-gray-400 ml-2">
                        {api.responseTime}ms
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </motion.section>
  );
}