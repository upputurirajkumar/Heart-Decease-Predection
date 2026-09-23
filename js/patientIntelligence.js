/**
 * HEARTINTEL - Patient Intelligence Module
 * Dynamic post-screening visualization comparing patient values with dataset benchmarks
 */

import { appState } from './state.js';
import { CLINICAL_FEATURES_INFO } from './dataset.js';

export function initPatientIntelligence() {
  const container = document.getElementById('patient-intelligence-content');
  if (!container) return;

  // Render initial empty / awaiting state
  renderAwaitingState(container);

  // Subscribe to analysis completion
  appState.on('analysis:complete', (result) => {
    renderAnalyzedReport(container, result);
  });

  // Subscribe to reset
  appState.on('analysis:reset', () => {
    renderAwaitingState(container);
  });
}

function renderAwaitingState(container) {
  container.innerHTML = `
    <div class="empty-state-card">
      <div class="empty-state-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      </div>
      <h3 style="font-size:1.35rem; font-weight:800; margin-bottom:8px; color:var(--text-primary);">
        No Patient Analysis Yet
      </h3>
      <p style="font-size:0.92rem; color:var(--text-secondary); max-width:540px; margin-bottom:24px; line-height:1.6;">
        Submit patient biomarkers via the screening console or load a verified Cleveland Clinic archetype above to generate a comprehensive multi-model risk stratification report.
      </p>
      <div style="display:flex; gap:12px; flex-wrap:wrap; justify-content:center;">
        <a href="#screen-patient" class="btn-primary">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <span>Go to Screening Console</span>
        </a>
      </div>
    </div>
  `;
}

