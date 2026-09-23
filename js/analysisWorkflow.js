/**
 * HEARTINTEL - 5-Step Analysis Workflow Module
 * Orchestrates realistic diagnostic processing with telemetry progress
 */

import { appState } from './state.js';
import { validatePatientData } from './validation.js';
import { predictionService } from './predictionService.js';

export class AnalysisWorkflow {
  constructor() {
    this.steps = [
      { num: 1, label: 'STEP 1 // VALIDATING PATIENT DATA', desc: 'Verifying 13 biomarkers against Cleveland clinical ranges...' },
      { num: 2, label: 'STEP 2 // PROCESSING CLINICAL FEATURES', desc: 'Standardizing continuous variables & encoding categorical factors...' },
      { num: 3, label: 'STEP 3 // RUNNING ML INFERENCE', desc: 'Evaluating across 7 classification algorithms (RF, ET, GB, LR, SVM, KNN, DT)...' },
      { num: 4, label: 'STEP 4 // GENERATING RISK STRATIFICATION', desc: 'Aggregating ensemble consensus and extracting primary driver attributions...' },
      { num: 5, label: 'STEP 5 // ANALYSIS COMPLETE', desc: 'Stratified risk assessment generated successfully.' }
    ];

    this.isProcessing = false;
  }

  async runAnalysis() {
    if (this.isProcessing) return;

    const patient = appState.getState().patient;

    // 1. Validate
    const validation = validatePatientData(patient);
    if (!validation.isValid) {
      appState.setValidationErrors(validation.errors);
      this._showValidationAlert(validation.errors);
      return;
    }

    appState.setValidationErrors({});
    this.isProcessing = true;
    this._showProcessingOverlay(true);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const baseDelay = prefersReducedMotion ? 40 : 1;

    try {
      // Step 1: Validating
      this._updateStep(1);
      await this._delay(prefersReducedMotion ? 60 : 280);

      // Step 2: Processing
      this._updateStep(2);
      await this._delay(prefersReducedMotion ? 60 : 340);

      // Step 3: Running ML
      this._updateStep(3);
      const prediction = await predictionService.predict(patient);
      await this._delay(prefersReducedMotion ? 80 : 460);

      // Step 4: Generating Risk Assessment
      this._updateStep(4);
      await this._delay(prefersReducedMotion ? 60 : 340);

      // Step 5: Complete
      this._updateStep(5);
      await this._delay(prefersReducedMotion ? 40 : 240);

      // Commit result
      appState.setAnalysisResult(prediction);

      // Smooth scroll to Patient Intelligence section
      setTimeout(() => {
        this._showProcessingOverlay(false);
        this.isProcessing = false;
        const patientIntelSection = document.getElementById('patient-intelligence');
        if (patientIntelSection) {
          patientIntelSection.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
        }
      }, prefersReducedMotion ? 100 : 300);

    } catch (err) {
      console.error('Analysis workflow failed:', err);
      appState.setAnalysisError(err);
      this._showProcessingOverlay(false);
      this.isProcessing = false;
      const toast = document.getElementById('validation-toast');
      if (toast) {
        toast.textContent = 'Analysis could not be completed. Please check clinical inputs.';
        toast.classList.add('visible');
        setTimeout(() => toast.classList.remove('visible'), 4000);
      }
    }
  }

  _updateStep(stepNum) {
    appState.setAnalyzing(true, stepNum);
    const stepObj = this.steps[stepNum - 1];

    const stepLabel = document.getElementById('workflow-step-label');
    const stepDesc = document.getElementById('workflow-step-desc');
    const stepBar = document.getElementById('workflow-progress-bar');
    const stepPills = document.querySelectorAll('.workflow-step-pill');

    if (stepLabel && stepObj) stepLabel.textContent = stepObj.label;
    if (stepDesc && stepObj) stepDesc.textContent = stepObj.desc;
    if (stepBar) stepBar.style.width = `${(stepNum / 5) * 100}%`;

    stepPills.forEach((pill, idx) => {
      const pNum = idx + 1;
      if (pNum < stepNum) {
        pill.className = 'workflow-step-pill completed';
      } else if (pNum === stepNum) {
        pill.className = 'workflow-step-pill active';
      } else {
        pill.className = 'workflow-step-pill pending';
      }
    });
  }

  _showProcessingOverlay(show) {
    const overlay = document.getElementById('analysis-overlay-modal');
    if (overlay) {
      if (show) {
        overlay.classList.add('open');
      } else {
        overlay.classList.remove('open');
      }
    }
  }

  _showValidationAlert(errors) {
    const errorMessages = Object.values(errors);
    const summary = errorMessages[0] || 'Please verify clinical inputs.';
    
    // Highlight first invalid input
    const firstInvalidField = Object.keys(errors)[0];
    const el = document.getElementById(`input-${firstInvalidField}`);
    if (el) {
      el.focus();
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    const toast = document.getElementById('validation-toast');
    if (toast) {
      toast.textContent = summary;
      toast.classList.add('visible');
      setTimeout(() => toast.classList.remove('visible'), 4000);
    }
  }

  _delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const analysisWorkflow = new AnalysisWorkflow();

