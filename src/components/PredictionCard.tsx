import React from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Cpu,
  TrendingUp,
  Share2,
  ChevronDown,
} from 'lucide-react';
import { PredictionResult, ModelAlgorithm } from '../types/heartDisease';
import { BENCHMARK_MODELS } from '../ml/modelData';

interface PredictionCardProps {
  prediction: PredictionResult;
  selectedModel: ModelAlgorithm;
  onSelectModel: (m: ModelAlgorithm) => void;
  onOpenReport: () => void;
}

export const PredictionCard: React.FC<PredictionCardProps> = ({
  prediction,
  selectedModel,
  onSelectModel,
  onOpenReport,
}) => {
  const percent = prediction.riskPercentage;
  const isDisease = prediction.hasHeartDisease;

  // SVG Gauge calculations
  const radius = 72;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  const currentBenchmark = BENCHMARK_MODELS.find((m) => m.model === selectedModel);

  return (
    <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 shadow-xl relative overflow-hidden">
      {/* Background glow according to risk */}
      <div
        className="absolute -top-24 -right-24 w-60 h-60 rounded-full blur-3xl opacity-20 pointer-events-none transition-colors duration-500"
        style={{ backgroundColor: prediction.riskColor }}
      />

      {/* Card Header & Model Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-700/70">
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-rose-400" />
            Active Machine Learning Classifier
          </span>
          <div className="relative mt-1">
            <select
              value={selectedModel}
              onChange={(e) => onSelectModel(e.target.value as ModelAlgorithm)}
              className="appearance-none bg-slate-900 border border-slate-700 hover:border-slate-600 text-white font-semibold text-sm rounded-xl px-3.5 py-1.5 pr-8 cursor-pointer focus:outline-none focus:ring-2 focus:ring-rose-500/50"
            >
              {BENCHMARK_MODELS.map((m) => (
                <option key={m.model} value={m.model}>
                  {m.isBest ? `🏆 ${m.model} (Best Model: ${(m.accuracy * 100).toFixed(1)}%)` : `${m.model} (${(m.accuracy * 100).toFixed(1)}%)`}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Model Spec Badge */}
        {currentBenchmark && (
          <div className="flex items-center gap-2 bg-slate-900/60 px-3 py-1.5 rounded-xl border border-slate-700/50 text-right">
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-medium">Test Set Metrics</div>
              <div className="text-xs font-semibold text-slate-200">
                Acc: {(currentBenchmark.accuracy * 100).toFixed(1)}% | AUC: {currentBenchmark.rocAuc.toFixed(3)}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Gauge & Binary Callout */}
      <div className="py-6 flex flex-col items-center text-center">
        {/* SVG Circular Gauge */}
        <div className="relative w-44 h-44 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 170 170">
            {/* Background track */}
            <circle
              cx="85"
              cy="85"
              r={radius}
              stroke="currentColor"
              strokeWidth="12"
              className="text-slate-700/50 fill-none"
            />
            {/* Animated progress ring */}
            <circle
              cx="85"
              cy="85"
              r={radius}
              stroke={prediction.riskColor}
              strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="fill-none transition-all duration-700 ease-out"
            />
          </svg>

          {/* Center value */}
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-4xl font-extrabold tracking-tight text-white">
              {percent}%
            </span>
            <span
              className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 mt-1 rounded-full text-white shadow-sm"
              style={{ backgroundColor: prediction.riskColor }}
            >
              {prediction.riskLevel} Risk
            </span>
            <span className="text-[10px] text-slate-400 mt-1">Disease Probability</span>
          </div>
        </div>

        {/* Binary Classification Result Banner */}
        <div className="mt-5 w-full">
          <div
            className={`p-3.5 rounded-xl border flex items-center justify-center gap-2.5 transition-all ${
              isDisease
                ? 'bg-rose-500/15 border-rose-500/40 text-rose-200'
                : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200'
            }`}
          >
            {isDisease ? (
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            )}
            <div className="text-left">
              <div className="text-sm font-bold">
                {isDisease
                  ? 'POSITIVE: Heart Disease Predicted'
                  : 'NEGATIVE: Low Heart Disease Risk'}
              </div>
              <div className="text-[11px] text-slate-300">
                {isDisease
                  ? 'Patient attributes align with ischemic cardiovascular disease criteria.'
                  : 'Clinical biomarkers indicate physiological stability within baseline margins.'}
              </div>
            </div>
          </div>
        </div>

        {/* Consensus Metric summary */}
        <div className="grid grid-cols-2 gap-3 w-full mt-4">
          <div className="bg-slate-900/50 p-2.5 rounded-xl border border-slate-700/40">
            <div className="text-[11px] text-slate-400">Multi-Model Consensus</div>
            <div className="text-sm font-bold text-white mt-0.5 flex items-center justify-center gap-1.5">
              <span className={prediction.consensusCount >= 4 ? 'text-rose-400' : 'text-emerald-400'}>
                {prediction.consensusCount} of 7
              </span>
              <span className="text-xs text-slate-400 font-normal">models predict positive</span>
            </div>
          </div>

          <div className="bg-slate-900/50 p-2.5 rounded-xl border border-slate-700/40">
            <div className="text-[11px] text-slate-400">Prediction Certainty</div>
            <div className="text-sm font-bold text-white mt-0.5">
              {prediction.confidenceScore}% Confidence
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Footer */}
      <div className="pt-4 border-t border-slate-700/70 flex items-center justify-between">
        <span className="text-xs text-slate-400 flex items-center gap-1">
          <TrendingUp className="w-3.5 h-3.5 text-rose-400" />
          Model: {selectedModel}
        </span>
        <button
          type="button"
          onClick={onOpenReport}
          className="text-xs font-semibold text-rose-400 hover:text-rose-300 flex items-center gap-1 hover:underline"
        >
          View Full Clinical Report →
        </button>
      </div>
    </div>
  );
};
