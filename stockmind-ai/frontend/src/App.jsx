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
    <div className="flex min-h-screen bg-[#080B11] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* 1. Sidebar Navigasi */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* 2. Header Utama */}
        <Header 
          onTriggerCycle={handleTriggerCycle}
          isCycleRunning={isCycleRunning}
        />

        {/* Scrollable Dashboard Viewport */}
        <main className="flex-1 p-6 lg:p-8 space-y-6 max-w-[1600px] w-full mx-auto">
          {renderActiveView()}

          {/* Bottom Footer Architecture Strip */}
          <div className="pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-400">StockMind AI Orchestrator</span>
              <span>— Intelligent Supply Chain Track • Sokrates × AWS × SAP Hackathon 2026</span>
            </div>
            <div className="flex items-center gap-4 text-[11px] font-mono">
              <span className="text-emerald-400">AWS Bedrock (Claude 3.5 Sonnet)</span>
              <span className="text-slate-600">•</span>
              <span className="text-cyan-400">YOLOv8n-Box</span>
              <span className="text-slate-600">•</span>
              <span className="text-purple-400">SAP S/4HANA Cloud</span>
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
