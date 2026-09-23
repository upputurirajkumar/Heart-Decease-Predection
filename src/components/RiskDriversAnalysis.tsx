import React from 'react';
import { ShieldAlert, ShieldCheck, Info, HelpCircle } from 'lucide-react';
import { RiskFactorDriver } from '../types/heartDisease';

interface RiskDriversAnalysisProps {
  drivers: RiskFactorDriver[];
}

export const RiskDriversAnalysis: React.FC<RiskDriversAnalysisProps> = ({ drivers }) => {
  return (
    <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-xl">
      <div className="pb-4 mb-4 border-b border-slate-700/70">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          Patient-Specific Key Risk Drivers & Clinical Attribution
        </h2>
        <p className="text-xs text-slate-400">
          Decomposition of primary contributing clinical variables ranked by diagnostic impact
        </p>
      </div>

      <div className="space-y-3">
        {drivers.map((driver) => {
          const isHigh = driver.impact === 'high_risk';
          const isModerate = driver.impact === 'moderate_risk';
          const isProtective = driver.impact === 'protective';

          return (
            <div
              key={driver.featureName}
              className={`p-3 rounded-xl border transition-all ${
                isHigh
                  ? 'bg-rose-950/20 border-rose-800/50'
                  : isModerate
                  ? 'bg-amber-950/20 border-amber-800/50'
                  : 'bg-emerald-950/20 border-emerald-800/50'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                <div className="flex items-center gap-2">
                  {isHigh ? (
                    <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                  ) : isModerate ? (
                    <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  )}
                  <span className="text-xs font-bold text-white">{driver.label}</span>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-400">
                    Patient: <strong className="text-slate-200">{driver.patientValue}</strong>
                  </span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-400">
                    Normal: <span className="text-slate-300">{driver.normalRange}</span>
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      isHigh
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : isModerate
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    {isHigh ? 'High Risk' : isModerate ? 'Moderate Risk' : 'Protective'}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300 mt-1 pl-4">
                {driver.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
