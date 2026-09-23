/**
 * HEARTINTEL - Interactive Data Explorer & EDA Module
 * Grounded in the 180 Cleveland Clinic merged records
 */

import { appState } from './state.js';
import { DATASET_STATS, CLINICAL_FEATURES_INFO, EDA_DISTRIBUTIONS, CORRELATION_DATA } from './dataset.js';

export function initDataExplorer() {
  initFeatureSelector();
  initEdaCategoryFilters();
  initCorrelationMatrix();
  renderDatasetSummaryCards();
  renderFeatureDistribution();
}

function renderDatasetSummaryCards() {
  const container = document.getElementById('dataset-intel-summary-cards');
  if (!container) return;

  container.innerHTML = `
    <div class="metric-card">
      <div class="node-label">COHORT VOLUME</div>
      <div style="font-family:var(--font-mono); font-size:1.6rem; font-weight:800; color:var(--text-primary); margin:4px 0;">
        ${DATASET_STATS.totalRows} Patients
      </div>
      <div style="font-size:0.75rem; color:var(--text-secondary);">
        144 Train (80%) / 36 Holdout Test (20%)
      </div>
    </div>

    <div class="metric-card">
      <div class="node-label">DATA INTEGRITY</div>
      <div style="font-family:var(--font-mono); font-size:1.6rem; font-weight:800; color:var(--accent-emerald); margin:4px 0;">
        0 Missing
      </div>
      <div style="font-size:0.75rem; color:var(--text-secondary);">
        Zero null entries; 0 duplicate patient records
      </div>
    </div>

    <div class="metric-card">
      <div class="node-label">CLINICAL FEATURES</div>
      <div style="font-family:var(--font-mono); font-size:1.6rem; font-weight:800; color:var(--accent-cyan); margin:4px 0;">
        13 Biomarkers
      </div>
      <div style="font-size:0.75rem; color:var(--text-secondary);">
        6 continuous + 7 discrete/categorical
      </div>
    </div>

    <div class="metric-card">
      <div class="node-label">TARGET BALANCE</div>
      <div style="font-family:var(--font-mono); font-size:1.6rem; font-weight:800; color:var(--text-primary); margin:4px 0;">
        55.6% vs 44.4%
      </div>
      <div style="font-size:0.75rem; color:var(--text-secondary);">
        100 No Disease / 80 Disease Present
      </div>
    </div>
  `;
}

function initFeatureSelector() {
  const select = document.getElementById('eda-feature-select');
  if (!select) return;

  const features = Object.keys(EDA_DISTRIBUTIONS);
  select.innerHTML = features.map(key => {
    const info = CLINICAL_FEATURES_INFO[key];
    return `<option value="${key}">${info ? info.name : key}</option>`;
  }).join('');

  select.addEventListener('change', (e) => {
    appState.setSelectedEdaFeature(e.target.value);
    renderFeatureDistribution();
  });
}

function initEdaCategoryFilters() {
  const buttons = document.querySelectorAll('.eda-filter-btn[data-cat]');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-cat');
      appState.setEdaFilterCategory(cat);
      renderFeatureDistribution();
    });
  });
}

