import React from 'react';
import { Activity, ShieldCheck, Database, Award, FileSpreadsheet } from 'lucide-react';
import { ModelAlgorithm } from '../types/heartDisease';

interface HeaderProps {
  activeTab: 'assessment' | 'benchmarks' | 'batch';
  setActiveTab: (tab: 'assessment' | 'benchmarks' | 'batch') => void;
  selectedModel: ModelAlgorithm;
  setSelectedModel: (m: ModelAlgorithm) => void;
  onOpenReport: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  selectedModel,
  setSelectedModel,
  onOpenReport,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Logo & Project Title */}
          <div className="flex items-center space-x-3.5">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 shadow-lg shadow-rose-950/40 text-white">
              <Activity className="w-6 h-6 animate-pulse" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-900" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  CardioPredict <span className="text-rose-500 font-extrabold text-xs px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20 uppercase tracking-wider">ML Diagnostics</span>
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded-md">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  91.7% Accuracy
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Multi-Model Clinical Risk Stratification Engine (Cleveland Patient Cohort)
              </p>
            </div>
          </div>

          {/* Right Navigation & Controls */}
          <div className="flex items-center flex-wrap gap-2.5">
            {/* View Tabs */}
            <div className="flex items-center bg-slate-800/90 p-1 rounded-xl border border-slate-700/60">
              <button
                type="button"
                onClick={() => setActiveTab('assessment')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
                  activeTab === 'assessment'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                Patient Diagnostic
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('benchmarks')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
                  activeTab === 'benchmarks'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                ML Benchmarks & EDA
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('batch')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
                  activeTab === 'batch'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                Cohort Batch Test
              </button>
            </div>

            {/* Print/Export Consultation Report */}
            <button
              type="button"
              onClick={onOpenReport}
              className="text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-xl transition-all shadow-sm hover:border-slate-600 flex items-center gap-1.5"
            >
              <Database className="w-3.5 h-3.5 text-rose-400" />
              Clinical Summary
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
