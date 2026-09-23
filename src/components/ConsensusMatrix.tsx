import React from 'react';
import { Layers, Award, CheckCircle2, AlertCircle, ArrowUpRight } from 'lucide-react';
import { SingleModelPrediction, ModelAlgorithm } from '../types/heartDisease';

interface ConsensusMatrixProps {
  modelPredictions: SingleModelPrediction[];
  selectedModel: ModelAlgorithm;
  onSelectModel: (m: ModelAlgorithm) => void;
}

export const ConsensusMatrix: React.FC<ConsensusMatrixProps> = ({
  modelPredictions,
  selectedModel,
  onSelectModel,
}) => {
  return (
    <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-700/70 gap-2">
        <div>
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-rose-500" />
            Multi-Model Consensus & Algorithm Matrix
          </h2>
          <p className="text-xs text-slate-400">
            Real-time inference across all 7 classification models evaluated in the project
          </p>
        </div>
        <span className="text-[11px] text-slate-400 bg-slate-900/60 px-2.5 py-1 rounded-lg border border-slate-700/50">
          Click any model to select as active classifier
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {modelPredictions.map((m) => {
          const isSelected = selectedModel === m.modelName;
          const probPercent = Math.round(m.probability * 100);
          const isDisease = m.isHeartDisease;

          return (
            <button
              key={m.modelName}
              type="button"
              onClick={() => onSelectModel(m.modelName)}
              className={`p-3.5 rounded-xl border text-left transition-all relative ${
                isSelected
                  ? 'bg-slate-700/80 border-rose-500 shadow-md ring-1 ring-rose-500/50'
                  : 'bg-slate-900/50 hover:bg-slate-800/70 border-slate-700/60 hover:border-slate-600'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  {m.modelName === 'Random Forest' && (
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                  )}
                  {m.modelName}
                </span>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 ${
                    isDisease
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}
                >
                  {isDisease ? (
                    <>
                      <AlertCircle className="w-3 h-3 text-rose-400" />
                      Disease (+1)
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      Negative (0)
                    </>
                  )}
                </span>
              </div>

              {/* Probability bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Risk Probability:</span>
                  <span className="font-bold text-white">{probPercent}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-700/70 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      probPercent >= 50
                        ? probPercent >= 75
                          ? 'bg-rose-500'
                          : 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${probPercent}%` }}
                  />
                </div>
              </div>

              {/* Accuracy & Switch Callout */}
              <div className="mt-2.5 pt-2 border-t border-slate-700/40 flex items-center justify-between text-[10px] text-slate-400">
                <span>Validation Accuracy: {(m.accuracyScore * 100).toFixed(1)}%</span>
                {isSelected ? (
                  <span className="text-rose-400 font-bold uppercase tracking-wider">Active</span>
                ) : (
                  <span className="text-slate-400 flex items-center gap-0.5 group-hover:text-slate-200">
                    Select <ArrowUpRight className="w-3 h-3" />
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
