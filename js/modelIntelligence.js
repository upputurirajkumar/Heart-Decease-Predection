/**
 * HEARTINTEL - Model Intelligence & Comparison Module
 * Manages the 7-model evaluation suite, accessible cards, and interactive comparisons
 */

import { appState } from './state.js';
import { MODELS_DATA } from './dataset.js';

export function initModelIntelligence() {
  renderModelCards();
  initModelFilterTabs();
  initComparisonSection();
  initTableDelegation();
}

function renderModelCards() {
  const container = document.getElementById('models-grid-container');
  if (!container) return;

  const models = Object.values(MODELS_DATA);

  container.innerHTML = models.map(m => `
    <div class="model-card ${m.isChampion ? 'featured' : ''}" 
         data-model-id="${m.id}" 
         data-family="${m.family.toLowerCase()}"
         tabindex="0"
         role="button"
         aria-label="Inspect ${m.name} model specifications and performance metrics">
      ${m.isChampion ? '<span class="model-champion-badge">Champion Model</span>' : ''}
      <div class="model-category">${m.family}</div>
      <h3 class="model-name">${m.name}</h3>
      <p class="model-desc">${m.tagline}</p>
      
      <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:6px; margin-bottom:14px; text-align:center;">
        <div style="background:var(--bg-surface); padding:6px; border-radius:var(--radius-sm); border:1px solid var(--border-subtle);">
          <div style="font-size:0.65rem; color:var(--text-muted); text-transform:uppercase;">Accuracy</div>
          <div style="font-family:var(--font-mono); font-size:0.88rem; font-weight:800; color:var(--text-primary);">
            ${(m.metrics.accuracy * 100).toFixed(1)}%
          </div>
        </div>
        <div style="background:var(--bg-surface); padding:6px; border-radius:var(--radius-sm); border:1px solid var(--border-subtle);">
          <div style="font-size:0.65rem; color:var(--text-muted); text-transform:uppercase;">Recall</div>
          <div style="font-family:var(--font-mono); font-size:0.88rem; font-weight:800; color:${m.metrics.recall === 1.0 ? 'var(--accent-emerald)' : 'var(--text-primary)'};">
            ${(m.metrics.recall * 100).toFixed(1)}%
          </div>
        </div>
        <div style="background:var(--bg-surface); padding:6px; border-radius:var(--radius-sm); border:1px solid var(--border-subtle);">
          <div style="font-size:0.65rem; color:var(--text-muted); text-transform:uppercase;">ROC-AUC</div>
          <div style="font-family:var(--font-mono); font-size:0.88rem; font-weight:800; color:var(--accent-cyan);">
            ${m.metrics.rocAuc.toFixed(3)}
          </div>
        </div>
      </div>

      <div class="model-traits-row">
        <span class="trait-tag">CV: ${(m.metrics.cvAccuracy * 100).toFixed(1)}%</span>
        <span class="trait-tag">F1: ${(m.metrics.f1Score * 100).toFixed(1)}%</span>
        <span class="btn-inspect-model" style="margin-left:auto; color:var(--accent-blue); font-size:0.75rem; font-weight:700;">
          Inspect Details &rarr;
        </span>
      </div>
    </div>
  `).join('');

  // Wire model clicks and Enter/Space keyboard interactions
  container.querySelectorAll('.model-card').forEach(card => {
    const handleOpen = () => {
      const modelId = card.getAttribute('data-model-id');
      appState.setSelectedModel(modelId);
      openModelModal(modelId);
    };

    card.addEventListener('click', handleOpen);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleOpen();
      }
    });
  });
}

