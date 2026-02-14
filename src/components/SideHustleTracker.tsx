'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { gatewayService } from '@/services/gatewayService';
import { SideHustle } from '@/types';

export default function SideHustleTracker() {
  const [sideHustles, setSideHustles] = useState<SideHustle[]>([]);

  useEffect(() => {
    // Set up callback for side hustle updates
    gatewayService.setSideHustlesUpdateCallback((updatedSideHustles) => {
      setSideHustles(updatedSideHustles);
    });

    // Request initial side hustle data
    gatewayService.sendMessage('get_side_hustles');

    return () => {
      // Clean up callbacks
      gatewayService.setSideHustlesUpdateCallback(null);
    };
  }, []);

  const getStatusColor = (status: SideHustle['status']) => {
    switch (status) {
      case 'running': return 'bg-green-500';
      case 'launching': return 'bg-blue-500';
      case 'building': return 'bg-yellow-500';
      case 'researching': return 'bg-purple-500';
      case 'paused': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const formatRevenue = (revenue: number | undefined) => {
    if (revenue === undefined) return '$0.00';
    // Assuming revenue is in cents
    return `$${(revenue / 100).toFixed(2)}`;
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="mb-8"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center">
          <span className="mr-2">💼</span> Side Hustle Tracker
        </h2>
        <span className="bg-accent text-xs px-2 py-1 rounded">
          {sideHustles.length} projects
        </span>
      </div>
      
      {sideHustles.length === 0 ? (
        <div className="bg-card-bg border border-card-border rounded-lg p-8 text-center">
          <p className="text-gray-400">No side hustles being tracked</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sideHustles.map((hustle, index) => (
            <motion.div
              key={hustle.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-card-bg border border-card-border rounded-lg p-4"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold">{hustle.name}</h3>
                <span className={`inline-block w-3 h-3 rounded-full ${getStatusColor(hustle.status)}`}></span>
              </div>
              
              <p className="text-gray-400 text-sm mb-3">{hustle.description}</p>
              
              <div className="flex justify-between items-center">
                <div className="text-sm">
                  <span className="text-gray-500">Status: </span>
                  <span className="capitalize">{hustle.status}</span>
                </div>
                
                {hustle.revenue !== undefined && (
                  <div className="text-sm font-bold text-green-400">
                    {formatRevenue(hustle.revenue)}
                  </div>
                )}
              </div>
              
              {hustle.metrics && (
                <div className="mt-3 pt-3 border-t border-gray-700 flex justify-between text-xs">
                  {hustle.metrics.views !== undefined && (
                    <div>
                      <span className="text-gray-500">Views: </span>
                      <span>{hustle.metrics.views.toLocaleString()}</span>
                    </div>
                  )}
                  {hustle.metrics.users !== undefined && (
                    <div>
                      <span className="text-gray-500">Users: </span>
                      <span>{hustle.metrics.users.toLocaleString()}</span>
                    </div>
                  )}
                  {hustle.metrics.conversions !== undefined && (
                    <div>
                      <span className="text-gray-500">Conv: </span>
                      <span>{hustle.metrics.conversions.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </motion.section>
  );
}