function renderAnalyzedReport(container, result) {
  const patient = appState.getState().patient;
  if (!result) return;

  const score = typeof result.riskScore === 'number' ? result.riskScore : (typeof result.riskPercentage === 'number' ? result.riskPercentage : 50);
  const tier = (result.riskTier || (result.riskLevel ? result.riskLevel.toLowerCase() : 'moderate'));
  const tierLabel = result.riskTierLabel || (result.riskLevel ? `${result.riskLevel} Risk Stratification` : 'Moderate Risk');

  // Color selection based on risk tier
  let tierColor = '#10b981'; // emerald
  let tierBg = 'rgba(16, 185, 129, 0.15)';
  let tierBorder = 'rgba(16, 185, 129, 0.3)';
  if (tier === 'critical') {
    tierColor = '#e11d48'; // crimson
    tierBg = 'rgba(225, 29, 72, 0.18)';
    tierBorder = 'rgba(225, 29, 72, 0.4)';
  } else if (tier === 'high') {
    tierColor = '#f43f5e'; // rose
    tierBg = 'rgba(244, 63, 94, 0.15)';
    tierBorder = 'rgba(244, 63, 94, 0.3)';
  } else if (tier === 'moderate') {
    tierColor = '#f59e0b'; // amber
    tierBg = 'rgba(245, 158, 11, 0.15)';
    tierBorder = 'rgba(245, 158, 11, 0.3)';
  }

  // Calculate comparisons with dataset averages
  const diffAge = (patient.age - CLINICAL_FEATURES_INFO.age.mean).toFixed(1);
  const diffBP = (patient.resting_blood_pressure - CLINICAL_FEATURES_INFO.resting_blood_pressure.mean).toFixed(1);
  const diffChol = (patient.serum_cholesterol_mg_per_dl - CLINICAL_FEATURES_INFO.serum_cholesterol_mg_per_dl.mean).toFixed(1);
  const diffHR = (patient.max_heart_rate_achieved - CLINICAL_FEATURES_INFO.max_heart_rate_achieved.mean).toFixed(1);
  const diffOldpeak = (patient.oldpeak_eq_st_depression - CLINICAL_FEATURES_INFO.oldpeak_eq_st_depression.mean).toFixed(2);

  // SVG circle circumference
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  container.innerHTML = `
    <!-- Patient Intelligence Dashboard -->
    <div style="display:flex; flex-direction:column; gap:32px;">
      
      <!-- Top Patient Identity Banner -->
      <div class="patient-intel-banner">
        <div class="patient-id-badge">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
          </svg>
          <strong>${result.patientId}</strong>
        </div>
        <div class="patient-meta-pill">
          <span>${patient.age} Yrs</span>
          <span>&bull;</span>
          <span>${patient.sex === 1 ? 'Male' : 'Female'}</span>
          <span>&bull;</span>
          <span>BP: ${patient.resting_blood_pressure} mmHg</span>
          <span>&bull;</span>
          <span>Chol: ${patient.serum_cholesterol_mg_per_dl} mg/dL</span>
        </div>
        <div style="font-family:var(--font-mono); font-size:0.75rem; color:var(--text-muted); margin-left:auto;">
          ANALYZED: ${new Date().toLocaleTimeString()}
        </div>
      </div>

      <!-- Core Risk Output & Consensus Card -->
      <div class="screening-grid">
        <!-- Circular Risk Gauge Card -->
        <div class="metric-card" style="display:flex; flex-direction:column; align-items:center; text-align:center; padding:36px;">
          <span class="section-tag" style="margin-bottom:12px;">Model-Based Risk Estimate</span>
          
          <div class="risk-dial-container" style="margin:16px 0;">
            <svg class="risk-svg-wrap" viewBox="0 0 190 190">
              <circle class="risk-circle-bg" cx="95" cy="95" r="80"></circle>
              <circle class="risk-circle-val" cx="95" cy="95" r="80"
                style="stroke:${tierColor}; stroke-dasharray:${circumference}; stroke-dashoffset:${offset};">
              </circle>
            </svg>
            <div class="risk-dial-text">
              <div class="risk-dial-percent" style="color:${tierColor};">${score}%</div>
              <div class="risk-dial-tier" style="background:${tierBg}; color:${tierColor}; border:1px solid ${tierBorder};">
                ${tierLabel}
              </div>
            </div>
          </div>

          <div style="font-size:0.8rem; color:var(--text-secondary); max-width:320px; margin-top:12px;">
            Probability calibrated against the 13 clinical biomarkers from the Cleveland Clinic dataset.
          </div>

          <!-- Prominent Decision Support Notice -->
          <div class="clinical-notice-box" style="margin-top:20px; width:100%; text-align:left;">
            <strong style="color:var(--text-primary); display:block; margin-bottom:4px;">
              ⚠️ Decision-Support Only. Not a Medical Diagnosis.
            </strong>
            This estimate assists earlier clinical risk stratification and should never supersede physician diagnosis, ECG interpretation, or formal coronary imaging.
          </div>
        </div>

        <!-- Consensus & Driver Card -->
        <div class="metric-card" style="display:flex; flex-direction:column; justify-content:space-between; padding:32px;">
          <div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
              <span class="section-tag" style="margin-bottom:0;">Multi-Model Consensus</span>
              <span style="font-family:var(--font-mono); font-size:0.8rem; font-weight:700; color:var(--text-primary);">
                ${result.consensus.positiveCount} / ${result.consensus.totalModels} Classifiers
              </span>
            </div>
            
            <p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:16px;">
              ${result.consensus.consensusLabel} at the standard 0.50 probability threshold.
            </p>

            <!-- Consensus Progress Bar -->
            <div class="consensus-bar-track" style="height:10px; margin-bottom:24px;">
              <div class="consensus-bar-fill" style="width:${result.consensus.percentage}%; background:linear-gradient(90deg, #10b981, ${tierColor});"></div>
            </div>

            <!-- Model Votes Breakdown -->
            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap:8px; margin-bottom:24px;">
              ${Object.values(result.modelPredictions).map(m => `
                <div style="background:var(--bg-surface); padding:8px 10px; border-radius:var(--radius-sm); border:1px solid var(--border-subtle); font-size:0.75rem;">
                  <div style="font-weight:700; color:var(--text-primary); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                    ${m.name.split(' ')[0]}
                  </div>
                  <div style="display:flex; justify-content:space-between; margin-top:4px;">
                    <span style="color:var(--text-muted);">${m.percentage}%</span>
                    <span style="font-weight:700; color:${m.isPositive ? 'var(--accent-rose)' : 'var(--accent-emerald)'};">
                      ${m.isPositive ? 'POSITIVE' : 'NEGATIVE'}
                    </span>
                  </div>
                </div>
              `).join('')}
            </div>

            <!-- Primary Feature Drivers -->
            <div style="font-size:0.78rem; font-weight:700; text-transform:uppercase; letter-spacing:0.06em; color:var(--text-muted); margin-bottom:10px;">
              Primary Explanatory Drivers
            </div>
            <ul class="driver-list">
              ${result.drivers.map(d => `
                <li class="driver-item ${d.impact === 'protective' ? 'safe' : ''}">
                  <div>
                    <strong>${d.name}:</strong> ${d.value}
                    <div style="font-size:0.72rem; color:var(--text-muted); margin-top:2px;">${d.detail}</div>
                  </div>
                  <span class="visual-badge" style="${d.impact === 'protective' ? 'background:rgba(16,185,129,0.15);color:#10b981;border-color:rgba(16,185,129,0.3);' : 'background:rgba(244,63,94,0.15);color:#f43f5e;border-color:rgba(244,63,94,0.3);'}">
                    ${d.impact === 'protective' ? 'Protective' : 'Elevated'}
                  </span>
                </li>
              `).join('')}
            </ul>
          </div>
        </div>
      </div>

      <!-- Clinical Indicator Dynamic Comparison Cards (Comparing with Dataset Means) -->
      <div>
        <h3 style="font-size:1.25rem; font-weight:800; color:var(--text-primary); margin-bottom:18px;">
          Clinical Indicators vs. Dataset Benchmarks
        </h3>
        <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap:18px;">
          
          <!-- Card: Age -->
          <div class="metric-card">
            <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
              <span class="node-label">DEMOGRAPHICS</span>
              <span class="visual-badge">Age</span>
            </div>
            <div style="font-family:var(--font-mono); font-size:1.5rem; font-weight:800; color:var(--text-primary); margin-bottom:4px;">
              ${patient.age} yrs
            </div>
            <div style="font-size:0.78rem; color:var(--text-secondary);">
              Dataset Mean: <strong>54.8 yrs</strong> (${diffAge >= 0 ? '+' : ''}${diffAge} yrs)
            </div>
          </div>

          <!-- Card: Blood Pressure -->
          <div class="metric-card">
            <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
              <span class="node-label">HEMODYNAMICS</span>
              <span class="visual-badge">Resting BP</span>
            </div>
            <div style="font-family:var(--font-mono); font-size:1.5rem; font-weight:800; color:var(--text-primary); margin-bottom:4px;">
              ${patient.resting_blood_pressure} mmHg
            </div>
            <div style="font-size:0.78rem; color:var(--text-secondary);">
              Dataset Mean: <strong>131.3 mmHg</strong> (${diffBP >= 0 ? '+' : ''}${diffBP} mmHg)
            </div>
          </div>

          <!-- Card: Serum Cholesterol -->
          <div class="metric-card">
            <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
              <span class="node-label">LIPID PROFILE</span>
              <span class="visual-badge">Cholesterol</span>
            </div>
            <div style="font-family:var(--font-mono); font-size:1.5rem; font-weight:800; color:var(--text-primary); margin-bottom:4px;">
              ${patient.serum_cholesterol_mg_per_dl} mg/dL
            </div>
            <div style="font-size:0.78rem; color:var(--text-secondary);">
              Dataset Mean: <strong>249.2 mg/dL</strong> (${diffChol >= 0 ? '+' : ''}${diffChol} mg/dL)
            </div>
          </div>

          <!-- Card: Max Heart Rate -->
          <div class="metric-card">
            <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
              <span class="node-label">EXERCISE CAPACITY</span>
              <span class="visual-badge">Max HR</span>
            </div>
            <div style="font-family:var(--font-mono); font-size:1.5rem; font-weight:800; color:var(--text-primary); margin-bottom:4px;">
              ${patient.max_heart_rate_achieved} bpm
            </div>
            <div style="font-size:0.78rem; color:var(--text-secondary);">
              Dataset Mean: <strong>149.5 bpm</strong> (${diffHR >= 0 ? '+' : ''}${diffHR} bpm)
            </div>
          </div>

          <!-- Card: ST Depression -->
          <div class="metric-card">
            <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
              <span class="node-label">ELECTROPHYSIOLOGY</span>
              <span class="visual-badge">ST Depression</span>
            </div>
            <div style="font-family:var(--font-mono); font-size:1.5rem; font-weight:800; color:var(--text-primary); margin-bottom:4px;">
              ${patient.oldpeak_eq_st_depression} mm
            </div>
            <div style="font-size:0.78rem; color:var(--text-secondary);">
              Dataset Mean: <strong>1.01 mm</strong> (${diffOldpeak >= 0 ? '+' : ''}${diffOldpeak} mm)
            </div>
          </div>

          <!-- Card: Exercise Angina -->
          <div class="metric-card">
            <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
              <span class="node-label">STRESS SYMPTOM</span>
              <span class="visual-badge">Ex. Angina</span>
            </div>
            <div style="font-family:var(--font-mono); font-size:1.35rem; font-weight:800; color:var(--text-primary); margin-bottom:4px;">
              ${patient.exercise_induced_angina === 1 ? 'Present (Yes)' : 'Absent (No)'}
            </div>
            <div style="font-size:0.78rem; color:var(--text-secondary);">
              Dataset Cohort Incidence: <strong>32.2%</strong>
            </div>
          </div>

          <!-- Card: Thallium Scintigraphy -->
          <div class="metric-card">
            <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
              <span class="node-label">NUCLEAR SCINTIGRAPHY</span>
              <span class="visual-badge">Thal</span>
            </div>
            <div style="font-family:var(--font-mono); font-size:1.2rem; font-weight:800; color:var(--text-primary); margin-bottom:4px;">
              ${patient.thal === 'reversible_defect' ? 'Reversible Defect' : (patient.thal === 'fixed_defect' ? 'Fixed Defect' : 'Normal Perfusion')}
            </div>
            <div style="font-size:0.78rem; color:var(--text-secondary);">
              Top Predictive Feature (13.5% Gini Importance)
            </div>
          </div>

          <!-- Card: Major Vessels -->
          <div class="metric-card">
            <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
              <span class="node-label">FLUOROSCOPY</span>
              <span class="visual-badge">Vessels</span>
            </div>
            <div style="font-family:var(--font-mono); font-size:1.5rem; font-weight:800; color:var(--text-primary); margin-bottom:4px;">
              ${patient.num_major_vessels} Vessels
            </div>
            <div style="font-size:0.78rem; color:var(--text-secondary);">
              Dataset Mean: <strong>0.67 vessels</strong> (60% have 0 vessels)
            </div>
          </div>
        </div>
      </div>

    </div>
  `;
}