function initModelFilterTabs() {
  const tabs = document.querySelectorAll('.filter-btn[data-filter]');
  const cards = document.querySelectorAll('.model-card');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');
      cards.forEach(card => {
        const family = card.getAttribute('data-family') || '';
        if (filter === 'all') {
          card.style.display = 'flex';
        } else if (filter === 'ensemble' && family.includes('ensemble')) {
          card.style.display = 'flex';
        } else if (filter === 'linear-kernel' && (family.includes('linear') || family.includes('kernel'))) {
          card.style.display = 'flex';
        } else if (filter === 'instance-tree' && (family.includes('instance') || family.includes('tree'))) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

function initComparisonSection() {
  const metricTabs = document.querySelectorAll('.compare-metric-btn');
  const metricNameLabel = document.getElementById('compare-active-metric-name');

  const updateVisualization = (metricKey) => {
    appState.setComparisonMetric(metricKey);
    const metricLabels = {
      accuracy: 'Test Set Accuracy (36 Holdout Cases)',
      precision: 'Precision (True Positives / Predicted Positives)',
      recall: 'Recall / Sensitivity (Zero False Negatives Target)',
      f1Score: 'F1 Score (Harmonic Mean of Precision & Recall)',
      rocAuc: 'ROC-AUC (Area Under Receiver Operating Characteristic)',
      cvAccuracy: '5-Fold Stratified Cross-Validation Accuracy (144 Train Cases)'
    };

    if (metricNameLabel) metricNameLabel.textContent = metricLabels[metricKey] || metricKey;
    renderComparisonChart(metricKey);
    renderComparisonTable();
  };

  metricTabs.forEach(btn => {
    btn.addEventListener('click', () => {
      metricTabs.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const metric = btn.getAttribute('data-metric');
      updateVisualization(metric);
    });
  });

  // Initial render
  updateVisualization('accuracy');
}

function renderComparisonChart(metricKey) {
  const chartSvg = document.getElementById('model-comparison-chart-svg');
  if (!chartSvg) return;

  const models = Object.values(MODELS_DATA).sort((a, b) => b.metrics[metricKey] - a.metrics[metricKey]);

  const height = 280;
  const barHeight = 26;
  const gap = 12;
  const leftMargin = 160;
  const rightMargin = 60;
  const width = chartSvg.clientWidth || 700;
  const maxVal = 1.0;

  chartSvg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  chartSvg.innerHTML = '';

  models.forEach((m, idx) => {
    const val = m.metrics[metricKey];
    const y = idx * (barHeight + gap) + 16;
    const availableWidth = width - leftMargin - rightMargin;
    const barW = Math.max(availableWidth * (val / maxVal), 8);

    // Color
    let barColor = m.isChampion ? '#f59e0b' : '#0ea5e9';
    if (metricKey === 'recall' && val === 1.0) barColor = '#10b981';

    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.setAttribute('style', 'cursor:pointer;');
    group.setAttribute('role', 'button');
    group.setAttribute('tabindex', '0');
    group.setAttribute('aria-label', `${m.name}: ${metricKey === 'rocAuc' ? val.toFixed(3) : (val * 100).toFixed(1) + '%'}`);

    const handleOpen = () => openModelModal(m.id);
    group.addEventListener('click', handleOpen);
    group.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleOpen();
      }
    });

    // Label
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', `${leftMargin - 12}`);
    text.setAttribute('y', `${y + 17}`);
    text.setAttribute('text-anchor', 'end');
    text.setAttribute('fill', m.isChampion ? 'var(--text-primary)' : 'var(--text-secondary)');
    text.setAttribute('font-size', '12');
    text.setAttribute('font-weight', m.isChampion ? '700' : '500');
    text.textContent = m.name.replace(' Classifier', '');
    group.appendChild(text);

    // Track background
    const bgRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    bgRect.setAttribute('x', `${leftMargin}`);
    bgRect.setAttribute('y', `${y}`);
    bgRect.setAttribute('width', `${availableWidth}`);
    bgRect.setAttribute('height', `${barHeight}`);
    bgRect.setAttribute('rx', '4');
    bgRect.setAttribute('fill', 'var(--bg-surface)');
    group.appendChild(bgRect);

    // Active Bar
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', `${leftMargin}`);
    rect.setAttribute('y', `${y}`);
    rect.setAttribute('width', `${barW}`);
    rect.setAttribute('height', `${barHeight}`);
    rect.setAttribute('rx', '4');
    rect.setAttribute('fill', barColor);
    rect.setAttribute('opacity', '0.9');
    group.appendChild(rect);

    // Value label
    const valText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    valText.setAttribute('x', `${leftMargin + barW + 10}`);
    valText.setAttribute('y', `${y + 17}`);
    valText.setAttribute('fill', 'var(--text-primary)');
    valText.setAttribute('font-size', '12');
    valText.setAttribute('font-family', 'var(--font-mono)');
    valText.setAttribute('font-weight', '700');
    valText.textContent = metricKey === 'rocAuc' ? val.toFixed(3) : `${(val * 100).toFixed(1)}%`;
    group.appendChild(valText);

    chartSvg.appendChild(group);
  });
}

