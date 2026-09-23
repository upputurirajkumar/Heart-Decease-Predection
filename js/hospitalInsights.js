/**
 * HEARTINTEL - Hospital Recommendations & Clinical Insights Module
 * Source of Truth: PRCP-1016 Notebook Steps 12 & 13
 */

export function initHospitalInsights() {
  const container = document.getElementById('hospital-insights-container');
  if (!container) return;

  const insights = [
    {
      num: '01',
      title: 'Earlier Clinical Screening Protocols',
      category: 'PROJECT RECOMMENDATIONS',
      icon: 'stethoscope',
      summary: 'Embed computational risk stratification at outpatient intake to identify asymptomatic coronary artery disease.',
      notebookFinding: 'In the Cleveland cohort, asymptomatic chest pain (Type 4) presented the highest rate of heart disease (58 of 80 cases), demonstrating that typical angina is frequently absent in advanced ischemia.'
    },
    {
      num: '02',
      title: 'Prioritizing High-Gini Risk Indicators',
      category: 'PROJECT RECOMMENDATIONS',
      icon: 'activity',
      summary: 'Focus clinical workup priority on Thallium nuclear scintigraphy and exercise ST depression before invasive angiography.',
      notebookFinding: 'Thallium perfusion status (13.5% Gini) and ST depression (10.1% Gini) accounted for nearly 25% of all predictive power across 7 evaluated models.'
    },
    {
      num: '03',
      title: 'Lifestyle & Hemodynamic Interventions',
      category: 'PROJECT RECOMMENDATIONS',
      icon: 'heart',
      summary: 'Target modifiable risk factors: systolic blood pressure and serum cholesterol levels through structured lifestyle interventions.',
      notebookFinding: 'Patients with resting BP > 140 mmHg and cholesterol > 240 mg/dL exhibited statistically elevated odds ratios in logistic regression modeling.'
    },
    {
      num: '04',
      title: 'Predictive Decision Support Guardrails',
      category: 'MEDICAL GUIDANCE',
      icon: 'shield',
      summary: 'Use model consensus as secondary verification. Never allow automated systems to deny emergency treatment or bypass physician evaluation.',
      notebookFinding: 'Random Forest achieved 0 false negatives on the holdout test set, but decision-support requires human-in-the-loop validation by licensed clinicians.'
    },
    {
      num: '05',
      title: 'Targeted Stress Testing in High-Risk Cohorts',
      category: 'PROJECT RECOMMENDATIONS',
      icon: 'brain',
      summary: 'Schedule graded treadmill exercise stress testing for patients aged 55+ with chronotropic impairment (peak HR < 130 bpm).',
      notebookFinding: 'Maximum heart rate showed an inverse correlation (r = -0.42) with heart disease presence, identifying exercise capacity as a major protective biomarker.'
    },
    {
      num: '06',
      title: 'Continuous Longitudinal Registry',
      category: 'PROJECT RECOMMENDATIONS',
      icon: 'database',
      summary: 'Establish continuous data collection across cardiology departments to eliminate sampling bias and refine local calibration.',
      notebookFinding: 'The 180-patient Cleveland dataset provides a robust benchmark, but larger institutional cohorts improve generalization across diverse patient demographics.'
    }
  ];

  container.innerHTML = `
    <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap:24px;">
      ${insights.map(item => `
        <div class="metric-card" style="display:flex; flex-direction:column; justify-content:space-between;">
          <div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
              <span class="step-number" style="margin-bottom:0;">PILLAR ${item.num}</span>
              <span class="visual-badge" style="${item.category === 'MEDICAL GUIDANCE' ? 'background:rgba(244,63,94,0.15);color:var(--accent-rose);border-color:rgba(244,63,94,0.3);' : ''}">
                ${item.category}
              </span>
            </div>
            
            <h3 style="font-size:1.15rem; font-weight:800; color:var(--text-primary); margin-bottom:8px;">
              ${item.title}
            </h3>
            
            <p style="font-size:0.85rem; color:var(--text-secondary); line-height:1.55; margin-bottom:14px;">
              ${item.summary}
            </p>
          </div>

          <div style="background:var(--bg-surface); padding:10px 12px; border-radius:var(--radius-sm); border:1px solid var(--border-subtle); font-size:0.75rem; color:var(--text-muted); line-height:1.5;">
            <strong style="color:var(--text-primary);">Notebook Finding:</strong> ${item.notebookFinding}
          </div>
        </div>
      `).join('')}
    </div>
  `;
}
