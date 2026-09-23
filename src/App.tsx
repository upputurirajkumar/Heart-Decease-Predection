import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { PatientForm } from './components/PatientForm';
import { PredictionCard } from './components/PredictionCard';
import { ConsensusMatrix } from './components/ConsensusMatrix';
import { RiskDriversAnalysis } from './components/RiskDriversAnalysis';
import { ClinicalRecommendations } from './components/ClinicalRecommendations';
import { ModelBenchmarksTab } from './components/ModelBenchmarksTab';
import { BatchScreeningModal } from './components/BatchScreeningModal';
import { PatientReportModal } from './components/PatientReportModal';
import { PatientFeatures, ModelAlgorithm } from './types/heartDisease';
import { PATIENT_PRESETS } from './data/patientPresets';
import { runInference } from './ml/inferenceEngine';
import { Heart, Activity, AlertCircle, Info, ShieldCheck } from 'lucide-react';

const DEFAULT_PATIENT_FEATURES: PatientFeatures = {
  age: 54,
  sex: 1, // Male
  resting_blood_pressure: 130,
  serum_cholesterol_mg_per_dl: 245,
  fasting_blood_sugar_gt_120_mg_per_dl: 0,
  resting_ekg_results: 0,
  max_heart_rate_achieved: 150,
  exercise_induced_angina: 0,
  oldpeak_eq_st_depression: 0.8,
  slope_of_peak_exercise_st_segment: 1,
  num_major_vessels: 0,
  thal: 'normal',
  chest_pain_type: 3, // Non-anginal
};

export function App() {
  const [activeTab, setActiveTab] = useState<'assessment' | 'benchmarks' | 'batch'>('assessment');
  const [selectedModel, setSelectedModel] = useState<ModelAlgorithm>('Random Forest');
  const [features, setFeatures] = useState<PatientFeatures>(DEFAULT_PATIENT_FEATURES);
  const [activePresetId, setActivePresetId] = useState<string | null>(null);
  const [isReportOpen, setIsReportOpen] = useState(false);

  // Real-time ML Inference
  const prediction = useMemo(() => {
    return runInference(features, selectedModel);
  }, [features, selectedModel]);

  const handleReset = () => {
    setFeatures(DEFAULT_PATIENT_FEATURES);
    setActivePresetId(null);
  };

  const handleLoadPreset = (presetId: string) => {
    const preset = PATIENT_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setFeatures(preset.features);
      setActivePresetId(presetId);
    }
  };

  const handleSelectFromBatch = (patientFeatures: PatientFeatures) => {
    setFeatures(patientFeatures);
    setActivePresetId(null);
    setActiveTab('assessment');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
        onOpenReport={() => setIsReportOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Tab 1: Diagnostic Assessment */}
        {activeTab === 'assessment' && (
          <div className="space-y-6">
            {/* Top Row: Clinical Input Form (Left) & Real-time Prediction Output (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Patient Form: 7 columns on large screens */}
              <div className="lg:col-span-7">
                <PatientForm
                  features={features}
                  onChange={(updated) => {
                    setFeatures(updated);
                    setActivePresetId(null);
                  }}
                  onReset={handleReset}
                  onLoadPreset={handleLoadPreset}
                  activePresetId={activePresetId}
                />
              </div>

              {/* Prediction & Diagnostics: 5 columns on large screens */}
              <div className="lg:col-span-5 space-y-6">
                <PredictionCard
                  prediction={prediction}
                  selectedModel={selectedModel}
                  onSelectModel={setSelectedModel}
                  onOpenReport={() => setIsReportOpen(true)}
                />

                <ClinicalRecommendations
                  recommendations={prediction.recommendations}
                  riskLevel={prediction.riskLevel}
                />
              </div>
            </div>

            {/* Bottom Row: Multi-Model Consensus & Key Risk Attribution */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7">
                <ConsensusMatrix
                  modelPredictions={prediction.modelPredictions}
                  selectedModel={selectedModel}
                  onSelectModel={setSelectedModel}
                />
              </div>

              <div className="lg:col-span-5">
                <RiskDriversAnalysis drivers={prediction.riskDrivers} />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Model Benchmarks & EDA */}
        {activeTab === 'benchmarks' && <ModelBenchmarksTab />}

        {/* Tab 3: Batch Screening */}
        {activeTab === 'batch' && (
          <BatchScreeningModal
            onSelectPatient={handleSelectFromBatch}
            selectedModel={selectedModel}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/60 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            <span className="font-semibold text-slate-300">CardioPredict ML Diagnostic Engine</span>
            <span>•</span>
            <span>Cleveland Heart Disease Patient Cohort Research (PRCP-1016)</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>Random Forest (91.7% Acc • 1.000 Recall)</span>
            <span>•</span>
            <span>Stratified 5-Fold Cross-Validation</span>
          </div>
        </div>
      </footer>

      {/* Printable Clinical Report Modal */}
      <PatientReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        features={features}
        prediction={prediction}
      />
    </div>
  );
}

export default App;