function renderComparisonTable() {
  const tbody = document.getElementById('models-matrix-table-body');
  if (!tbody) return;

  const models = Object.values(MODELS_DATA).sort((a, b) => b.metrics.accuracy - a.metrics.accuracy);

  tbody.innerHTML = models.map(m => `
    <tr class="model-table-row" data-model-id="${m.id}" tabindex="0" role="button" aria-label="View ${m.name} specifications">
      <td style="padding:12px 14px; font-weight:700; color:var(--text-primary); display:flex; align-items:center; gap:8px;">
        ${m.name}
        ${m.isChampion ? '<span class="model-champion-badge" style="position:static; padding:2px 6px;">Champion</span>' : ''}
      </td>
      <td style="padding:12px 14px; font-family:var(--font-mono); font-weight:700; color:${m.isChampion ? 'var(--accent-amber)' : 'var(--text-primary)'};">
        ${(m.metrics.accuracy * 100).toFixed(1)}%
      </td>
      <td style="padding:12px 14px; font-family:var(--font-mono);">
        ${(m.metrics.precision * 100).toFixed(1)}%
      </td>
      <td style="padding:12px 14px; font-family:var(--font-mono); font-weight:700; color:${m.metrics.recall === 1.0 ? 'var(--accent-emerald)' : 'var(--text-primary)'};">
        ${(m.metrics.recall * 100).toFixed(1)}%
      </td>
      <td style="padding:12px 14px; font-family:var(--font-mono);">
        ${(m.metrics.f1Score * 100).toFixed(1)}%
      </td>
      <td style="padding:12px 14px; font-family:var(--font-mono); color:var(--accent-cyan); font-weight:700;">
        ${m.metrics.rocAuc.toFixed(3)}
      </td>
      <td style="padding:12px 14px; font-family:var(--font-mono); color:var(--text-secondary);">
        ${(m.metrics.cvAccuracy * 100).toFixed(1)}%
      </td>
    </tr>
  `).join('');
}

function initTableDelegation() {
  const tbody = document.getElementById('models-matrix-table-body');
  if (!tbody) return;

  tbody.addEventListener('click', (e) => {
    const row = e.target.closest('.model-table-row');
    if (!row) return;
    const modelId = row.getAttribute('data-model-id');
    if (modelId) openModelModal(modelId);
  });

  tbody.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      const row = e.target.closest('.model-table-row');
      if (row) {
        e.preventDefault();
        const modelId = row.getAttribute('data-model-id');
        if (modelId) openModelModal(modelId);
      }
    }
  });
}

