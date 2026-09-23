/**
 * HEARTINTEL - Dataset & Model Metadata
 * Source of Truth: PRCP-1016 Heart Disease Prediction Study
 * Cleveland Clinic Dataset (values.csv & labels.csv merged on patient_id)
 */

export const DATASET_STATS = {
  totalRows: 180,
  totalColumns: 14,
  featuresCount: 13,
  targetVariable: 'heart_disease_present',
  missingValues: 0,
  duplicateRows: 0,
  trainSplit: 144, // 80%
  testSplit: 36,   // 20%
  testPositives: 13,
  testNegatives: 23,
  classDistribution: {
    negative: { count: 100, percentage: 55.56, label: 'Absence of Disease (Class 0)' },
    positive: { count: 80, percentage: 44.44, label: 'Presence of Disease (Class 1)' }
  }
};

export const CLINICAL_FEATURES_INFO = {
  age: {
    name: 'Age',
    key: 'age',
    type: 'numerical',
    unit: 'years',
    min: 29,
    max: 77,
    mean: 54.81,
    std: 9.33,
    median: 55.0,
    category: 'Demographics',
    description: 'Patient chronological age in years at examination.'
  },
  sex: {
    name: 'Sex',
    key: 'sex',
    type: 'categorical',
    unit: 'binary',
    categories: { 0: 'Female (31%)', 1: 'Male (69%)' },
    category: 'Demographics',
    description: 'Biological sex of patient (0 = female, 1 = male).'
  },
  resting_blood_pressure: {
    name: 'Resting Blood Pressure',
    key: 'resting_blood_pressure',
    type: 'numerical',
    unit: 'mmHg',
    min: 94,
    max: 200,
    mean: 131.34,
    std: 17.86,
    median: 130.0,
    category: 'Clinical Measurements',
    description: 'Resting systemic blood pressure on hospital admission in mmHg.'
  },
  serum_cholesterol_mg_per_dl: {
    name: 'Serum Cholesterol',
    key: 'serum_cholesterol_mg_per_dl',
    type: 'numerical',
    unit: 'mg/dL',
    min: 126,
    max: 564,
    mean: 249.21,
    std: 52.72,
    median: 243.5,
    category: 'Clinical Measurements',
    description: 'Total serum cholesterol level measured in mg/dL.'
  },
  fasting_blood_sugar_gt_120_mg_per_dl: {
    name: 'Fasting Blood Sugar > 120 mg/dL',
    key: 'fasting_blood_sugar_gt_120_mg_per_dl',
    type: 'categorical',
    unit: 'binary',
    categories: { 0: 'False (<= 120 mg/dL, 83.9%)', 1: 'True (> 120 mg/dL, 16.1%)' },
    category: 'Clinical Measurements',
    description: 'Fasting blood sugar elevated above 120 mg/dL (diabetic/pre-diabetic indicator).'
  },
  resting_ekg_results: {
    name: 'Resting EKG Results',
    key: 'resting_ekg_results',
    type: 'categorical',
    unit: 'class',
    categories: {
      0: 'Normal (47.2%)',
      1: 'ST-T Wave Abnormality (1.7%)',
      2: 'Left Ventricular Hypertrophy (51.1%)'
    },
    category: 'Clinical Measurements',
    description: 'Resting electrocardiographic findings.'
  },
  chest_pain_type: {
    name: 'Chest Pain Type',
    key: 'chest_pain_type',
    type: 'categorical',
    unit: 'class',
    categories: {
      1: 'Typical Angina (11.1%)',
      2: 'Atypical Angina (15.6%)',
      3: 'Non-Anginal Pain (28.9%)',
      4: 'Asymptomatic / Silent Ischemia (44.4%)'
    },
    category: 'Exercise / Diagnostic',
    description: 'Clinical chest pain presentation categorized into 4 clinical tiers.'
  },
  max_heart_rate_achieved: {
    name: 'Maximum Heart Rate Achieved',
    key: 'max_heart_rate_achieved',
    type: 'numerical',
    unit: 'bpm',
    min: 96,
    max: 202,
    mean: 149.48,
    std: 22.06,
    median: 152.0,
    category: 'Exercise / Diagnostic',
    description: 'Peak heart rate attained during graded treadmill stress testing.'
  },
  exercise_induced_angina: {
    name: 'Exercise-Induced Angina',
    key: 'exercise_induced_angina',
    type: 'categorical',
    unit: 'binary',
    categories: { 0: 'No (67.8%)', 1: 'Yes (32.2%)' },
    category: 'Exercise / Diagnostic',
    description: 'Chest discomfort elicited during physical exertion stress testing.'
  },
  oldpeak_eq_st_depression: {
    name: 'ST Depression (Oldpeak)',
    key: 'oldpeak_eq_st_depression',
    type: 'numerical',
    unit: 'mm',
    min: 0.0,
    max: 6.2,
    mean: 1.01,
    std: 1.12,
    median: 0.8,
    category: 'Exercise / Diagnostic',
    description: 'ST depression induced by exercise relative to resting baseline in millimeters.'
  },
  slope_of_peak_exercise_st_segment: {
    name: 'Slope of Peak Exercise ST',
    key: 'slope_of_peak_exercise_st_segment',
    type: 'categorical',
    unit: 'class',
    categories: {
      1: 'Upsloping (43.3%)',
      2: 'Flat (48.9%)',
      3: 'Downsloping (7.8%)'
    },
    category: 'Exercise / Diagnostic',
    description: 'The trajectory slope of the ST segment at peak exercise load.'
  },
  num_major_vessels: {
    name: 'Major Vessels Colored (Fluoroscopy)',
    key: 'num_major_vessels',
    type: 'numerical',
    unit: 'vessels (0-3)',
    min: 0,
    max: 3,
    mean: 0.67,
    std: 0.93,
    median: 0.0,
    categories: { 0: '0 Vessels (60%)', 1: '1 Vessel (21.1%)', 2: '2 Vessels (12.2%)', 3: '3 Vessels (6.7%)' },
    category: 'Other Clinical Variables',
    description: 'Number of major coronary vessels (0–3) visualized under fluoroscopy.'
  },
  thal: {
    name: 'Thallium Stress Scintigraphy',
    key: 'thal',
    type: 'categorical',
    unit: 'status',
    categories: {
      'normal': 'Normal Perfusion (54.4%)',
      'reversible_defect': 'Reversible Defect (41.1%)',
      'fixed_defect': 'Fixed Defect (4.4%)'
    },
    category: 'Other Clinical Variables',
    description: 'Nuclear myocardial perfusion scintigraphy status.'
  }
};

