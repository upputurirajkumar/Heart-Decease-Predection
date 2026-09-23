/**
 * HEARTINTEL - Patient Screening Form Handler
 * Controls inputs, sliders, segmented toggles, archetype presets, and form reset
 */

import { appState } from './state.js';
import { analysisWorkflow } from './analysisWorkflow.js';

export function initFormHandler() {
  bindFormInputs();
  bindPresetArchetypes();
  bindAnalyzeButton();
  bindResetButton();

  // Listen to external state updates
  appState.on('patient:change', () => {
    syncFormWithState();
  });
}

const PRESETS = {
  'case-high': {
    patient_id: 'PT-0Z64UN',
    age: 67,
    sex: 1,
    resting_blood_pressure: 160,
    serum_cholesterol_mg_per_dl: 286,
    fasting_blood_sugar_gt_120_mg_per_dl: 0,
    resting_ekg_results: 2,
    chest_pain_type: 4,
    max_heart_rate_achieved: 108,
    exercise_induced_angina: 1,
    oldpeak_eq_st_depression: 2.6,
    slope_of_peak_exercise_st_segment: 2,
    num_major_vessels: 3,
    thal: 'reversible_defect'
  },
  'case-low': {
    patient_id: 'PT-YT1S1X',
    age: 44,
    sex: 1,
    resting_blood_pressure: 120,
    serum_cholesterol_mg_per_dl: 220,
    fasting_blood_sugar_gt_120_mg_per_dl: 0,
    resting_ekg_results: 0,
    chest_pain_type: 2,
    max_heart_rate_achieved: 170,
    exercise_induced_angina: 0,
    oldpeak_eq_st_depression: 0.0,
    slope_of_peak_exercise_st_segment: 1,
    num_major_vessels: 0,
    thal: 'normal'
  },
  'case-borderline': {
    patient_id: 'PT-OYT4EK',
    age: 58,
    sex: 0,
    resting_blood_pressure: 136,
    serum_cholesterol_mg_per_dl: 242,
    fasting_blood_sugar_gt_120_mg_per_dl: 0,
    resting_ekg_results: 1,
    chest_pain_type: 3,
    max_heart_rate_achieved: 148,
    exercise_induced_angina: 0,
    oldpeak_eq_st_depression: 1.0,
    slope_of_peak_exercise_st_segment: 2,
    num_major_vessels: 1,
    thal: 'normal'
  }
};

const DEFAULT_BASELINE = {
  patient_id: 'PT-MANUAL',
  age: 54,
  sex: 1,
  resting_blood_pressure: 130,
  serum_cholesterol_mg_per_dl: 240,
  fasting_blood_sugar_gt_120_mg_per_dl: 0,
  resting_ekg_results: 0,
  chest_pain_type: 3,
  max_heart_rate_achieved: 150,
  exercise_induced_angina: 0,
  oldpeak_eq_st_depression: 0.8,
  slope_of_peak_exercise_st_segment: 1,
  num_major_vessels: 0,
  thal: 'normal'
};

function bindFormInputs() {
  // Patient ID text input
  const pidInput = document.getElementById('input-patient-id');
  if (pidInput) {
    pidInput.addEventListener('input', (e) => {
      appState.setPatientValue('patient_id', e.target.value.trim() || 'PT-SCREENING');
    });
  }

  // Numeric inputs with linked sliders and badges
  const bindNumericField = (id, key, formatFn) => {
    const slider = document.getElementById(`input-${id}`);
    const numInput = document.getElementById(`num-${id}`);
    const badge = document.getElementById(`badge-${id}`);

    const updateVal = (val) => {
      const num = parseFloat(val);
      if (!isNaN(num)) {
        appState.setPatientValue(key, num);
        if (slider && slider.value != num) slider.value = num;
        if (numInput && numInput.value != num) numInput.value = num;
        if (badge) badge.textContent = formatFn ? formatFn(num) : num;
      }
    };

    if (slider) slider.addEventListener('input', (e) => updateVal(e.target.value));
    if (numInput) numInput.addEventListener('input', (e) => updateVal(e.target.value));
  };

  bindNumericField('age', 'age', v => `${v} yrs`);
  bindNumericField('bp', 'resting_blood_pressure', v => `${v} mmHg`);
  bindNumericField('chol', 'serum_cholesterol_mg_per_dl', v => `${v} mg/dL`);
  bindNumericField('maxhr', 'max_heart_rate_achieved', v => `${v} bpm`);
  bindNumericField('oldpeak', 'oldpeak_eq_st_depression', v => `${parseFloat(v).toFixed(1)} mm`);

  // Segmented / Toggle Groups
  const bindSegmentedGroup = (groupId, key, transformFn) => {
    const group = document.getElementById(groupId);
    if (!group) return;
    const buttons = group.querySelectorAll('.toggle-option-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const raw = btn.getAttribute('data-val');
        const val = transformFn ? transformFn(raw) : raw;
        appState.setPatientValue(key, val);
      });
    });
  };

  bindSegmentedGroup('group-sex', 'sex', v => parseInt(v, 10));
  bindSegmentedGroup('group-fbs', 'fasting_blood_sugar_gt_120_mg_per_dl', v => parseInt(v, 10));
  bindSegmentedGroup('group-ekg', 'resting_ekg_results', v => parseInt(v, 10));
  bindSegmentedGroup('group-cp', 'chest_pain_type', v => parseInt(v, 10));
  bindSegmentedGroup('group-angina', 'exercise_induced_angina', v => parseInt(v, 10));
  bindSegmentedGroup('group-slope', 'slope_of_peak_exercise_st_segment', v => parseInt(v, 10));
  bindSegmentedGroup('group-vessels', 'num_major_vessels', v => parseInt(v, 10));
  bindSegmentedGroup('group-thal', 'thal', v => v);
}

