/**
 * HEARTINTEL - Model Evaluation Module
 * Confusion Matrix, Classification Report, Interactive ROC Curve, Feature Importance
 */

import { appState } from './state.js';
import { MODELS_DATA, FEATURE_IMPORTANCE_DATA } from './dataset.js';

export function initModelEvaluation() {
  initConfusionMatrixSelector();
  initRocCurveCanvas();
  initFeatureImportanceChart();
}

/* ==========================================================================
   1. Confusion Matrix & Classification Report
   ========================================================================== */
function initConfusionMatrixSelector() {
  const selectEl = document.getElementById('cm-model-select');
  if (!selectEl) return;

  // Populate options
  const models = Object.values(MODELS_DATA);
  selectEl.innerHTML = models.map(m => `
    <option value="${m.id}" ${m.id === 'random-forest' ? 'selected' : ''}>
      ${m.name} ${m.isChampion ? '⭐ (Champion)' : ''}
    </option>
  `).join('');

  selectEl.addEventListener('change', (e) => {
    renderConfusionMatrix(e.target.value);
  });

  // Initial render
  renderConfusionMatrix('random-forest');
}

function renderConfusionMatrix(modelId) {
  const m = MODELS_DATA[modelId];
  if (!m) return;

  const cm = m.confusionMatrix;
  const cr = m.classificationReport;

  // Render 2x2 matrix
  const container = document.getElementById('confusion-matrix-display');
  if (container) {
    container.innerHTML = `
      <div class="cm-grid">
        <div class="cm-header-cell"></div>
        <div class="cm-header-cell">PRED: NO DISEASE (0)</div>
        <div class="cm-header-cell">PRED: DISEASE (1)</div>
        
        <div class="cm-row-label">ACTUAL: NO (0)</div>
        <div class="cm-cell tn">
          <div class="cm-val">${cm.tn}</div>
          <div class="cm-tag">True Negative (TN)</div>
          <div class="cm-sub">Specificity: ${(cm.tn / 23 * 100).toFixed(1)}%</div>
        </div>
        <div class="cm-cell fp">
          <div class="cm-val">${cm.fp}</div>
          <div class="cm-tag">False Positive (FP)</div>
          <div class="cm-sub">Type I Error</div>
        </div>

        <div class="cm-row-label">ACTUAL: YES (1)</div>
        <div class="cm-cell fn ${cm.fn === 0 ? 'zero-fn' : ''}">
          <div class="cm-val">${cm.fn}</div>
          <div class="cm-tag">False Negative (FN)</div>
          <div class="cm-sub">${cm.fn === 0 ? 'Zero Missed Cases! 🎉' : 'Type II Error'}</div>
        </div>
        <div class="cm-cell tp">
          <div class="cm-val">${cm.tp}</div>
          <div class="cm-tag">True Positive (TP)</div>
          <div class="cm-sub">Sensitivity: ${(cm.tp / 13 * 100).toFixed(1)}%</div>
        </div>
      </div>
      <div style="font-size:0.75rem; color:var(--text-muted); margin-top:10px; text-align:center;">
        Evaluated on 36 holdout patients (23 Negative / 13 Positive). Total Accuracy: ${(m.metrics.accuracy * 100).toFixed(1)}%
      </div>
    `;
  }

  // Render Classification Report Table
  const crTable = document.getElementById('classification-report-body');
  if (crTable && cr) {
    crTable.innerHTML = `
      <tr>
        <td style="padding:8px 12px; font-weight:700;">Class 0 (No Disease)</td>
        <td style="padding:8px 12px; font-family:var(--font-mono);">${cr.class0.precision.toFixed(3)}</td>
        <td style="padding:8px 12px; font-family:var(--font-mono);">${cr.class0.recall.toFixed(3)}</td>
        <td style="padding:8px 12px; font-family:var(--font-mono);">${cr.class0.f1.toFixed(3)}</td>
        <td style="padding:8px 12px; font-family:var(--font-mono);">${cr.class0.support}</td>
      </tr>
      <tr>
        <td style="padding:8px 12px; font-weight:700; color:var(--accent-rose);">Class 1 (Heart Disease)</td>
        <td style="padding:8px 12px; font-family:var(--font-mono); font-weight:700;">${cr.class1.precision.toFixed(3)}</td>
        <td style="padding:8px 12px; font-family:var(--font-mono); font-weight:700; color:${cr.class1.recall === 1.0 ? 'var(--accent-emerald)' : 'inherit'};">${cr.class1.recall.toFixed(3)}</td>
        <td style="padding:8px 12px; font-family:var(--font-mono); font-weight:700;">${cr.class1.f1.toFixed(3)}</td>
        <td style="padding:8px 12px; font-family:var(--font-mono);">${cr.class1.support}</td>
      </tr>
      <tr style="border-top:1px solid var(--border-medium); font-weight:600; color:var(--text-secondary);">
        <td style="padding:8px 12px;">Macro Average</td>
        <td style="padding:8px 12px; font-family:var(--font-mono);">${cr.macroAvg.precision.toFixed(3)}</td>
        <td style="padding:8px 12px; font-family:var(--font-mono);">${cr.macroAvg.recall.toFixed(3)}</td>
        <td style="padding:8px 12px; font-family:var(--font-mono);">${cr.macroAvg.f1.toFixed(3)}</td>
        <td style="padding:8px 12px; font-family:var(--font-mono);">${cr.macroAvg.support}</td>
      </tr>
      <tr style="font-weight:700; color:var(--text-primary);">
        <td style="padding:8px 12px;">Weighted Average</td>
        <td style="padding:8px 12px; font-family:var(--font-mono);">${cr.weightedAvg.precision.toFixed(3)}</td>
        <td style="padding:8px 12px; font-family:var(--font-mono);">${cr.weightedAvg.recall.toFixed(3)}</td>
        <td style="padding:8px 12px; font-family:var(--font-mono);">${cr.weightedAvg.f1.toFixed(3)}</td>
        <td style="padding:8px 12px; font-family:var(--font-mono);">${cr.weightedAvg.support}</td>
      </tr>
    `;
  }
}