export const MODELS_DATA = {
  'random-forest': {
    id: 'random-forest',
    name: 'Random Forest Classifier',
    family: 'Ensemble (Bagging)',
    isChampion: true,
    tagline: 'Top performing model with 0 false negatives on holdout test set',
    metrics: {
      accuracy: 0.9167,
      precision: 0.8125,
      recall: 1.0000,
      f1Score: 0.8966,
      rocAuc: 0.9565,
      cvAccuracy: 0.8267,
      cvStd: 0.042
    },
    confusionMatrix: {
      tn: 20,
      fp: 3,
      fn: 0,
      tp: 13,
      total: 36
    },
    classificationReport: {
      class0: { precision: 1.000, recall: 0.870, f1: 0.930, support: 23 },
      class1: { precision: 0.813, recall: 1.000, f1: 0.897, support: 13 },
      macroAvg: { precision: 0.906, recall: 0.935, f1: 0.913, support: 36 },
      weightedAvg: { precision: 0.932, recall: 0.917, f1: 0.918, support: 36 }
    },
    rocCurve: [
      { fpr: 0.00, tpr: 0.00 },
      { fpr: 0.00, tpr: 0.46 },
      { fpr: 0.00, tpr: 0.77 },
      { fpr: 0.04, tpr: 0.85 },
      { fpr: 0.09, tpr: 0.92 },
      { fpr: 0.13, tpr: 1.00 },
      { fpr: 0.35, tpr: 1.00 },
      { fpr: 0.65, tpr: 1.00 },
      { fpr: 1.00, tpr: 1.00 }
    ],
    hyperparameters: {
      n_estimators: 100,
      criterion: 'gini',
      max_depth: 'None (Optimized)',
      min_samples_split: 2,
      min_samples_leaf: 1,
      random_state: 42
    },
    clinicalNotes: 'Zero false negatives on the 36-patient holdout set. In cardiac screening, missing an at-risk patient (Type II error) is far more hazardous than a false positive requiring confirmation.'
  },
  'extra-trees': {
    id: 'extra-trees',
    name: 'Extra Trees Classifier',
    family: 'Ensemble (Randomized)',
    isChampion: false,
    tagline: 'Extremely randomized trees with perfect sensitivity on test set',
    metrics: {
      accuracy: 0.8889,
      precision: 0.7647,
      recall: 1.0000,
      f1Score: 0.8667,
      rocAuc: 0.9381,
      cvAccuracy: 0.8133,
      cvStd: 0.038
    },
    confusionMatrix: {
      tn: 19,
      fp: 4,
      fn: 0,
      tp: 13,
      total: 36
    },
    classificationReport: {
      class0: { precision: 1.000, recall: 0.826, f1: 0.905, support: 23 },
      class1: { precision: 0.765, recall: 1.000, f1: 0.867, support: 13 },
      macroAvg: { precision: 0.882, recall: 0.913, f1: 0.886, support: 36 },
      weightedAvg: { precision: 0.915, recall: 0.889, f1: 0.891, support: 36 }
    },
    rocCurve: [
      { fpr: 0.00, tpr: 0.00 },
      { fpr: 0.00, tpr: 0.38 },
      { fpr: 0.04, tpr: 0.69 },
      { fpr: 0.09, tpr: 0.85 },
      { fpr: 0.17, tpr: 1.00 },
      { fpr: 0.40, tpr: 1.00 },
      { fpr: 1.00, tpr: 1.00 }
    ],
    hyperparameters: {
      n_estimators: 100,
      criterion: 'gini',
      max_features: 'sqrt',
      random_state: 42
    },
    clinicalNotes: 'Extremely randomized decision splits lower variance without bias penalty, yielding identical 100% recall to Random Forest.'
  },
  'gradient-boosting': {
    id: 'gradient-boosting',
    name: 'Gradient Boosting Classifier',
    family: 'Ensemble (Boosting)',
    isChampion: false,
    tagline: 'Sequential residual fitting optimizing deviance loss',
    metrics: {
      accuracy: 0.8611,
      precision: 0.7500,
      recall: 0.9231,
      f1Score: 0.8276,
      rocAuc: 0.9381,
      cvAccuracy: 0.8062,
      cvStd: 0.045
    },
    confusionMatrix: {
      tn: 19,
      fp: 4,
      fn: 1,
      tp: 12,
      total: 36
    },
    classificationReport: {
      class0: { precision: 0.950, recall: 0.826, f1: 0.884, support: 23 },
      class1: { precision: 0.750, recall: 0.923, f1: 0.828, support: 13 },
      macroAvg: { precision: 0.850, recall: 0.875, f1: 0.856, support: 36 },
      weightedAvg: { precision: 0.878, recall: 0.861, f1: 0.864, support: 36 }
    },
    rocCurve: [
      { fpr: 0.00, tpr: 0.00 },
      { fpr: 0.00, tpr: 0.31 },
      { fpr: 0.04, tpr: 0.62 },
      { fpr: 0.09, tpr: 0.85 },
      { fpr: 0.17, tpr: 0.92 },
      { fpr: 0.22, tpr: 1.00 },
      { fpr: 1.00, tpr: 1.00 }
    ],
    hyperparameters: {
      n_estimators: 100,
      learning_rate: 0.1,
      max_depth: 3,
      random_state: 42
    },
    clinicalNotes: 'Strong non-linear boundary resolution with 92.3% recall and 0.938 ROC-AUC.'
  },
  'knn': {
    id: 'knn',
    name: 'K-Nearest Neighbors (KNN)',
    family: 'Instance-Based',
    isChampion: false,
    tagline: 'Euclidean distance matching in standardized feature space',
    metrics: {
      accuracy: 0.8611,
      precision: 0.7500,
      recall: 0.9231,
      f1Score: 0.8276,
      rocAuc: 0.9217,
      cvAccuracy: 0.7988,
      cvStd: 0.051
    },
    confusionMatrix: {
      tn: 19,
      fp: 4,
      fn: 1,
      tp: 12,
      total: 36
    },
    classificationReport: {
      class0: { precision: 0.950, recall: 0.826, f1: 0.884, support: 23 },
      class1: { precision: 0.750, recall: 0.923, f1: 0.828, support: 13 },
      macroAvg: { precision: 0.850, recall: 0.875, f1: 0.856, support: 36 },
      weightedAvg: { precision: 0.878, recall: 0.861, f1: 0.864, support: 36 }
    },
    rocCurve: [
      { fpr: 0.00, tpr: 0.00 },
      { fpr: 0.04, tpr: 0.38 },
      { fpr: 0.09, tpr: 0.69 },
      { fpr: 0.17, tpr: 0.92 },
      { fpr: 0.26, tpr: 0.92 },
      { fpr: 0.35, tpr: 1.00 },
      { fpr: 1.00, tpr: 1.00 }
    ],
    hyperparameters: {
      n_neighbors: 5,
      weights: 'uniform',
      metric: 'minkowski (p=2)',
      scaling: 'StandardScaler'
    },
    clinicalNotes: 'Effective when all continuous biomarkers are standardized to zero mean and unit variance.'
  },
  'logistic-regression': {
    id: 'logistic-regression',
    name: 'Logistic Regression',
    family: 'Linear Model',
    isChampion: false,
    tagline: 'Probabilistic baseline model with log-odds transparency',
    metrics: {
      accuracy: 0.8333,
      precision: 0.7333,
      recall: 0.8462,
      f1Score: 0.7857,
      rocAuc: 0.8796,
      cvAccuracy: 0.8194,
      cvStd: 0.036
    },
    confusionMatrix: {
      tn: 19,
      fp: 4,
      fn: 2,
      tp: 11,
      total: 36
    },
    classificationReport: {
      class0: { precision: 0.905, recall: 0.826, f1: 0.864, support: 23 },
      class1: { precision: 0.733, recall: 0.846, f1: 0.786, support: 13 },
      macroAvg: { precision: 0.819, recall: 0.836, f1: 0.825, support: 36 },
      weightedAvg: { precision: 0.843, recall: 0.833, f1: 0.836, support: 36 }
    },
    rocCurve: [
      { fpr: 0.00, tpr: 0.00 },
      { fpr: 0.04, tpr: 0.31 },
      { fpr: 0.09, tpr: 0.54 },
      { fpr: 0.17, tpr: 0.85 },
      { fpr: 0.30, tpr: 0.85 },
      { fpr: 0.39, tpr: 1.00 },
      { fpr: 1.00, tpr: 1.00 }
    ],
    hyperparameters: {
      penalty: 'l2',
      C: 1.0,
      solver: 'lbfgs',
      max_iter: 1000,
      random_state: 42
    },
    clinicalNotes: 'Provides clinical transparency through exponential odds ratios.'
  },
  'svm': {
    id: 'svm',
    name: 'Support Vector Machine (SVM)',
    family: 'Kernel Method',
    isChampion: false,
    tagline: 'Maximum margin hyperplane in RBF transformed Hilbert space',
    metrics: {
      accuracy: 0.8056,
      precision: 0.6875,
      recall: 0.8462,
      f1Score: 0.7586,
      rocAuc: 0.9465,
      cvAccuracy: 0.8122,
      cvStd: 0.040
    },
    confusionMatrix: {
      tn: 18,
      fp: 5,
      fn: 2,
      tp: 11,
      total: 36
    },
    classificationReport: {
      class0: { precision: 0.900, recall: 0.783, f1: 0.837, support: 23 },
      class1: { precision: 0.688, recall: 0.846, f1: 0.759, support: 13 },
      macroAvg: { precision: 0.794, recall: 0.814, f1: 0.798, support: 36 },
      weightedAvg: { precision: 0.823, recall: 0.806, f1: 0.809, support: 36 }
    },
    rocCurve: [
      { fpr: 0.00, tpr: 0.00 },
      { fpr: 0.00, tpr: 0.46 },
      { fpr: 0.04, tpr: 0.77 },
      { fpr: 0.09, tpr: 0.85 },
      { fpr: 0.22, tpr: 0.85 },
      { fpr: 0.26, tpr: 1.00 },
      { fpr: 1.00, tpr: 1.00 }
    ],
    hyperparameters: {
      kernel: 'rbf',
      C: 1.0,
      gamma: 'scale',
      probability: true,
      random_state: 42
    },
    clinicalNotes: 'High ROC-AUC (0.947) demonstrating strong ranking separation capacity.'
  },
  'decision-tree': {
    id: 'decision-tree',
    name: 'Decision Tree Classifier',
    family: 'Recursive Tree',
    isChampion: false,
    tagline: 'Single binary tree using recursive Gini impurity splits',
    metrics: {
      accuracy: 0.7500,
      precision: 0.6429,
      recall: 0.6923,
      f1Score: 0.6667,
      rocAuc: 0.7559,
      cvAccuracy: 0.7361,
      cvStd: 0.062
    },
    confusionMatrix: {
      tn: 18,
      fp: 5,
      fn: 4,
      tp: 9,
      total: 36
    },
    classificationReport: {
      class0: { precision: 0.818, recall: 0.783, f1: 0.800, support: 23 },
      class1: { precision: 0.643, recall: 0.692, f1: 0.667, support: 13 },
      macroAvg: { precision: 0.730, recall: 0.738, f1: 0.733, support: 36 },
      weightedAvg: { precision: 0.755, recall: 0.750, f1: 0.752, support: 36 }
    },
    rocCurve: [
      { fpr: 0.00, tpr: 0.00 },
      { fpr: 0.22, tpr: 0.69 },
      { fpr: 0.43, tpr: 0.85 },
      { fpr: 1.00, tpr: 1.00 }
    ],
    hyperparameters: {
      criterion: 'gini',
      max_depth: 'None (Pruning explored)',
      min_samples_split: 2,
      random_state: 42
    },
    clinicalNotes: 'Higher variance on small holdout test set with 4 false negatives (69.2% recall).'
  }
};

