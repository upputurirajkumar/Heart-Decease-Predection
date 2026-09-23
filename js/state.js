/**
 * HEARTINTEL - Centralized Application State Management & Pub/Sub Event Bus
 * Single authoritative source of truth for all clinical and predictive states.
 */

class StateStore {
  constructor() {
    this.state = {
      // 1. Patient Biomarkers (13 clinical features from Cleveland Clinic dataset)
      patient: {
        patient_id: 'PT-0Z64UN',
        age: 67,
        sex: 1, // 1 = Male, 0 = Female
        resting_blood_pressure: 160,
        serum_cholesterol_mg_per_dl: 286,
        fasting_blood_sugar_gt_120_mg_per_dl: 0,
        resting_ekg_results: 2, // 0 = Normal, 1 = ST-T, 2 = LVH
        chest_pain_type: 4, // 1 = Typ, 2 = Atyp, 3 = Non-Anginal, 4 = Asymptomatic
        max_heart_rate_achieved: 108,
        exercise_induced_angina: 1, // 1 = Yes, 0 = No
        oldpeak_eq_st_depression: 2.6,
        slope_of_peak_exercise_st_segment: 2, // 1 = Upsloping, 2 = Flat, 3 = Downsloping
        num_major_vessels: 3, // 0 to 3
        thal: 'reversible_defect' // 'normal', 'reversible_defect', 'fixed_defect'
      },

      // 2. Authoritative Lifecycle & Risk Stratification State
      analysisStatus: 'idle', // 'idle' | 'validating' | 'analyzing' | 'complete' | 'error'
      analysisStep: 0,        // 0 = idle, 1..5 = workflow steps
      riskScore: null,        // Valid Integer: 0 to 100 (e.g. 87)
      riskLevel: null,        // Valid String: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL'
      prediction: null,       // Authoritative result object
      validationErrors: {},

      // 3. UI Navigation & Exploration States
      selectedModelId: 'random-forest',
      selectedComparisonMetric: 'accuracy',
      selectedEdaFeature: 'age',
      edaFilterCategory: 'all', // 'all', 'disease', 'noDisease'
      methodologyStep: 1
    };

    this.listeners = new Map();
  }

  getState() {
    return this.state;
  }

  setPatientValue(key, value) {
    this.state.patient[key] = value;
    this.emit('patient:change', { key, value, patient: this.state.patient });
  }

  setPatient(patientObj) {
    this.state.patient = { ...this.state.patient, ...patientObj };
    this.emit('patient:change', { patient: this.state.patient });
  }

  setValidationErrors(errors) {
    this.state.validationErrors = errors || {};
    this.emit('validation:change', this.state.validationErrors);
  }

  setAnalyzing(isAnalyzing, step = 0) {
    if (isAnalyzing) {
      this.state.analysisStatus = step === 1 ? 'validating' : 'analyzing';
      this.state.analysisStep = step;
    } else {
      this.state.analysisStatus = 'idle';
      this.state.analysisStep = 0;
    }
    this.emit('analysis:step', { 
      isAnalyzing, 
      step, 
      status: this.state.analysisStatus 
    });
  }

  setAnalysisResult(result) {
    if (!result) return;
    this.state.analysisStatus = 'complete';
    this.state.prediction = result;
    
    // Set normalized single source of truth risk score & level
    this.state.riskScore = typeof result.riskScore === 'number' 
      ? result.riskScore 
      : (typeof result.riskPercentage === 'number' ? result.riskPercentage : null);
    
    this.state.riskLevel = result.riskLevel || (result.riskTier ? result.riskTier.toUpperCase() : null);

    this.emit('analysis:complete', result);
  }

  setAnalysisError(error) {
    this.state.analysisStatus = 'error';
    this.state.analysisStep = 0;
    this.state.riskScore = null;
    this.state.riskLevel = null;
    this.state.prediction = null;
    this.emit('analysis:error', error);
  }

  resetAnalysis() {
    this.state.analysisStatus = 'idle';
    this.state.analysisStep = 0;
    this.state.riskScore = null;
    this.state.riskLevel = null;
    this.state.prediction = null;
    this.state.validationErrors = {};
    this.emit('analysis:reset');
  }

  setSelectedModel(modelId) {
    this.state.selectedModelId = modelId;
    this.emit('model:select', modelId);
  }

  setComparisonMetric(metric) {
    this.state.selectedComparisonMetric = metric;
    this.emit('comparison:metric', metric);
  }

  setSelectedEdaFeature(feature) {
    this.state.selectedEdaFeature = feature;
    this.emit('eda:feature', feature);
  }

  setEdaFilterCategory(cat) {
    this.state.edaFilterCategory = cat;
    this.emit('eda:filter', cat);
  }

  setMethodologyStep(stepNum) {
    this.state.methodologyStep = stepNum;
    this.emit('methodology:step', stepNum);
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
    return () => {
      const arr = this.listeners.get(event) || [];
      const idx = arr.indexOf(callback);
      if (idx !== -1) arr.splice(idx, 1);
    };
  }

  emit(event, payload) {
    const arr = this.listeners.get(event) || [];
    arr.forEach(fn => {
      try {
        fn(payload);
      } catch (err) {
        console.error(`Error in state event listener for "${event}":`, err);
      }
    });
  }
}

export const appState = new StateStore();
