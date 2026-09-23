/**
 * HEARTINTEL - Ethical AI & Clinical Guardrails Module
 */

export function initEthicalSection() {
  const container = document.getElementById('ethical-section-content');
  if (!container) return;

  const ethicalPillars = [
    {
      title: 'Human-in-the-Loop Decision Support',
      icon: 'stethoscope',
      text: 'HEARTINTEL is strictly an assistive screening and decision-support system. It cannot and must not replace licensed medical practitioners, board-certified cardiologists, or clinical judgment.'
    },
    {
      title: 'Patient Privacy & Data Confidentiality',
      icon: 'shield',
      text: 'All patient telemetry, demographic markers, and stress test readings must strictly adhere to HIPAA and GDPR regulations. The platform processes all simulated patient vectors locally with zero unauthorized transmission.'
    },
    {
      title: 'Demographic Bias & Representation Awareness',
      icon: 'user',
      text: 'The Cleveland Clinic training cohort exhibits a 69% male distribution. Clinical teams must be vigilant regarding sex-specific differences in ischemic presentation, such as microvascular disease in female patients.'
    },
    {
      title: 'Explainable AI & Algorithmic Transparency',
      icon: 'brain',
      text: 'To avoid "black box" hazards in acute healthcare, HEARTINTEL pairs every risk score with underlying feature attribution (e.g. Thallium defects, ST depression mm) and multi-model consensus.'
    }
  ];

  container.innerHTML = `
    <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:20px; margin-top:24px;">
      ${ethicalPillars.map(p => `
        <div class="metric-card" style="border-left: 3px solid var(--accent-cyan);">
          <h4 style="font-size:1.05rem; font-weight:800; color:var(--text-primary); margin-bottom:8px;">
            ${p.title}
          </h4>
          <p style="font-size:0.85rem; color:var(--text-secondary); line-height:1.6;">
            ${p.text}
          </p>
        </div>
      `).join('')}
    </div>
  `;
}
