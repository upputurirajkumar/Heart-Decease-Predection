import React, { useState } from 'react';
import {
  Award,
  BarChart3,
  TrendingUp,
  Database,
  CheckCircle2,
  FileText,
  PieChart,
  Layers,
  ArrowRight,
} from 'lucide-react';
import {
  BENCHMARK_MODELS,
  FEATURE_IMPORTANCES,
  CONFUSION_MATRIX,
  ROC_CURVE_POINTS,
  FEATURE_STATS,
} from '../ml/modelData';

export const ModelBenchmarksTab: React.FC = () => {
  const [activeBenchmarkView, setActiveBenchmarkView] = useState<'comparison' | 'importance' | 'metrics' | 'eda'>('comparison');

  return (
    <div className="space-y-6">
      {/* Tab Navigation header */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              Machine Learning Model Evaluation & Exploratory Data Analysis
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Empirical results from training 7 classification algorithms on 180 Cleveland patient records
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-slate-700">
            <button
              type="button"
              onClick={() => setActiveBenchmarkView('comparison')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeBenchmarkView === 'comparison'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Model Benchmarks
            </button>
            <button
              type="button"
              onClick={() => setActiveBenchmarkView('importance')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeBenchmarkView === 'importance'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Feature Importance
            </button>
            <button
              type="button"
              onClick={() => setActiveBenchmarkView('metrics')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeBenchmarkView === 'metrics'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ROC & Confusion Matrix
            </button>
            <button
              type="button"
              onClick={() => setActiveBenchmarkView('eda')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeBenchmarkView === 'eda'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Dataset EDA Stats
            </button>
          </div>
        </div>
      </div>

      {/* View 1: Model Benchmarks Table */}
      {activeBenchmarkView === 'comparison' && (
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-700/70">
            <div>
              <h3 className="text-base font-bold text-white">Algorithm Performance Comparison</h3>
              <p className="text-xs text-slate-400">
                Evaluation metrics on 20% holdout test dataset (stratified 36 patients)
              </p>
            </div>
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-3 py-1 rounded-lg">
              Random Forest Selected as Best Model
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/70 text-slate-300 font-semibold border-b border-slate-700">
                <tr>
                  <th className="py-3 px-4">Rank & Model</th>
                  <th className="py-3 px-4">Accuracy</th>
                  <th className="py-3 px-4">Precision</th>
                  <th className="py-3 px-4">Recall (Sensitivity)</th>
                  <th className="py-3 px-4">F1 Score</th>
                  <th className="py-3 px-4">ROC AUC</th>
                  <th className="py-3 px-4">5-Fold CV Accuracy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {BENCHMARK_MODELS.map((m, idx) => (
                  <tr
                    key={m.model}
                    className={`transition-colors ${
                      m.isBest
                        ? 'bg-rose-500/10 hover:bg-rose-500/15 font-semibold text-white'
                        : 'hover:bg-slate-750/30 text-slate-300'
                    }`}
                  >
                    <td className="py-3 px-4 flex items-center gap-2">
                      <span className="text-xs text-slate-500 w-4 font-mono">#{idx + 1}</span>
                      <span className="font-bold text-white">{m.model}</span>
                      {m.isBest && (
                        <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">
                          Champion (91.7%)
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-900 font-mono text-emerald-400 font-bold">
                        {(m.accuracy * 100).toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono">{(m.precision * 100).toFixed(1)}%</td>
                    <td className="py-3 px-4">
                      <span
                        className={`font-mono px-2 py-0.5 rounded ${
                          m.recall >= 0.99
                            ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-800 font-bold'
                            : 'text-slate-300'
                        }`}
                      >
                        {(m.recall * 100).toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono">{m.f1Score.toFixed(3)}</td>
                    <td className="py-3 px-4 font-mono text-sky-400 font-bold">{m.rocAuc.toFixed(3)}</td>
                    <td className="py-3 px-4 font-mono text-slate-400">
                      {(m.cvAccuracy * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-700/60">
            <div className="bg-slate-900/50 p-3.5 rounded-xl border border-slate-700/40">
              <div className="text-xs text-slate-400">Zero Missed Patients (100% Recall)</div>
              <div className="text-sm font-bold text-white mt-1">
                Random Forest & Extra Trees achieved 100% Sensitivity, ensuring zero high-risk cardiac cases were misclassified as healthy.
              </div>
            </div>
            <div className="bg-slate-900/50 p-3.5 rounded-xl border border-slate-700/40">
              <div className="text-xs text-slate-400">High Discriminative Ability (ROC-AUC 0.956)</div>
              <div className="text-sm font-bold text-white mt-1">
                Area under the ROC curve exceeds 0.95, indicating near-perfect separation between ischemic disease and non-ischemic patients.
              </div>
            </div>
            <div className="bg-slate-900/50 p-3.5 rounded-xl border border-slate-700/40">
              <div className="text-xs text-slate-400">Robust 5-Fold Stratified Validation</div>
              <div className="text-sm font-bold text-white mt-1">
                Mean cross-validation accuracy of 82.7% confirms model stability across varying training partitions without overfitting.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View 2: Feature Importance */}
      {activeBenchmarkView === 'importance' && (
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="pb-3 border-b border-slate-700/70">
            <h3 className="text-base font-bold text-white">Random Forest Feature Importance Hierarchy</h3>
            <p className="text-xs text-slate-400">
              Extracted from Gini impurity reduction across all 100 decision trees in the ensemble
            </p>
          </div>

          <div className="space-y-3.5">
            {FEATURE_IMPORTANCES.map((item, idx) => {
              const pct = (item.importance * 100).toFixed(0);
              return (
                <div key={item.feature} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-white flex items-center gap-2">
                      <span className="text-slate-500 font-mono text-[11px] w-5">#{idx + 1}</span>
                      {item.name}
                      <code className="text-[10px] text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700/60 font-mono">
                        {item.feature}
                      </code>
                    </span>
                    <span className="font-bold text-slate-200 font-mono">
                      {pct}% <span className="text-slate-500 font-normal">({item.importance.toFixed(2)})</span>
                    </span>
                  </div>

                  <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-700/50">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${item.importance * 100 * 3.5}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-700/60 text-xs text-slate-300 leading-relaxed">
            <strong className="text-white">Clinical Interpretation:</strong> The top 4 features (Thallium Scintigraphy defect, Chest Pain classification, Maximum Heart Rate capacity, and Exercise ST Depression) account for nearly <strong>45% of total predictive power</strong>. This confirms established cardiology practice where functional exercise tolerance and reversible ischemia are the primary clinical determinants for coronary artery disease.
          </div>
        </div>
      )}

      {/* View 3: ROC Curve and Confusion Matrix */}
      {activeBenchmarkView === 'metrics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Confusion Matrix */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 shadow-xl space-y-4">
            <div>
              <h3 className="text-base font-bold text-white">Confusion Matrix (Test Set: N=36)</h3>
              <p className="text-xs text-slate-400">Random Forest Classifier performance breakdown</p>
            </div>

            <div className="grid grid-cols-2 gap-3 p-4 bg-slate-900/60 rounded-xl border border-slate-700/60">
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-700/40 text-center">
                <div className="text-[11px] font-semibold text-emerald-300 uppercase">True Negatives (TN)</div>
                <div className="text-3xl font-extrabold text-white mt-1">{CONFUSION_MATRIX.trueNegative}</div>
                <div className="text-[10px] text-emerald-400 mt-1">Healthy Correctly Identified (85% Specificity)</div>
              </div>

              <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-700/40 text-center">
                <div className="text-[11px] font-semibold text-amber-300 uppercase">False Positives (FP)</div>
                <div className="text-3xl font-extrabold text-white mt-1">{CONFUSION_MATRIX.falsePositive}</div>
                <div className="text-[10px] text-amber-400 mt-1">Healthy Predicted as Disease (Type I Error)</div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-700/40 text-center">
                <div className="text-[11px] font-semibold text-emerald-300 uppercase">False Negatives (FN)</div>
                <div className="text-3xl font-extrabold text-white mt-1 text-emerald-400">
                  {CONFUSION_MATRIX.falseNegative}
                </div>
                <div className="text-[10px] text-emerald-400 mt-1">
                  ⭐ ZERO MISSES! (100% Sensitivity/Recall)
                </div>
              </div>

              <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-700/40 text-center">
                <div className="text-[11px] font-semibold text-rose-300 uppercase">True Positives (TP)</div>
                <div className="text-3xl font-extrabold text-white mt-1">{CONFUSION_MATRIX.truePositive}</div>
                <div className="text-[10px] text-rose-400 mt-1">Disease Patients Correctly Caught (16/16)</div>
              </div>
            </div>

            <div className="text-xs text-slate-300 leading-relaxed bg-slate-900/40 p-3 rounded-xl border border-slate-700/40">
              In medical diagnosis, <strong>False Negatives are fatal</strong>. The Random Forest model achieved <strong>zero false negatives (Recall = 1.000)</strong>, ensuring no at-risk cardiac patient was mistakenly cleared.
            </div>
          </div>

          {/* ROC Curve Graph */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 shadow-xl space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white">Receiver Operating Characteristic (ROC)</h3>
                <span className="text-xs font-bold text-sky-400 bg-sky-950/60 border border-sky-800/50 px-2 py-0.5 rounded">
                  AUC = 0.956
                </span>
              </div>
              <p className="text-xs text-slate-400">Sensitivity (True Positive Rate) vs 1 - Specificity</p>
            </div>

            {/* SVG Plot for ROC */}
            <div className="relative w-full h-56 bg-slate-900/80 rounded-xl border border-slate-700/60 p-4 flex flex-col justify-end">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 200 150">
                {/* Grid lines */}
                <line x1="20" y1="10" x2="20" y2="130" stroke="#334155" strokeWidth="1" />
                <line x1="20" y1="130" x2="190" y2="130" stroke="#334155" strokeWidth="1" />
                <line x1="20" y1="70" x2="190" y2="70" stroke="#1e293b" strokeDasharray="3,3" strokeWidth="1" />
                <line x1="105" y1="10" x2="105" y2="130" stroke="#1e293b" strokeDasharray="3,3" strokeWidth="1" />

                {/* Random guess diagonal */}
                <line x1="20" y1="130" x2="190" y2="10" stroke="#475569" strokeDasharray="4,4" strokeWidth="1.5" />

                {/* ROC Curve Line */}
                <polyline
                  fill="rgba(56, 189, 248, 0.15)"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                  points={ROC_CURVE_POINTS.map((pt) => {
                    const x = 20 + pt.fpr * 170;
                    const y = 130 - pt.tpr * 120;
                    return `${x},${y}`;
                  }).join(' ')}
                />
              </svg>

              <div className="flex justify-between text-[10px] text-slate-400 mt-2 px-4">
                <span>0.0 (Low FPR)</span>
                <span>False Positive Rate (1 - Specificity)</span>
                <span>1.0 (High FPR)</span>
              </div>
            </div>

            <div className="text-xs text-slate-300">
              The steep initial ascent to 1.0 TPR at only 0.10 FPR indicates that this model correctly identifies virtually all positive cases with minimal false alarms.
            </div>
          </div>
        </div>
      )}

      {/* View 4: Dataset Exploratory Data Analysis */}
      {activeBenchmarkView === 'eda' && (
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="pb-3 border-b border-slate-700/70">
            <h3 className="text-base font-bold text-white">Cohort Demographics & Statistical Distributions</h3>
            <p className="text-xs text-slate-400">
              Descriptive statistics of the 180 patients analyzed from Cleveland clinical database
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-700/50">
              <span className="text-[11px] text-slate-400">Total Patient Cohort</span>
              <div className="text-2xl font-extrabold text-white mt-0.5">180 Patients</div>
              <span className="text-[10px] text-slate-400">Merged values & labels</span>
            </div>

            <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-700/50">
              <span className="text-[11px] text-slate-400">Disease Prevalence</span>
              <div className="text-2xl font-extrabold text-rose-400 mt-0.5">44.4% (80)</div>
              <span className="text-[10px] text-emerald-400">55.6% Negative (100)</span>
            </div>

            <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-700/50">
              <span className="text-[11px] text-slate-400">Age Distribution</span>
              <div className="text-2xl font-extrabold text-white mt-0.5">54.8 ± 9.3 yrs</div>
              <span className="text-[10px] text-slate-400">Range: 29 – 77 years</span>
            </div>

            <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-700/50">
              <span className="text-[11px] text-slate-400">Gender Ratio</span>
              <div className="text-2xl font-extrabold text-white mt-0.5">69% Male</div>
              <span className="text-[10px] text-slate-400">31% Female (56 patients)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50 space-y-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Key Hemodynamic Averages
              </h4>
              <ul className="text-xs space-y-1.5 text-slate-300">
                <li className="flex justify-between">
                  <span className="text-slate-400">Mean Resting Blood Pressure:</span>
                  <span className="font-bold text-white">131.3 mmHg (94 – 180)</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-slate-400">Mean Serum Cholesterol:</span>
                  <span className="font-bold text-white">249.2 mg/dL (126 – 564)</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-slate-400">Mean Max Exercise Heart Rate:</span>
                  <span className="font-bold text-white">149.5 bpm (96 – 202)</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-slate-400">Mean ST Depression (Oldpeak):</span>
                  <span className="font-bold text-white">1.01 mm (0.0 – 6.2)</span>
                </li>
              </ul>
            </div>

            <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50 space-y-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Categorical Findings in Cohort
              </h4>
              <ul className="text-xs space-y-1.5 text-slate-300">
                <li className="flex justify-between">
                  <span className="text-slate-400">Thallium Reversible Defect:</span>
                  <span className="font-bold text-rose-400">74 patients (41.1%)</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-slate-400">Exercise-Induced Angina:</span>
                  <span className="font-bold text-amber-400">58 patients (32.2%)</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-slate-400">Fasting Blood Sugar &gt; 120 mg/dL:</span>
                  <span className="font-bold text-slate-200">29 patients (16.1%)</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-slate-400">Major Vessels Occluded (≥1):</span>
                  <span className="font-bold text-purple-400">62 patients (34.4%)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
