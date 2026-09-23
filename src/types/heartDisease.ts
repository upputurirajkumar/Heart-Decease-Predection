export type ThalCategory = 'fixed_defect' | 'normal' | 'reversible_defect';

export interface PatientFeatures {
  age: number; // 29 - 77
  sex: number; // 0 = Female, 1 = Male
  chest_pain_type: number; // 1 = Typical Angina, 2 = Atypical Angina, 3 = Non-anginal, 4 = Asymptomatic
  resting_blood_pressure: number; // 94 - 200 mmHg
  serum_cholesterol_mg_per_dl: number; // 126 - 564 mg/dL
  fasting_blood_sugar_gt_120_mg_per_dl: number; // 0 = No (<= 120), 1 = Yes (> 120)
  resting_ekg_results: number; // 0 = Normal, 1 = ST-T Abnormality, 2 = Left Ventricular Hypertrophy
  max_heart_rate_achieved: number; // 71 - 202 bpm
  exercise_induced_angina: number; // 0 = No, 1 = Yes
  oldpeak_eq_st_depression: number; // 0.0 - 6.2 mm
  slope_of_peak_exercise_st_segment: number; // 1 = Upsloping, 2 = Flat, 3 = Downsloping
  num_major_vessels: number; // 0 - 3
  thal: ThalCategory | number; // 0 = fixed_defect, 1 = normal, 2 = reversible_defect
}

export type ModelAlgorithm =
  | 'Random Forest'
  | 'Extra Trees'
  | 'Gradient Boosting'
  | 'K-Nearest Neighbors'
  | 'Logistic Regression'
  | 'Support Vector Machine'
  | 'Decision Tree';

export interface SingleModelPrediction {
  modelName: ModelAlgorithm;
  isHeartDisease: boolean;
  probability: number; // 0 to 1
  confidence: number; // percentage 0 - 100
  accuracyScore: number;
}

export interface RiskFactorDriver {
  featureName: string;
  label: string;
  patientValue: string | number;
  normalRange: string;
  impact: 'protective' | 'moderate_risk' | 'high_risk';
  weight: number; // contribution to score
  description: string;
}

export interface PredictionResult {
  hasHeartDisease: boolean;
  riskProbability: number; // 0 to 1
  riskPercentage: number; // 0 to 100
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
  riskColor: string;
  confidenceScore: number;
  primaryModel: ModelAlgorithm;
  consensusCount: number; // out of 7 models
  modelPredictions: SingleModelPrediction[];
  riskDrivers: RiskFactorDriver[];
  recommendations: string[];
}

export interface ModelBenchmarkData {
  model: ModelAlgorithm;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  rocAuc: number;
  cvAccuracy: number;
  isBest?: boolean;
}

export interface PresetPatient {
  id: string;
  name: string;
  source: 'Notebook Sample' | 'Clinical Archetype';
  description: string;
  actualLabel?: number; // 0 or 1
  features: PatientFeatures;
}
