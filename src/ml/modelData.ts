import { ModelBenchmarkData } from '../types/heartDisease';

// Benchmarks directly from Notebook cells 82, 90, 103
export const BENCHMARK_MODELS: ModelBenchmarkData[] = [
  {
    model: 'Random Forest',
    accuracy: 0.917,
    precision: 0.842,
    recall: 1.000,
    f1Score: 0.914,
    rocAuc: 0.956,
    cvAccuracy: 0.827,
    isBest: true,
  },
  {
    model: 'Extra Trees',
    accuracy: 0.889,
    precision: 0.800,
    recall: 1.000,
    f1Score: 0.889,
    rocAuc: 0.950,
    cvAccuracy: 0.792,
  },
  {
    model: 'Gradient Boosting',
    accuracy: 0.861,
    precision: 0.789,
    recall: 0.938,
    f1Score: 0.857,
    rocAuc: 0.938,
    cvAccuracy: 0.764,
  },
  {
    model: 'K-Nearest Neighbors',
    accuracy: 0.861,
    precision: 0.824,
    recall: 0.875,
    f1Score: 0.848,
    rocAuc: 0.922,
    cvAccuracy: 0.806,
  },
  {
    model: 'Logistic Regression',
    accuracy: 0.833,
    precision: 0.778,
    recall: 0.875,
    f1Score: 0.824,
    rocAuc: 0.938,
    cvAccuracy: 0.799,
  },
  {
    model: 'Support Vector Machine',
    accuracy: 0.806,
    precision: 0.737,
    recall: 0.875,
    f1Score: 0.800,
    rocAuc: 0.947,
    cvAccuracy: 0.813,
  },
  {
    model: 'Decision Tree',
    accuracy: 0.750,
    precision: 0.684,
    recall: 0.812,
    f1Score: 0.743,
    rocAuc: 0.756,
    cvAccuracy: 0.744,
  },
];

// Feature Importances extracted from Notebook Cell 93 (Random Forest)
export const FEATURE_IMPORTANCES = [
  { feature: 'thal', name: 'Thallium Stress Test', importance: 0.13, color: '#f43f5e' },
  { feature: 'chest_pain_type', name: 'Chest Pain Type', importance: 0.12, color: '#fb7185' },
  { feature: 'max_heart_rate_achieved', name: 'Max Heart Rate Achieved', importance: 0.10, color: '#fb923c' },
  { feature: 'oldpeak_eq_st_depression', name: 'ST Depression (Oldpeak)', importance: 0.10, color: '#f59e0b' },
  { feature: 'age', name: 'Patient Age', importance: 0.10, color: '#eab308' },
  { feature: 'num_major_vessels', name: 'Number of Major Vessels', importance: 0.09, color: '#84cc16' },
  { feature: 'serum_cholesterol_mg_per_dl', name: 'Serum Cholesterol', importance: 0.08, color: '#10b981' },
  { feature: 'resting_blood_pressure', name: 'Resting Blood Pressure', importance: 0.07, color: '#06b6d4' },
  { feature: 'exercise_induced_angina', name: 'Exercise-Induced Angina', importance: 0.06, color: '#3b82f6' },
  { feature: 'slope_of_peak_exercise_st_segment', name: 'Peak ST Slope', importance: 0.06, color: '#6366f1' },
  { feature: 'sex', name: 'Biological Sex', importance: 0.04, color: '#8b5cf6' },
  { feature: 'resting_ekg_results', name: 'Resting EKG Results', importance: 0.02, color: '#a855f7' },
  { feature: 'fasting_blood_sugar_gt_120_mg_per_dl', name: 'Fasting Blood Sugar > 120', importance: 0.01, color: '#d946ef' },
];

// Dataset Means and Standard Deviations from Notebook Cell 15 (StandardScaler training distribution)
export const FEATURE_STATS = {
  slope_of_peak_exercise_st_segment: { mean: 1.55, std: 0.62, min: 1, max: 3, unit: 'category' },
  resting_blood_pressure: { mean: 131.31, std: 17.01, min: 94, max: 180, unit: 'mm Hg' },
  chest_pain_type: { mean: 3.16, std: 0.94, min: 1, max: 4, unit: 'type' },
  num_major_vessels: { mean: 0.69, std: 0.97, min: 0, max: 3, unit: 'vessels' },
  fasting_blood_sugar_gt_120_mg_per_dl: { mean: 0.16, std: 0.37, min: 0, max: 1, unit: 'binary' },
  resting_ekg_results: { mean: 1.05, std: 1.00, min: 0, max: 2, unit: 'score' },
  serum_cholesterol_mg_per_dl: { mean: 249.21, std: 52.72, min: 126, max: 564, unit: 'mg/dL' },
  oldpeak_eq_st_depression: { mean: 1.01, std: 1.12, min: 0.0, max: 6.2, unit: 'mm' },
  sex: { mean: 0.69, std: 0.46, min: 0, max: 1, unit: 'binary' },
  age: { mean: 54.81, std: 9.33, min: 29, max: 77, unit: 'years' },
  max_heart_rate_achieved: { mean: 149.48, std: 22.06, min: 96, max: 202, unit: 'bpm' },
  exercise_induced_angina: { mean: 0.32, std: 0.47, min: 0, max: 1, unit: 'binary' },
  thal: { mean: 1.37, std: 0.58, min: 0, max: 2, unit: 'category' },
};

// Best Model (Random Forest) Confusion Matrix on 36 Test Patients (Notebook Cell 90)
export const CONFUSION_MATRIX = {
  trueNegative: 17, // No Disease, Predicted No Disease (85% specificity)
  falsePositive: 3,  // No Disease, Predicted Disease
  falseNegative: 0,  // Disease, Predicted No Disease (0 misses, 100% recall!)
  truePositive: 16,  // Disease, Predicted Disease (100% sensitivity)
  totalSamples: 36,
};

// ROC Curve Coordinate Points for visualization (Notebook Cell 91)
export const ROC_CURVE_POINTS = [
  { fpr: 0.00, tpr: 0.00 },
  { fpr: 0.00, tpr: 0.38 },
  { fpr: 0.00, tpr: 0.69 },
  { fpr: 0.05, tpr: 0.81 },
  { fpr: 0.05, tpr: 0.94 },
  { fpr: 0.10, tpr: 1.00 },
  { fpr: 0.15, tpr: 1.00 },
  { fpr: 0.25, tpr: 1.00 },
  { fpr: 0.50, tpr: 1.00 },
  { fpr: 1.00, tpr: 1.00 },
];