function renderFeatureDistribution() {
  const featureKey = appState.getState().selectedEdaFeature;
  const filterCat = appState.getState().edaFilterCategory;
  const dist = EDA_DISTRIBUTIONS[featureKey];
  const info = CLINICAL_FEATURES_INFO[featureKey];
  const chartEl = document.getElementById('eda-distribution-chart');
  const statsEl = document.getElementById('eda-feature-stats');

  if (!dist || !chartEl) return;

  // Select appropriate bin values based on category filter
  let values = dist.all;
  let barColor = '#0ea5e9';
  if (filterCat === 'disease') {
    values = dist.disease;
    barColor = '#f43f5e';
  } else if (filterCat === 'noDisease') {
    values = dist.noDisease;
    barColor = '#10b981';
  }

  const maxVal = Math.max(...values, 1);

  // Render SVG Histogram / Bar chart
  chartEl.innerHTML = `
    <div style="display:flex; align-items:flex-end; gap:16px; height:200px; padding:20px 10px 10px 10px; background:var(--bg-surface); border-radius:var(--radius-md); border:1px solid var(--border-subtle); margin-top:12px;">
      ${dist.bins.map((bin, i) => {
        const count = values[i] || 0;
        const pctHeight = (count / maxVal) * 100;
        return `
          <div style="flex:1; display:flex; flex-direction:column; align-items:center; height:100%; justify-content:flex-end;">
            <span style="font-family:var(--font-mono); font-size:0.75rem; font-weight:700; color:var(--text-primary); margin-bottom:4px;">
              ${count}
            </span>
            <div style="width:100%; height:${pctHeight}%; background:${barColor}; border-radius:4px 4px 0 0; min-height:4px; transition:height 0.4s ease; opacity:0.85;"></div>
            <span style="font-size:0.72rem; color:var(--text-muted); margin-top:8px; text-align:center; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:90px;" title="${bin}">
              ${bin}
            </span>
          </div>
        `;
      }).join('')}
    </div>
  `;

  // Render feature stats
  if (statsEl && info) {
    statsEl.innerHTML = `
      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(110px, 1fr)); gap:10px; margin-top:14px;">
        <div style="background:var(--bg-surface); padding:8px 12px; border-radius:var(--radius-sm); border:1px solid var(--border-subtle);">
          <div style="font-size:0.68rem; color:var(--text-muted); text-transform:uppercase;">Type</div>
          <div style="font-size:0.82rem; font-weight:700; color:var(--text-primary); text-transform:capitalize;">${info.type}</div>
        </div>
        ${info.mean !== undefined ? `
          <div style="background:var(--bg-surface); padding:8px 12px; border-radius:var(--radius-sm); border:1px solid var(--border-subtle);">
            <div style="font-size:0.68rem; color:var(--text-muted); text-transform:uppercase;">Mean</div>
            <div style="font-family:var(--font-mono); font-size:0.82rem; font-weight:700; color:var(--text-primary);">${info.mean} ${info.unit}</div>
          </div>
        ` : ''}
        ${info.std !== undefined ? `
          <div style="background:var(--bg-surface); padding:8px 12px; border-radius:var(--radius-sm); border:1px solid var(--border-subtle);">
            <div style="font-size:0.68rem; color:var(--text-muted); text-transform:uppercase;">Std Dev</div>
            <div style="font-family:var(--font-mono); font-size:0.82rem; font-weight:700; color:var(--text-primary);">&plusmn;${info.std}</div>
          </div>
        ` : ''}
        ${info.min !== undefined ? `
          <div style="background:var(--bg-surface); padding:8px 12px; border-radius:var(--radius-sm); border:1px solid var(--border-subtle);">
            <div style="font-size:0.68rem; color:var(--text-muted); text-transform:uppercase;">Observed Range</div>
            <div style="font-family:var(--font-mono); font-size:0.82rem; font-weight:700; color:var(--text-primary);">${info.min} - ${info.max}</div>
          </div>
        ` : ''}
      </div>
      <p style="font-size:0.8rem; color:var(--text-secondary); margin-top:10px; line-height:1.5;">
        ${info.description}
      </p>
    `;
  }
}

function initCorrelationMatrix() {
  const container = document.getElementById('full-correlation-list');
  if (!container) return;

  container.innerHTML = CORRELATION_DATA.map(item => {
    const isNeg = item.r < 0;
    const absR = Math.abs(item.r);
    const barWidth = absR * 100;
    const barColor = isNeg ? 'var(--accent-rose)' : 'var(--accent-cyan)';

    return `
      <div class="correlation-row" style="margin-bottom:8px;">
        <span class="corr-name" style="min-width:160px; font-size:0.82rem;">${item.name}</span>
        <div class="corr-bar-track" style="height:8px;">
          <div class="corr-bar-fill" style="width:${barWidth}%; background:${barColor};"></div>
        </div>
        <span class="corr-val" style="font-family:var(--font-mono); font-weight:700; color:${isNeg ? 'var(--accent-rose)' : 'var(--text-primary)'};">
          ${item.r > 0 ? '+' : ''}${item.r.toFixed(2)}
        </span>
      </div>
    `;
  }).join('');
}
