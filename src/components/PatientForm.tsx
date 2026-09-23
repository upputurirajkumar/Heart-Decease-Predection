import React from 'react';
import {
  User,
  Heart,
  Activity,
  Flame,
  Gauge,
  RotateCcw,
  Sparkles,
  Info,
  Layers,
} from 'lucide-react';
import { PatientFeatures, ThalCategory } from '../types/heartDisease';
import { PATIENT_PRESETS } from '../data/patientPresets';

interface PatientFormProps {
  features: PatientFeatures;
  onChange: (updated: PatientFeatures) => void;
  onReset: () => void;
  onLoadPreset: (presetId: string) => void;
  activePresetId: string | null;
}

export const PatientForm: React.FC<PatientFormProps> = ({
  features,
  onChange,
  onReset,
  onLoadPreset,
  activePresetId,
}) => {
  const updateField = <K extends keyof PatientFeatures>(key: K, value: PatientFeatures[K]) => {
    onChange({
      ...features,
      [key]: value,
    });
  };

  return (
    <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-xl">
      {/* Header & Preset Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-slate-700/70 gap-3">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            Patient Clinical Profile & Test Results
          </h2>
          <p className="text-xs text-slate-400">
            Configure the 13 clinical biomarkers for machine learning risk classification
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onReset}
            className="px-2.5 py-1.5 text-xs text-slate-400 hover:text-white bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1"
            title="Reset to default baseline"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        </div>
      </div>

      {/* Preset selector bar */}
      <div className="mb-6 p-3 bg-slate-900/60 rounded-xl border border-slate-700/50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Load Benchmark Notebook Records & Clinical Cases
          </span>
          <span className="text-[11px] text-slate-500">
            {PATIENT_PRESETS.length} presets available
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {PATIENT_PRESETS.map((p) => {
            const isSelected = activePresetId === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => onLoadPreset(p.id)}
                className={`px-2.5 py-1 text-xs rounded-lg transition-all text-left flex items-center gap-1.5 border ${
                  isSelected
                    ? 'bg-rose-500/20 border-rose-500 text-rose-300 font-semibold'
                    : 'bg-slate-800/70 hover:bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    p.actualLabel === 1 ? 'bg-rose-400' : 'bg-emerald-400'
                  }`}
                />
                {p.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-6">
        {/* Section 1: Demographics & Routine Vitals */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <User className="w-4 h-4 text-sky-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-sky-300">
              1. Demographics & Hemodynamics
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
            {/* Age */}
            <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-700/40">
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-medium text-slate-300">Age</label>
                <span className="text-xs font-bold text-white bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                  {features.age} yrs
                </span>
              </div>
              <input
                type="range"
                min={25}
                max={80}
                value={features.age}
                onChange={(e) => updateField('age', Number(e.target.value))}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Dataset range: 29–77</span>
            </div>

            {/* Sex */}
            <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-700/40">
              <label className="text-xs font-medium text-slate-300 block mb-1.5">
                Biological Sex
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => updateField('sex', 1)}
                  className={`py-1.5 text-xs font-medium rounded-lg border transition-all ${
                    features.sex === 1
                      ? 'bg-sky-600/30 border-sky-500 text-sky-200'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Male (1)
                </button>
                <button
                  type="button"
                  onClick={() => updateField('sex', 0)}
                  className={`py-1.5 text-xs font-medium rounded-lg border transition-all ${
                    features.sex === 0
                      ? 'bg-pink-600/30 border-pink-500 text-pink-200'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Female (0)
                </button>
              </div>
            </div>

            {/* Resting Blood Pressure */}
            <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-700/40">
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-medium text-slate-300">Resting BP</label>
                <span className="text-xs font-bold text-white bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                  {features.resting_blood_pressure} mmHg
                </span>
              </div>
              <input
                type="range"
                min={90}
                max={200}
                value={features.resting_blood_pressure}
                onChange={(e) => updateField('resting_blood_pressure', Number(e.target.value))}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                {features.resting_blood_pressure < 120
                  ? 'Normal (<120)'
                  : features.resting_blood_pressure < 130
                  ? 'Elevated (120-129)'
                  : features.resting_blood_pressure < 140
                  ? 'Stage 1 HTN (130-139)'
                  : 'Stage 2 HTN (≥140)'}
              </span>
            </div>

            {/* Serum Cholesterol */}
            <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-700/40">
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-medium text-slate-300">Cholesterol</label>
                <span className="text-xs font-bold text-white bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                  {features.serum_cholesterol_mg_per_dl} mg/dL
                </span>
              </div>
              <input
                type="range"
                min={120}
                max={500}
                value={features.serum_cholesterol_mg_per_dl}
                onChange={(e) => updateField('serum_cholesterol_mg_per_dl', Number(e.target.value))}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                {features.serum_cholesterol_mg_per_dl < 200
                  ? 'Desirable (<200)'
                  : features.serum_cholesterol_mg_per_dl < 240
                  ? 'Borderline (200-239)'
                  : 'High (≥240)'}
              </span>
            </div>
          </div>
        </div>

        {/* Section 2: Laboratory & Resting Diagnostic Findings */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Gauge className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-300">
              2. Fasting Glycemia & Resting Electrocardiogram
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Fasting Blood Sugar */}
            <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-700/40">
              <label className="text-xs font-medium text-slate-300 block mb-1">
                Fasting Blood Sugar &gt; 120 mg/dL
              </label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => updateField('fasting_blood_sugar_gt_120_mg_per_dl', 0)}
                  className={`py-2 text-xs font-medium rounded-lg border transition-all ${
                    features.fasting_blood_sugar_gt_120_mg_per_dl === 0
                      ? 'bg-emerald-600/30 border-emerald-500 text-emerald-200'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  ≤ 120 mg/dL (Normal)
                </button>
                <button
                  type="button"
                  onClick={() => updateField('fasting_blood_sugar_gt_120_mg_per_dl', 1)}
                  className={`py-2 text-xs font-medium rounded-lg border transition-all ${
                    features.fasting_blood_sugar_gt_120_mg_per_dl === 1
                      ? 'bg-amber-600/30 border-amber-500 text-amber-200'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  &gt; 120 mg/dL (Diabetic / Impaired)
                </button>
              </div>
            </div>

            {/* Resting EKG Results */}
            <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-700/40">
              <label className="text-xs font-medium text-slate-300 block mb-1">
                Resting EKG Interpretation
              </label>
              <div className="grid grid-cols-3 gap-1.5 mt-2">
                <button
                  type="button"
                  onClick={() => updateField('resting_ekg_results', 0)}
                  className={`py-2 px-1 text-[11px] font-medium rounded-lg border transition-all text-center ${
                    features.resting_ekg_results === 0
                      ? 'bg-emerald-600/30 border-emerald-500 text-emerald-200'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  0: Normal
                </button>
                <button
                  type="button"
                  onClick={() => updateField('resting_ekg_results', 1)}
                  className={`py-2 px-1 text-[11px] font-medium rounded-lg border transition-all text-center ${
                    features.resting_ekg_results === 1
                      ? 'bg-amber-600/30 border-amber-500 text-amber-200'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  1: ST-T Wave Abn.
                </button>
                <button
                  type="button"
                  onClick={() => updateField('resting_ekg_results', 2)}
                  className={`py-2 px-1 text-[11px] font-medium rounded-lg border transition-all text-center ${
                    features.resting_ekg_results === 2
                      ? 'bg-rose-600/30 border-rose-500 text-rose-200'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  2: LV Hypertrophy
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Exercise Stress Test Response */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Flame className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300">
              3. Exercise Stress Electrocardiography
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            {/* Chest Pain Type */}
            <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-700/40 sm:col-span-2 md:col-span-3">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                  Chest Pain Classification (chest_pain_type)
                  <span className="text-[10px] text-rose-400 bg-rose-500/10 px-1.5 py-0.2 rounded border border-rose-500/20">
                    12% Model Weight
                  </span>
                </label>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 1, label: 'Type 1: Typical Angina', desc: 'Substernal pressure with exertion' },
                  { id: 2, label: 'Type 2: Atypical Angina', desc: 'Atypical chest discomfort' },
                  { id: 3, label: 'Type 3: Non-Anginal', desc: 'Sharp / musculoskeletal pain' },
                  { id: 4, label: 'Type 4: Asymptomatic', desc: 'Silent ischemia / no overt angina' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => updateField('chest_pain_type', item.id)}
                    className={`p-2 rounded-xl text-left border transition-all ${
                      features.chest_pain_type === item.id
                        ? 'bg-amber-600/30 border-amber-500 text-amber-200 shadow-sm'
                        : 'bg-slate-800 border-slate-700/70 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="text-xs font-semibold">{item.label}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Max Heart Rate Achieved */}
            <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-700/40">
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-medium text-slate-300">Max Heart Rate</label>
                <span className="text-xs font-bold text-white bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                  {features.max_heart_rate_achieved} bpm
                </span>
              </div>
              <input
                type="range"
                min={70}
                max={210}
                value={features.max_heart_rate_achieved}
                onChange={(e) => updateField('max_heart_rate_achieved', Number(e.target.value))}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Target reserve: ~{220 - features.age} bpm max
              </span>
            </div>

            {/* Exercise-Induced Angina */}
            <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-700/40">
              <label className="text-xs font-medium text-slate-300 block mb-1">
                Exercise-Induced Angina
              </label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => updateField('exercise_induced_angina', 0)}
                  className={`py-2 text-xs font-medium rounded-lg border transition-all ${
                    features.exercise_induced_angina === 0
                      ? 'bg-emerald-600/30 border-emerald-500 text-emerald-200'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  No (0)
                </button>
                <button
                  type="button"
                  onClick={() => updateField('exercise_induced_angina', 1)}
                  className={`py-2 text-xs font-medium rounded-lg border transition-all ${
                    features.exercise_induced_angina === 1
                      ? 'bg-rose-600/30 border-rose-500 text-rose-200'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Yes (1)
                </button>
              </div>
            </div>

            {/* ST Depression Oldpeak */}
            <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-700/40">
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-medium text-slate-300">ST Depression (Oldpeak)</label>
                <span className="text-xs font-bold text-white bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                  {features.oldpeak_eq_st_depression.toFixed(1)} mm
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={62}
                step={1}
                value={Math.round(features.oldpeak_eq_st_depression * 10)}
                onChange={(e) => updateField('oldpeak_eq_st_depression', Number(e.target.value) / 10)}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                {features.oldpeak_eq_st_depression < 1.0
                  ? 'Normal (<1.0mm)'
                  : features.oldpeak_eq_st_depression < 2.0
                  ? 'Moderate Ischemia (1-2mm)'
                  : 'Severe Ischemia (≥2mm)'}
              </span>
            </div>

            {/* Slope of ST Segment */}
            <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-700/40 sm:col-span-2 md:col-span-3">
              <label className="text-xs font-medium text-slate-300 block mb-1.5">
                Slope of Peak Exercise ST Segment (slope_of_peak_exercise_st_segment)
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => updateField('slope_of_peak_exercise_st_segment', 1)}
                  className={`py-2 px-2 text-xs font-medium rounded-lg border transition-all text-center ${
                    features.slope_of_peak_exercise_st_segment === 1
                      ? 'bg-emerald-600/30 border-emerald-500 text-emerald-200'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="font-semibold">1: Upsloping</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Usually benign/physiological</div>
                </button>
                <button
                  type="button"
                  onClick={() => updateField('slope_of_peak_exercise_st_segment', 2)}
                  className={`py-2 px-2 text-xs font-medium rounded-lg border transition-all text-center ${
                    features.slope_of_peak_exercise_st_segment === 2
                      ? 'bg-amber-600/30 border-amber-500 text-amber-200'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="font-semibold">2: Flat</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">High suspicion for ischemia</div>
                </button>
                <button
                  type="button"
                  onClick={() => updateField('slope_of_peak_exercise_st_segment', 3)}
                  className={`py-2 px-2 text-xs font-medium rounded-lg border transition-all text-center ${
                    features.slope_of_peak_exercise_st_segment === 3
                      ? 'bg-rose-600/30 border-rose-500 text-rose-200'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="font-semibold">3: Downsloping</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Strong indicator of CAD</div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Advanced Cardiac Diagnostics */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Layers className="w-4 h-4 text-purple-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-purple-300">
              4. Advanced Diagnostics (Fluoroscopy & Nuclear Scan)
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Number of Major Vessels */}
            <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-700/40">
              <label className="text-xs font-medium text-slate-300 block mb-1">
                Fluoroscopy Colored Major Vessels (0 - 3)
              </label>
              <p className="text-[11px] text-slate-400 mb-2">
                Number of major coronary vessels colored by fluoroscopy dye
              </p>
              <div className="grid grid-cols-4 gap-1.5">
                {[0, 1, 2, 3].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => updateField('num_major_vessels', val)}
                    className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                      features.num_major_vessels === val
                        ? 'bg-purple-600/30 border-purple-500 text-purple-200'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {val} {val === 0 ? '(Clear)' : val === 1 ? '(Single)' : `(${val} vsl)`}
                  </button>
                ))}
              </div>
            </div>

            {/* Thallium Stress Test */}
            <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-700/40">
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-slate-300">
                  Thallium Scintigraphy (thal)
                </label>
                <span className="text-[10px] text-rose-400 bg-rose-500/10 px-1.5 py-0.2 rounded border border-rose-500/20">
                  #1 Key Feature (13%)
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mb-2">
                Myocardial radioactive tracer perfusion distribution
              </p>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => updateField('thal', 'normal')}
                  className={`py-2 px-1 text-[11px] font-medium rounded-lg border transition-all text-center ${
                    features.thal === 'normal' || features.thal === 1
                      ? 'bg-emerald-600/30 border-emerald-500 text-emerald-200'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="font-semibold">Normal</div>
                  <div className="text-[9px] text-slate-400 mt-0.5">Uniform flow</div>
                </button>

                <button
                  type="button"
                  onClick={() => updateField('thal', 'reversible_defect')}
                  className={`py-2 px-1 text-[11px] font-medium rounded-lg border transition-all text-center ${
                    features.thal === 'reversible_defect' || features.thal === 2
                      ? 'bg-rose-600/30 border-rose-500 text-rose-200'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="font-semibold">Reversible Defect</div>
                  <div className="text-[9px] text-slate-400 mt-0.5">Active ischemia</div>
                </button>

                <button
                  type="button"
                  onClick={() => updateField('thal', 'fixed_defect')}
                  className={`py-2 px-1 text-[11px] font-medium rounded-lg border transition-all text-center ${
                    features.thal === 'fixed_defect' || features.thal === 0
                      ? 'bg-amber-600/30 border-amber-500 text-amber-200'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="font-semibold">Fixed Defect</div>
                  <div className="text-[9px] text-slate-400 mt-0.5">Old infarct scar</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
