import React from 'react';
import { ClipboardList, Stethoscope, HeartHandshake, AlertOctagon } from 'lucide-react';

interface ClinicalRecommendationsProps {
  recommendations: string[];
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
}

export const ClinicalRecommendations: React.FC<ClinicalRecommendationsProps> = ({
  recommendations,
  riskLevel,
}) => {
  return (
    <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-xl">
      <div className="pb-4 mb-4 border-b border-slate-700/70">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <Stethoscope className="w-4 h-4 text-emerald-400" />
          Clinical Action Protocol & Recommendations
        </h2>
        <p className="text-xs text-slate-400">
          Evidence-based management pathways tailored to patient risk category
        </p>
      </div>

      <div className="space-y-2.5">
        {recommendations.map((rec, i) => (
          <div
            key={i}
            className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/50 border border-slate-700/50 text-xs text-slate-200"
          >
            <span className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 text-rose-400 font-bold flex items-center justify-center shrink-0 text-[11px]">
              {i + 1}
            </span>
            <span className="leading-relaxed">{rec}</span>
          </div>
        ))}
      </div>

      {/* Ethical & Regulatory Clinical Decision Support Notice */}
      <div className="mt-4 p-3 rounded-xl bg-slate-900/80 border border-slate-700/60 flex items-start gap-2.5 text-[11px] text-slate-400">
        <AlertOctagon className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-slate-300">Decision-Support Notice:</strong> This machine learning
          model serves as a clinical screening aid and does not constitute a definitive medical diagnosis.
          All final therapeutic interventions, diagnostic catheterizations, and pharmacotherapy adjustments
          must be verified by a board-certified physician or cardiologist.
        </div>
      </div>
    </div>
  );
};