export const FEATURE_IMPORTANCE_DATA = [
  { feature: 'thal', name: 'Thallium Scintigraphy', importance: 0.135, rank: 1, category: 'Nuclear Imaging' },
  { feature: 'chest_pain_type', name: 'Chest Pain Type', importance: 0.122, rank: 2, category: 'Symptomatology' },
  { feature: 'max_heart_rate_achieved', name: 'Max Heart Rate Achieved', importance: 0.104, rank: 3, category: 'Exercise Stress' },
  { feature: 'oldpeak_eq_st_depression', name: 'Exercise ST Depression', importance: 0.101, rank: 4, category: 'Electrophysiology' },
  { feature: 'num_major_vessels', name: 'Fluoroscopy Vessels', importance: 0.093, rank: 5, category: 'Fluoroscopy' },
  { feature: 'age', name: 'Patient Age', importance: 0.087, rank: 6, category: 'Demographics' },
  { feature: 'serum_cholesterol_mg_per_dl', name: 'Serum Cholesterol', importance: 0.082, rank: 7, category: 'Lipid Panel' },
  { feature: 'resting_blood_pressure', name: 'Resting Blood Pressure', importance: 0.078, rank: 8, category: 'Hemodynamics' },
  { feature: 'exercise_induced_angina', name: 'Exercise Angina', importance: 0.061, rank: 9, category: 'Exercise Stress' },
  { feature: 'slope_of_peak_exercise_st_segment', name: 'Peak ST Slope', importance: 0.054, rank: 10, category: 'Electrophysiology' },
  { feature: 'sex', name: 'Biological Sex', importance: 0.042, rank: 11, category: 'Demographics' },
  { feature: 'resting_ekg_results', name: 'Resting EKG Results', importance: 0.028, rank: 12, category: 'Electrophysiology' },
  { feature: 'fasting_blood_sugar_gt_120_mg_per_dl', name: 'Fasting Blood Sugar > 120', importance: 0.013, rank: 13, category: 'Metabolic' }
];

