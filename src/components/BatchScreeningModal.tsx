import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Plus,
  Play,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Download,
} from 'lucide-react';
import { PATIENT_PRESETS } from '../data/patientPresets';
import { runInference } from '../ml/inferenceEngine';
import { PatientFeatures, ModelAlgorithm } from '../types/heartDisease';

interface BatchScreeningModalProps {
  onSelectPatient: (p: PatientFeatures) => void;
  selectedModel: ModelAlgorithm;
}

export const BatchScreeningModal: React.FC<BatchScreeningModalProps> = ({
  onSelectPatient,
  selectedModel,
}) => {
  const [patientList, setPatientList] = useState(
    PATIENT_PRESETS.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      features: p.features,
      actual: p.actualLabel,
    }))
  );

  const [filter, setFilter] = useState<'all' | 'high' | 'low'>('all');

  // Evaluate all patients
  const evaluatedList = patientList.map((item) => {
    const res = runInference(item.features, selectedModel);
    return {
      ...item,
      prediction: res,
    };
  });

  const filtered = evaluatedList.filter((item) => {
    if (filter === 'high') return item.prediction.hasHeartDisease;
    if (filter === 'low') return !item.prediction.hasHeartDisease;
    return true;
  });

  const positiveCount = evaluatedList.filter((i) => i.prediction.hasHeartDisease).length;
  const avgRisk = Math.round(
    evaluatedList.reduce((acc, curr) => acc + curr.prediction.riskPercentage, 0) /
      (evaluatedList.length || 1)
  );

  const handleAddRandomPatient = () => {
    const randomAge = Math.floor(Math.random() * 40) + 35;
    const randomSex = Math.random() > 0.35 ? 1 : 0;
    const randomBP = Math.floor(Math.random() * 70) + 110;
    const randomChol = Math.floor(Math.random() * 180) + 180;
    const randomMaxHR = Math.floor(Math.random() * 80) + 110;
    const randomOldpeak = Number((Math.random() * 3.5).toFixed(1));
    const randomThal = Math.random() > 0.4 ? 'reversible_defect' : 'normal';
    const randomChestPain = Math.floor(Math.random() * 4) + 1;

    const newFeatures: PatientFeatures = {
      age: randomAge,
      sex: randomSex,
      resting_blood_pressure: randomBP,
      serum_cholesterol_mg_per_dl: randomChol,
      fasting_blood_sugar_gt_120_mg_per_dl: Math.random() > 0.8 ? 1 : 0,
      resting_ekg_results: Math.floor(Math.random() * 3),
      max_heart_rate_achieved: randomMaxHR,
      exercise_induced_angina: Math.random() > 0.6 ? 1 : 0,
      oldpeak_eq_st_depression: randomOldpeak,
      slope_of_peak_exercise_st_segment: Math.floor(Math.random() * 3) + 1,
      num_major_vessels: Math.floor(Math.random() * 3),
      thal: randomThal,
      chest_pain_type: randomChestPain,
    };

    const newEntry = {
      id: `synthetic-${Date.now()}`,
      name: `Synthetic Patient #${patientList.length + 1}`,
      description: `Auto-generated case for batch screening simulation`,
      features: newFeatures,
      actual: undefined,
    };

    setPatientList([newEntry, ...patientList]);
  };

  const handleExportCSV = () => {
    const headers = [
      'Patient Name',
      'Age',
      'Sex',
      'BP',
      'Cholesterol',
      'Max HR',
      'Oldpeak',
      'Thal',
      'Risk %',
      'Prediction',
      'Consensus',
    ];
    const rows = evaluatedList.map((p) => [
      `"${p.name}"`,
      p.features.age,
      p.features.sex === 1 ? 'Male' : 'Female',
      p.features.resting_blood_pressure,
      p.features.serum_cholesterol_mg_per_dl,
      p.features.max_heart_rate_achieved,
      p.features.oldpeak_eq_st_depression,
      typeof p.features.thal === 'string' ? p.features.thal : p.features.thal,
      `${p.prediction.riskPercentage}%`,
      p.prediction.hasHeartDisease ? 'Heart Disease' : 'Negative',
      `${p.prediction.consensusCount}/7`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'cardiopredict_batch_screening.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Top Banner & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-700/70 gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-rose-500" />
            Patient Cohort Screening & Triage Manager
          </h2>
          <p className="text-xs text-slate-400">
            Batch inference across multiple patient records using active classifier ({selectedModel})
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAddRandomPatient}
            className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-700 hover:bg-slate-600 text-white transition-all flex items-center gap-1.5 border border-slate-600"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Synthetic Case
          </button>
          <button
            type="button"
            onClick={handleExportCSV}
            className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-rose-600 hover:bg-rose-500 text-white transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Cohort Summary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-700/50">
          <span className="text-[11px] text-slate-400">Total Cohort Tested</span>
          <div className="text-2xl font-extrabold text-white mt-0.5">{evaluatedList.length}</div>
          <span className="text-[10px] text-slate-500">Patients evaluated simultaneously</span>
        </div>

        <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-700/50">
          <span className="text-[11px] text-slate-400">Predicted Positive Rate</span>
          <div className="text-2xl font-extrabold text-rose-400 mt-0.5">
            {Math.round((positiveCount / evaluatedList.length) * 100)}% ({positiveCount})
          </div>
          <span className="text-[10px] text-slate-500">
            {evaluatedList.length - positiveCount} categorized as Low Risk
          </span>
        </div>

        <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-700/50">
          <span className="text-[11px] text-slate-400">Mean Cohort Risk Score</span>
          <div className="text-2xl font-extrabold text-amber-400 mt-0.5">{avgRisk}%</div>
          <span className="text-[10px] text-slate-500">Average cardiovascular risk index</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`px-3 py-1 text-xs rounded-lg transition-all ${
            filter === 'all'
              ? 'bg-slate-700 text-white font-bold'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          All ({evaluatedList.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter('high')}
          className={`px-3 py-1 text-xs rounded-lg transition-all ${
            filter === 'high'
              ? 'bg-rose-600 text-white font-bold'
              : 'bg-slate-900 text-rose-300 hover:text-white'
          }`}
        >
          High Risk / Disease ({positiveCount})
        </button>
        <button
          type="button"
          onClick={() => setFilter('low')}
          className={`px-3 py-1 text-xs rounded-lg transition-all ${
            filter === 'low'
              ? 'bg-emerald-600 text-white font-bold'
              : 'bg-slate-900 text-emerald-300 hover:text-white'
          }`}
        >
          Low Risk ({evaluatedList.length - positiveCount})
        </button>
      </div>

      {/* Patients Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-700/60">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900 text-slate-300 font-semibold border-b border-slate-700">
            <tr>
              <th className="py-3 px-4">Patient Identifier</th>
              <th className="py-3 px-4">Age / Sex</th>
              <th className="py-3 px-4">Resting BP</th>
              <th className="py-3 px-4">Cholesterol</th>
              <th className="py-3 px-4">Max HR</th>
              <th className="py-3 px-4">Thal Scan</th>
              <th className="py-3 px-4">Risk %</th>
              <th className="py-3 px-4">Prediction</th>
              <th className="py-3 px-4">Consensus</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/40 bg-slate-900/40">
            {filtered.map((item) => {
              const res = item.prediction;
              const isDisease = res.hasHeartDisease;

              return (
                <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-white">{item.name}</div>
                    <div className="text-[10px] text-slate-400 line-clamp-1">{item.description}</div>
                  </td>
                  <td className="py-3 px-4">
                    {item.features.age}y / {item.features.sex === 1 ? 'M' : 'F'}
                  </td>
                  <td className="py-3 px-4">{item.features.resting_blood_pressure} mmHg</td>
                  <td className="py-3 px-4">{item.features.serum_cholesterol_mg_per_dl} mg/dL</td>
                  <td className="py-3 px-4">{item.features.max_heart_rate_achieved} bpm</td>
                  <td className="py-3 px-4">
                    <span className="capitalize">
                      {String(item.features.thal).replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className="font-mono font-bold px-2 py-0.5 rounded text-[11px]"
                      style={{ color: res.riskColor }}
                    >
                      {res.riskPercentage}%
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold text-[10px] inline-flex items-center gap-1 ${
                        isDisease
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {isDisease ? 'Positive' : 'Negative'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-300 font-mono text-[11px]">
                    {res.consensusCount} / 7
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => onSelectPatient(item.features)}
                      className="text-xs text-rose-400 hover:text-white font-semibold underline"
                    >
                      Load in Form
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
