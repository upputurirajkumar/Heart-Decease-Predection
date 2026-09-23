/**
 * HEARTINTEL - Patient Input Validation Module
 * Enforces project-supported boundaries and provides clear diagnostic feedback
 */

export const VALIDATION_RULES = {
  age: {
    min: 20,
    max: 95,
    datasetMin: 29,
    datasetMax: 77,
    label: 'Age',
    unit: 'years'
  },
  resting_blood_pressure: {
    min: 70,
    max: 240,
    datasetMin: 94,
    datasetMax: 200,
    label: 'Resting Blood Pressure',
    unit: 'mmHg'
  },
  serum_cholesterol_mg_per_dl: {
    min: 100,
    max: 600,
    datasetMin: 126,
    datasetMax: 564,
    label: 'Serum Cholesterol',
    unit: 'mg/dL'
  },
  max_heart_rate_achieved: {
    min: 60,
    max: 230,
    datasetMin: 96,
    datasetMax: 202,
    label: 'Maximum Heart Rate',
    unit: 'bpm'
  },
  oldpeak_eq_st_depression: {
    min: 0.0,
    max: 7.0,
    datasetMin: 0.0,
    datasetMax: 6.2,
    label: 'ST Depression (Oldpeak)',
    unit: 'mm'
  }
};

export function validatePatientData(data) {
  const errors = {};

  // Numeric checks
  if (data.age === undefined || isNaN(data.age)) {
    errors.age = 'Age is required and must be a number.';
  } else if (data.age < VALIDATION_RULES.age.min || data.age > VALIDATION_RULES.age.max) {
    errors.age = `Age must be between ${VALIDATION_RULES.age.min} and ${VALIDATION_RULES.age.max} years (Dataset: ${VALIDATION_RULES.age.datasetMin}–${VALIDATION_RULES.age.datasetMax}).`;
  }

  if (data.resting_blood_pressure === undefined || isNaN(data.resting_blood_pressure)) {
    errors.resting_blood_pressure = 'Resting blood pressure is required.';
  } else if (data.resting_blood_pressure < VALIDATION_RULES.resting_blood_pressure.min || data.resting_blood_pressure > VALIDATION_RULES.resting_blood_pressure.max) {
    errors.resting_blood_pressure = `BP must be between ${VALIDATION_RULES.resting_blood_pressure.min} and ${VALIDATION_RULES.resting_blood_pressure.max} mmHg (Dataset: ${VALIDATION_RULES.resting_blood_pressure.datasetMin}–${VALIDATION_RULES.resting_blood_pressure.datasetMax}).`;
  }

  if (data.serum_cholesterol_mg_per_dl === undefined || isNaN(data.serum_cholesterol_mg_per_dl)) {
    errors.serum_cholesterol_mg_per_dl = 'Serum cholesterol is required.';
  } else if (data.serum_cholesterol_mg_per_dl < VALIDATION_RULES.serum_cholesterol_mg_per_dl.min || data.serum_cholesterol_mg_per_dl > VALIDATION_RULES.serum_cholesterol_mg_per_dl.max) {
    errors.serum_cholesterol_mg_per_dl = `Cholesterol must be between ${VALIDATION_RULES.serum_cholesterol_mg_per_dl.min} and ${VALIDATION_RULES.serum_cholesterol_mg_per_dl.max} mg/dL.`;
  }

  if (data.max_heart_rate_achieved === undefined || isNaN(data.max_heart_rate_achieved)) {
    errors.max_heart_rate_achieved = 'Max heart rate achieved is required.';
  } else if (data.max_heart_rate_achieved < VALIDATION_RULES.max_heart_rate_achieved.min || data.max_heart_rate_achieved > VALIDATION_RULES.max_heart_rate_achieved.max) {
    errors.max_heart_rate_achieved = `Max heart rate must be between ${VALIDATION_RULES.max_heart_rate_achieved.min} and ${VALIDATION_RULES.max_heart_rate_achieved.max} bpm.`;
  }

  if (data.oldpeak_eq_st_depression === undefined || isNaN(data.oldpeak_eq_st_depression)) {
    errors.oldpeak_eq_st_depression = 'ST depression is required.';
  } else if (data.oldpeak_eq_st_depression < VALIDATION_RULES.oldpeak_eq_st_depression.min || data.oldpeak_eq_st_depression > VALIDATION_RULES.oldpeak_eq_st_depression.max) {
    errors.oldpeak_eq_st_depression = `ST depression must be between 0.0 and 7.0 mm (Dataset: 0.0–6.2 mm).`;
  }

  // Categorical checks
  if (![0, 1].includes(Number(data.sex))) {
    errors.sex = 'Valid biological sex selection is required.';
  }

  if (![0, 1].includes(Number(data.fasting_blood_sugar_gt_120_mg_per_dl))) {
    errors.fasting_blood_sugar_gt_120_mg_per_dl = 'Select whether fasting blood sugar is > 120 mg/dL.';
  }

  if (![0, 1, 2].includes(Number(data.resting_ekg_results))) {
    errors.resting_ekg_results = 'Resting EKG selection is invalid.';
  }

  if (![1, 2, 3, 4].includes(Number(data.chest_pain_type))) {
    errors.chest_pain_type = 'Chest pain classification (1–4) is required.';
  }

  if (![0, 1].includes(Number(data.exercise_induced_angina))) {
    errors.exercise_induced_angina = 'Exercise-induced angina indicator is required.';
  }

  if (![1, 2, 3].includes(Number(data.slope_of_peak_exercise_st_segment))) {
    errors.slope_of_peak_exercise_st_segment = 'Slope selection is required.';
  }

  if (![0, 1, 2, 3].includes(Number(data.num_major_vessels))) {
    errors.num_major_vessels = 'Vessel count must be 0, 1, 2, or 3.';
  }

  if (!['normal', 'reversible_defect', 'fixed_defect'].includes(data.thal)) {
    errors.thal = 'Thallium scintigraphy selection is required.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}