export const CORRELATION_DATA = [
  { feature: 'thal', name: 'Thallium Scintigraphy', r: 0.52, direction: 'positive' },
  { feature: 'num_major_vessels', name: 'Major Vessels Colored', r: 0.46, direction: 'positive' },
  { feature: 'oldpeak_eq_st_depression', name: 'ST Depression (Oldpeak)', r: 0.42, direction: 'positive' },
  { feature: 'max_heart_rate_achieved', name: 'Max Heart Rate Achieved', r: -0.42, direction: 'negative' },
  { feature: 'exercise_induced_angina', name: 'Exercise Induced Angina', r: 0.42, direction: 'positive' },
  { feature: 'chest_pain_type', name: 'Chest Pain Type', r: 0.41, direction: 'positive' },
  { feature: 'sex', name: 'Biological Sex (Male)', r: 0.33, direction: 'positive' },
  { feature: 'slope_of_peak_exercise_st_segment', name: 'Peak ST Slope', r: 0.34, direction: 'positive' },
  { feature: 'age', name: 'Patient Age', r: 0.23, direction: 'positive' },
  { feature: 'resting_blood_pressure', name: 'Resting Blood Pressure', r: 0.15, direction: 'positive' },
  { feature: 'resting_ekg_results', name: 'Resting EKG Results', r: 0.15, direction: 'positive' },
  { feature: 'serum_cholesterol_mg_per_dl', name: 'Serum Cholesterol', r: 0.10, direction: 'positive' },
  { feature: 'fasting_blood_sugar_gt_120_mg_per_dl', name: 'Fasting Blood Sugar > 120', r: 0.01, direction: 'positive' }
];

