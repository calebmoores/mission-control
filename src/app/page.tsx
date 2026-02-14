'use client';

import { useEffect } from 'react';
import Header from '@/components/Header';
import ActiveMissions from '@/components/ActiveMissions';
import MissionQueue from '@/components/MissionQueue';
import CompletedMissions from '@/components/CompletedMissions';
import SideHustleTracker from '@/components/SideHustleTracker';
import SystemStatus from '@/components/SystemStatus';
import { gatewayService } from '@/services/gatewayService';

export default function Home() {
  useEffect(() => {
    // Initialize the gateway service connection
    // The service is a singleton, so this will only connect once
    console.log('Initializing gateway service connection');
    
    // Clean up on unmount
    return () => {
      console.log('Cleaning up gateway service connection');
    };
  }, []);

  return (
    <div className="min-h-screen grid-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <ActiveMissions />
        <MissionQueue />
        <CompletedMissions />
        <SideHustleTracker />
        <SystemStatus />
      </main>
      
      <footer className="border-t border-gray-800 py-6 text-center text-gray-500 text-sm">
        <div className="container mx-auto px-4">
          Mission Control Dashboard v1.0 · Connected to OpenClaw Gateway
        </div>
      </footer>
    </div>
  );
}
