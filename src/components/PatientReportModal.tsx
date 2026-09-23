import React from 'react';
import { X, Printer, Heart, ShieldAlert, CheckCircle2, FileText } from 'lucide-react';
import { PatientFeatures, PredictionResult } from '../types/heartDisease';

interface PatientReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  features: PatientFeatures;
  prediction: PredictionResult;
}

export const PatientReportModal: React.FC<PatientReportModalProps> = ({
  isOpen,
  onClose,
  features,
  prediction,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const isDisease = prediction.hasHeartDisease;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden my-8">
        {/* Modal Top Bar */}
        <div className="p-4 bg-slate-800/80 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-rose-500" />
            <span className="text-sm font-bold text-white">Cardiovascular Diagnostic Report</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-700 hover:bg-slate-600 text-white flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save PDF
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-750 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Report Document Content */}
        <div className="p-6 space-y-6 text-slate-200">
          {/* Header info */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-4 border-b border-slate-800 gap-2">
            <div>
              <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                CardioPredict Diagnostic Assessment
              </h1>
              <p className="text-xs text-slate-400">
                Machine Learning-Aided Cardiovascular Screening & Risk Stratification
              </p>
            </div>
            <div className="text-right text-xs text-slate-400">
              <div>Date: {new Date().toLocaleDateString()}</div>
              <div>Primary Classifier: <strong className="text-white">{prediction.primaryModel}</strong></div>
            </div>
          </div>

          {/* Diagnostic Outcome Banner */}
          <div
            className={`p-4 rounded-xl border flex items-center justify-between ${
              isDisease
                ? 'bg-rose-950/30 border-rose-800 text-rose-200'
                : 'bg-emerald-950/30 border-emerald-800 text-emerald-200'
            }`}
          >
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Classification Result
              </div>
              <div className="text-lg font-bold mt-0.5">
                {isDisease ? 'Positive: High Probability of Heart Disease' : 'Negative: Low Heart Disease Risk'}
              </div>
              <div className="text-xs text-slate-300 mt-1">
                Risk Probability: <strong>{prediction.riskPercentage}%</strong> ({prediction.riskLevel} Risk Category) • Certainty: {prediction.confidenceScore}%
              </div>
            </div>
            <div className="text-right hidden sm:block">
              <div className="text-xs text-slate-400">Multi-Model Consensus</div>
              <div className="text-lg font-bold text-white">
                {prediction.consensusCount} / 7 Models Agree
              </div>
            </div>
          </div>

          {/* Patient Biomarkers Grid */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Patient Clinical Measurements & Stress Biomarkers
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/60">
                <span className="text-slate-400 block text-[11px]">Age / Sex</span>
                <span className="font-semibold text-white">{features.age} yrs / {features.sex === 1 ? 'Male' : 'Female'}</span>
              </div>
              <div className="bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/60">
                <span className="text-slate-400 block text-[11px]">Resting BP</span>
                <span className="font-semibold text-white">{features.resting_blood_pressure} mm Hg</span>
              </div>
              <div className="bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/60">
                <span className="text-slate-400 block text-[11px]">Cholesterol</span>
                <span className="font-semibold text-white">{features.serum_cholesterol_mg_per_dl} mg/dL</span>
              </div>
              <div className="bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/60">
                <span className="text-slate-400 block text-[11px]">Fasting Sugar &gt; 120</span>
                <span className="font-semibold text-white">{features.fasting_blood_sugar_gt_120_mg_per_dl === 1 ? 'Yes' : 'No'}</span>
              </div>
              <div className="bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/60">
                <span className="text-slate-400 block text-[11px]">Max Heart Rate</span>
                <span className="font-semibold text-white">{features.max_heart_rate_achieved} bpm</span>
              </div>
              <div className="bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/60">
                <span className="text-slate-400 block text-[11px]">ST Depression</span>
                <span className="font-semibold text-white">{features.oldpeak_eq_st_depression.toFixed(1)} mm</span>
              </div>
              <div className="bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/60">
                <span className="text-slate-400 block text-[11px]">Major Vessels (Fluoro)</span>
                <span className="font-semibold text-white">{features.num_major_vessels} vessels</span>
              </div>
              <div className="bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/60">
                <span className="text-slate-400 block text-[11px]">Thallium Scan</span>
                <span className="font-semibold text-white capitalize">{String(features.thal).replace('_', ' ')}</span>
              </div>
            </div>
          </div>

          {/* Primary Risk Drivers */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Primary Risk Attribution
            </h3>
            <div className="space-y-1.5 text-xs">
              {prediction.riskDrivers.slice(0, 4).map((d) => (
                <div key={d.featureName} className="p-2 rounded bg-slate-800/40 border border-slate-700/40 flex justify-between items-center">
                  <div>
                    <span className="font-semibold text-white">{d.label}: </span>
                    <span className="text-slate-300">{d.patientValue} (Ref: {d.normalRange})</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                    d.impact === 'high_risk'
                      ? 'bg-rose-500/20 text-rose-300'
                      : d.impact === 'moderate_risk'
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'bg-emerald-500/20 text-emerald-300'
                  }`}>
                    {d.impact.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Protocol */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Clinical Care Plan & Physician Guidance
            </h3>
            <div className="space-y-1 text-xs text-slate-300">
              {prediction.recommendations.map((rec, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">•</span>
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-800/80 border-t border-slate-700 text-right">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors"
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
};