// Feature distributions sampled across 180 cohort records for interactive EDA histograms
export const EDA_DISTRIBUTIONS = {
  age: {
    bins: ['25-34', '35-44', '45-54', '55-64', '65-74', '75+'],
    all: [4, 25, 52, 68, 28, 3],
    disease: [0, 8, 22, 36, 13, 1],
    noDisease: [4, 17, 30, 32, 15, 2]
  },
  resting_blood_pressure: {
    bins: ['<110', '110-129', '130-149', '150-169', '170+'],
    all: [14, 62, 66, 26, 12],
    disease: [4, 24, 32, 13, 7],
    noDisease: [10, 38, 34, 13, 5]
  },
  serum_cholesterol_mg_per_dl: {
    bins: ['<200', '200-239', '240-279', '280-319', '320+'],
    all: [30, 48, 54, 32, 16],
    disease: [11, 20, 26, 14, 9],
    noDisease: [19, 28, 28, 18, 7]
  },
  max_heart_rate_achieved: {
    bins: ['<120', '120-139', '140-159', '160-179', '180+'],
    all: [17, 39, 56, 49, 19],
    disease: [14, 25, 24, 14, 3],
    noDisease: [3, 14, 32, 35, 16]
  },
  oldpeak_eq_st_depression: {
    bins: ['0.0', '0.1-1.0', '1.1-2.0', '2.1-3.0', '3.1+'],
    all: [58, 48, 41, 21, 12],
    disease: [12, 18, 24, 15, 11],
    noDisease: [46, 30, 17, 6, 1]
  },
  chest_pain_type: {
    bins: ['1: Typical', '2: Atypical', '3: Non-Anginal', '4: Asymptomatic'],
    all: [20, 28, 52, 80],
    disease: [4, 6, 12, 58],
    noDisease: [16, 22, 40, 22]
  },
  thal: {
    bins: ['Normal', 'Reversible Defect', 'Fixed Defect'],
    all: [98, 74, 8],
    disease: [22, 53, 5],
    noDisease: [76, 21, 3]
  },
  num_major_vessels: {
    bins: ['0 Vessels', '1 Vessel', '2 Vessels', '3 Vessels'],
    all: [108, 38, 22, 12],
    disease: [30, 24, 16, 10],
    noDisease: [78, 14, 6, 2]
  }
};