export function openModelModal(modelId) {
  const m = MODELS_DATA[modelId];
  if (!m) return;

  const modal = document.getElementById('model-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');
  if (!modal || !modalTitle || !modalBody) return;

  modalTitle.textContent = `${m.name} (${m.family})`;

  modalBody.innerHTML = `
    <div style="display:flex; flex-direction:column; gap:20px; font-size:0.88rem; line-height:1.6;">
      
      <!-- Highlight box -->
      <div style="background:var(--bg-surface); padding:16px; border-radius:var(--radius-md); border:1px solid var(--border-subtle);">
        <div style="font-size:0.75rem; font-weight:700; text-transform:uppercase; color:var(--accent-cyan); margin-bottom:4px;">
          Notebook Evaluation Results (36 Test Cases)
        </div>
        <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:10px; margin-top:8px;">
          <div><strong>Accuracy:</strong> ${(m.metrics.accuracy * 100).toFixed(1)}%</div>
          <div><strong>Sensitivity (Recall):</strong> ${(m.metrics.recall * 100).toFixed(1)}%</div>
          <div><strong>ROC-AUC:</strong> ${m.metrics.rocAuc.toFixed(3)}</div>
          <div><strong>Precision:</strong> ${(m.metrics.precision * 100).toFixed(1)}%</div>
          <div><strong>F1 Score:</strong> ${(m.metrics.f1Score * 100).toFixed(1)}%</div>
          <div><strong>5-Fold CV:</strong> ${(m.metrics.cvAccuracy * 100).toFixed(1)}%</div>
        </div>
      </div>

      <!-- Clinical & Mathematical Notes -->
      <div>
        <h4 style="color:var(--text-primary); margin-bottom:6px;">Clinical Interpretation & Findings</h4>
        <p style="color:var(--text-secondary);">${m.clinicalNotes}</p>
      </div>

      <!-- Confusion Matrix Summary -->
      <div>
        <h4 style="color:var(--text-primary); margin-bottom:8px;">Test Confusion Matrix (Holdout Cohort)</h4>
        <div style="display:grid; grid-template-columns: repeat(2, 1fr); gap:8px; max-width:280px; text-align:center;">
          <div style="background:var(--bg-surface); padding:8px; border-radius:var(--radius-sm); border:1px solid var(--border-subtle);">
            <div style="font-size:0.7rem; color:var(--text-muted);">True Neg (TN)</div>
            <div style="font-family:var(--font-mono); font-size:1.1rem; font-weight:800; color:var(--accent-emerald);">${m.confusionMatrix.tn}</div>
          </div>
          <div style="background:var(--bg-surface); padding:8px; border-radius:var(--radius-sm); border:1px solid var(--border-subtle);">
            <div style="font-size:0.7rem; color:var(--text-muted);">False Pos (FP)</div>
            <div style="font-family:var(--font-mono); font-size:1.1rem; font-weight:800; color:var(--accent-amber);">${m.confusionMatrix.fp}</div>
          </div>
          <div style="background:var(--bg-surface); padding:8px; border-radius:var(--radius-sm); border:1px solid var(--border-subtle);">
            <div style="font-size:0.7rem; color:var(--text-muted);">False Neg (FN)</div>
            <div style="font-family:var(--font-mono); font-size:1.1rem; font-weight:800; color:${m.confusionMatrix.fn === 0 ? 'var(--accent-emerald)' : 'var(--accent-rose)'};">${m.confusionMatrix.fn}</div>
          </div>
          <div style="background:var(--bg-surface); padding:8px; border-radius:var(--radius-sm); border:1px solid var(--border-subtle);">
            <div style="font-size:0.7rem; color:var(--text-muted);">True Pos (TP)</div>
            <div style="font-family:var(--font-mono); font-size:1.1rem; font-weight:800; color:var(--accent-emerald);">${m.confusionMatrix.tp}</div>
          </div>
        </div>
      </div>

      <!-- Hyperparameters -->
      <div>
        <h4 style="color:var(--text-primary); margin-bottom:6px;">Hyperparameter Configurations</h4>
        <pre style="background:var(--bg-surface); padding:10px; border-radius:var(--radius-sm); font-family:var(--font-mono); font-size:0.78rem; color:var(--text-secondary); overflow-x:auto;">${JSON.stringify(m.hyperparameters, null, 2)}</pre>
      </div>

    </div>
  `;

  modal.classList.add('open');
  const closeBtn = document.getElementById('modal-close-btn');
  if (closeBtn) closeBtn.focus();
}
