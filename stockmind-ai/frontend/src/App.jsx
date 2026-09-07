import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MultiAgentModal from './components/MultiAgentModal';

// Views
import OverviewView from './views/OverviewView';
import VisionAgentView from './views/VisionAgentView';
import DemandSensingView from './views/DemandSensingView';
import StockReconciliationView from './views/StockReconciliationView';
import ProcurementView from './views/ProcurementView';
import LogisticsView from './views/LogisticsView';
import SettingsView from './views/SettingsView';

export default function App() {
  const [activeTab, setActiveTab] = useState('vision');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCycleRunning, setIsCycleRunning] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleTriggerCycle = () => {
    setIsModalOpen(true);
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <OverviewView 
            onNavigateToVision={() => setActiveTab('vision')} 
            onTriggerCycle={handleTriggerCycle} 
          />
        );
      case 'vision':
        return <VisionAgentView />;
      case 'demand':
        return <DemandSensingView />;
      case 'reconciliation':
        return <StockReconciliationView />;
      case 'procurement':
        return <ProcurementView />;
      case 'logistics':
        return <LogisticsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <VisionAgentView />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0B0B10] ambient-glow-mesh text-white selection:bg-[#CCFF00] selection:text-black relative">
      {/* Subtle floating doodle stars matching Dikshant reference */}
      <div className="fixed top-12 right-16 text-[#FFD600] text-xl select-none pointer-events-none opacity-40 animate-pulse">✦</div>
      <div className="fixed bottom-24 left-72 text-[#CCFF00] text-lg select-none pointer-events-none opacity-30">★</div>
      <div className="fixed top-1/2 right-10 text-[#8A2BE2] text-2xl select-none pointer-events-none opacity-25">✦</div>

      {/* 1. Sidebar Navigasi (Desktop + Mobile Drawer) */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* 2. Header Utama dengan Toggle Hamburger */}
        <Header 
          onTriggerCycle={handleTriggerCycle}
          isCycleRunning={isCycleRunning}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
        />

        {/* Scrollable Dashboard Viewport */}
        <main className="flex-1 p-3.5 sm:p-5 md:p-6 lg:p-8 space-y-6 max-w-[1600px] w-full mx-auto">
          {renderActiveView()}

          {/* Bottom Footer Architecture Strip (Gaya Dark Pill Kapsul) */}
          <div className="mt-8 bg-[#14141E] border border-[#242436] rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-300 gap-3">
            <div className="flex items-center gap-2.5">
              <span className="bg-[#CCFF00] text-black px-2.5 py-0.5 rounded-full font-mono text-[10px] font-black uppercase tracking-wider">
                ORKESTRATOR
              </span>
              <span className="font-medium text-zinc-200">
                StockMind AI — Jalur Rantai Pasok Otonom • Sokrates × AWS × SAP Hackathon 2026
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
              <span className="bg-[#181826] text-zinc-300 px-3 py-1 border border-[#2D2D42] rounded-full hover:border-[#CCFF00] transition-colors">
                AWS Bedrock (Claude 3.5 Sonnet)
              </span>
              <span className="bg-[#181826] text-zinc-300 px-3 py-1 border border-[#2D2D42] rounded-full hover:border-[#CCFF00] transition-colors">
                YOLOv8n-Box
              </span>
              <span className="bg-[#181826] text-zinc-300 px-3 py-1 border border-[#2D2D42] rounded-full hover:border-[#CCFF00] transition-colors">
                SAP S/4HANA Cloud
              </span>
            </div>
          </div>
        </main>
      </div>

      {/* Interactive Multi-Agent Orchestration Simulation Modal */}
      <MultiAgentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