/* ==========================================================================
   2. Interactive 2D ROC Curve Canvas (Theme-Aware)
   ========================================================================== */
function initRocCurveCanvas() {
  const canvas = document.getElementById('roc-curve-canvas');
  if (!canvas || !canvas.parentElement) return;
  const ctx = canvas.getContext('2d');

  function drawRoc() {
    const w = canvas.parentElement.clientWidth || 480;
    const h = 320;
    canvas.width = w;
    canvas.height = h;

    const padLeft = 44;
    const padBottom = 34;
    const padTop = 16;
    const padRight = 16;
    const plotW = w - padLeft - padRight;
    const plotH = h - padTop - padBottom;

    const isLight = document.documentElement.getAttribute('data-theme') === 'light';

    // Theme-sensitive Background & Grid
    ctx.fillStyle = isLight ? '#f8fafc' : '#0b1120';
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = isLight ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padTop + (plotH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padLeft, y);
      ctx.lineTo(w - padRight, y);
      ctx.stroke();

      const x = padLeft + (plotW / 4) * i;
      ctx.beginPath();
      ctx.moveTo(x, padTop);
      ctx.lineTo(x, h - padBottom);
      ctx.stroke();

      // Axis labels
      ctx.fillStyle = isLight ? '#64748b' : '#94a3b8';
      ctx.font = '10px monospace';
      ctx.textAlign = 'right';
      ctx.fillText((1 - i * 0.25).toFixed(2), padLeft - 6, y + 3);

      ctx.textAlign = 'center';
      ctx.fillText((i * 0.25).toFixed(2), x, h - padBottom + 16);
    }

    // Diagonal random classifier line
    ctx.beginPath();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = isLight ? '#94a3b8' : '#64748b';
    ctx.moveTo(padLeft, h - padBottom);
    ctx.lineTo(w - padRight, padTop);
    ctx.stroke();
    ctx.setLineDash([]);

    // Plot curves
    const colors = {
      'random-forest': '#f59e0b',
      'svm': '#8b5cf6',
      'gradient-boosting': '#0ea5e9',
      'extra-trees': '#06b6d4',
      'knn': '#10b981',
      'logistic-regression': isLight ? '#475569' : '#e2e8f0',
      'decision-tree': '#f43f5e'
    };

    Object.values(MODELS_DATA).forEach(m => {
      const pts = m.rocCurve;
      if (!pts || !pts.length) return;

      ctx.beginPath();
      ctx.strokeStyle = colors[m.id] || (isLight ? '#334155' : '#ffffff');
      ctx.lineWidth = m.isChampion ? 2.8 : 1.8;
      ctx.lineJoin = 'round';

      pts.forEach((pt, idx) => {
        const x = padLeft + pt.fpr * plotW;
        const y = padTop + (1 - pt.tpr) * plotH;
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    });
  }

  drawRoc();
  window.addEventListener('resize', drawRoc, { passive: true });
  window.addEventListener('themechange', drawRoc);
}

/* ==========================================================================
   3. Feature Importance Horizontal Bar Chart
   ========================================================================== */
function initFeatureImportanceChart() {
  const container = document.getElementById('feature-importance-list');
  if (!container) return;

  const maxImp = Math.max(...FEATURE_IMPORTANCE_DATA.map(f => f.importance));

  container.innerHTML = FEATURE_IMPORTANCE_DATA.map(f => {
    const pct = (f.importance * 100).toFixed(1);
    const barWidth = (f.importance / maxImp) * 100;

    let barColor = 'var(--accent-blue)';
    if (f.rank <= 2) barColor = 'var(--accent-rose)';
    else if (f.rank <= 5) barColor = 'var(--accent-cyan)';

    return `
      <div class="fi-row" style="margin-bottom:12px;">
        <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.82rem; margin-bottom:4px;">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-family:var(--font-mono); font-size:0.7rem; font-weight:700; color:var(--text-muted); width:24px;">#${f.rank}</span>
            <strong style="color:var(--text-primary);">${f.name}</strong>
            <span style="font-size:0.7rem; color:var(--text-muted); font-family:var(--font-mono);">(${f.feature})</span>
          </div>
          <div style="font-family:var(--font-mono); font-weight:800; color:var(--text-primary);">${pct}%</div>
        </div>
        <div class="corr-bar-track" style="height:10px;">
          <div class="corr-bar-fill" style="width:${barWidth}%; background:${barColor};"></div>
        </div>
      </div>
    `;
  }).join('');
}