function bindPresetArchetypes() {
  const chips = document.querySelectorAll('.preset-chip[data-preset]');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const pid = chip.getAttribute('data-preset');
      if (PRESETS[pid]) {
        appState.setPatient(PRESETS[pid]);
        syncFormWithState();
      }
    });
  });
}

function bindAnalyzeButton() {
  const btn = document.getElementById('btn-analyze-patient');
  if (btn) {
    btn.addEventListener('click', () => {
      analysisWorkflow.runAnalysis();
    });
  }
}

function bindResetButton() {
  const btn = document.getElementById('btn-reset-screening');
  if (btn) {
    btn.addEventListener('click', () => {
      appState.setPatient(DEFAULT_BASELINE);
      appState.resetAnalysis();
      syncFormWithState();
      
      const chips = document.querySelectorAll('.preset-chip[data-preset]');
      chips.forEach(c => c.classList.remove('active'));

      // Feedback toast
      const toast = document.getElementById('validation-toast');
      if (toast) {
        toast.textContent = 'Screening console reset to physiological baseline.';
        toast.classList.add('visible');
        setTimeout(() => toast.classList.remove('visible'), 3000);
      }
    });
  }
}

export function syncFormWithState() {
  const p = appState.getState().patient;

  // Patient ID
  const pidInput = document.getElementById('input-patient-id');
  if (pidInput) pidInput.value = p.patient_id || '';

  // Numeric inputs
  const syncNum = (id, val, formatFn) => {
    const slider = document.getElementById(`input-${id}`);
    const numInput = document.getElementById(`num-${id}`);
    const badge = document.getElementById(`badge-${id}`);
    if (slider) slider.value = val;
    if (numInput) numInput.value = val;
    if (badge) badge.textContent = formatFn ? formatFn(val) : val;
  };

  syncNum('age', p.age, v => `${v} yrs`);
  syncNum('bp', p.resting_blood_pressure, v => `${v} mmHg`);
  syncNum('chol', p.serum_cholesterol_mg_per_dl, v => `${v} mg/dL`);
  syncNum('maxhr', p.max_heart_rate_achieved, v => `${v} bpm`);
  syncNum('oldpeak', p.oldpeak_eq_st_depression, v => `${parseFloat(v).toFixed(1)} mm`);

  // Segmented buttons
  const syncGroup = (groupId, currentVal) => {
    const group = document.getElementById(groupId);
    if (!group) return;
    const buttons = group.querySelectorAll('.toggle-option-btn');
    buttons.forEach(btn => {
      const val = btn.getAttribute('data-val');
      if (String(val) === String(currentVal)) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  };

  syncGroup('group-sex', p.sex);
  syncGroup('group-fbs', p.fasting_blood_sugar_gt_120_mg_per_dl);
  syncGroup('group-ekg', p.resting_ekg_results);
  syncGroup('group-cp', p.chest_pain_type);
  syncGroup('group-angina', p.exercise_induced_angina);
  syncGroup('group-slope', p.slope_of_peak_exercise_st_segment);
  syncGroup('group-vessels', p.num_major_vessels);
  syncGroup('group-thal', p.thal);
}
