/**
 * HEARTINTEL - Interactive Methodology Module
 * 12-Step Clinical Machine Learning Pipeline Explorer
 */

import { appState } from './state.js';

export function initMethodology() {
  const steps = [
    {
      num: 1,
      title: 'Business Understanding',
      desc: 'Define early cardiac disease risk detection as a binary classification challenge.',
      details: 'Cardiovascular disease remains the leading cause of global mortality. The objective is to build a reliable predictive system to identify cardiac disease risk before acute coronary events, minimizing false negatives.',
      tools: 'Clinical Triage Protocols, Diagnostic Objectives'
    },
    {
      num: 2,
      title: 'Data Collection',
      desc: 'Merged Cleveland Clinic clinical measurements (values.csv) with diagnosis labels (labels.csv).',
      details: 'Merged 180 patient records using unique patient_id strings. Standardized 13 independent clinical features plus binary target heart_disease_present.',
      tools: 'Pandas, CSV parsing, DataFrame concatenation'
    },
    {
      num: 3,
      title: 'Data Understanding',
      desc: 'Inspected feature datatypes, column ranges, and baseline distributions.',
      details: 'Evaluated 6 continuous features (age, BP, cholesterol, max HR, ST depression, vessels) and 7 discrete variables (sex, fasting sugar, resting EKG, chest pain, angina, slope, thal).',
      tools: 'df.info(), df.describe(), df.shape'
    },
    {
      num: 4,
      title: 'Data Cleaning',
      desc: 'Audited for null entries, duplicate records, and outliers.',
      details: 'Confirmed 0 missing values across all 180 rows and 0 duplicate patient identifiers, establishing high dataset completeness.',
      tools: 'df.isnull().sum(), df.duplicated().sum()'
    },
    {
      num: 5,
      title: 'Exploratory Data Analysis (EDA)',
      desc: 'Univariate distributions, bivariate cross-tabulations, and correlation heatmaps.',
      details: 'Identified strong positive correlations between heart disease and Thallium defects (r = +0.52), major vessels (r = +0.46), and ST depression (r = +0.42), and strong inverse correlation with max HR (r = -0.42).',
      tools: 'Matplotlib, Seaborn, Pearson Correlation Matrix'
    },
    {
      num: 6,
      title: 'Feature Engineering',
      desc: 'Encoding categorical strings into machine-readable numeric formats.',
      details: 'Encoded string variables such as thal (normal, reversible_defect, fixed_defect) into distinct categorical labels suitable for distance and tree classifiers.',
      tools: 'One-hot encoding / Label encoding'
    },
    {
      num: 7,
      title: 'Data Preprocessing & Scaling',
      desc: 'Partitioned 80/20 train-test split and applied StandardScaler.',
      details: 'Separated 144 training samples and 36 holdout validation samples using stratified sampling to preserve the 55.6% / 44.4% class ratio. Standardized numerical biomarkers to zero mean and unit variance.',
      tools: 'train_test_split (stratify=y), StandardScaler'
    },
    {
      num: 8,
      title: 'Model Building',
      desc: 'Constructed seven distinct classification algorithms.',
      details: 'Trained Logistic Regression, Decision Tree, Random Forest, K-Nearest Neighbors, Support Vector Machine (RBF), Gradient Boosting, and Extra Trees.',
      tools: 'scikit-learn (ensemble, linear_model, svm, neighbors, tree)'
    },
    {
      num: 9,
      title: 'Hyperparameter Tuning',
      desc: 'GridSearchCV and cross-validation optimization.',
      details: 'Explored tree estimators (n_estimators=100), max_depth bounds, learning rate scheduling in Gradient Boosting, and C regularization parameters in SVM and Logistic Regression.',
      tools: 'GridSearchCV, StratifiedKFold (n_splits=5)'
    },
    {
      num: 10,
      title: 'Model Evaluation',
      desc: 'Comprehensive multi-metric assessment on unseen test cohort.',
      details: 'Evaluated accuracy, precision, recall, F1 score, confusion matrices, and ROC curves. Random Forest achieved 91.7% test accuracy and 100% recall with 0 false negatives.',
      tools: 'classification_report, confusion_matrix, roc_curve, roc_auc_score'
    },
    {
      num: 11,
      title: 'Model Comparison',
      desc: 'Benchmarking ensemble methods vs. linear and kernel architectures.',
      details: 'Ensemble bagging models (Random Forest, Extra Trees) systematically outperformed single trees (75.0%) and linear models (83.3%) in both sensitivity and overall generalization.',
      tools: 'Cross-model benchmark matrix, ROC comparison'
    },
    {
      num: 12,
      title: 'Clinical Translation & Insights',
      desc: 'Synthesizing hospital recommendations and decision-support guardrails.',
      details: 'Formulated 6 healthcare pillars emphasizing earlier asymptomatic screening, high-Gini biomarker prioritization, and strict human-in-the-loop ethical guidelines.',
      tools: 'Clinical Triage Documentation, Ethical AI Framework'
    }
  ];

  const pipelineContainer = document.getElementById('methodology-pipeline-steps');
  const detailsContainer = document.getElementById('methodology-step-detail');
  if (!pipelineContainer || !detailsContainer) return;

  // Render pipeline steps
  pipelineContainer.innerHTML = steps.map((s, idx) => `
    <div class="methodology-step-card ${idx === 0 ? 'active' : ''}" data-step="${s.num}">
      <span class="step-number">PHASE ${s.num < 10 ? '0' + s.num : s.num}</span>
      <h4 class="step-title" style="font-size:0.95rem;">${s.title}</h4>
      <p class="step-desc" style="font-size:0.75rem;">${s.desc}</p>
    </div>
  `).join('');

  const renderDetail = (stepNum) => {
    const s = steps.find(x => x.num === stepNum) || steps[0];
    appState.setMethodologyStep(stepNum);

    pipelineContainer.querySelectorAll('.methodology-step-card').forEach(c => {
      const cNum = parseInt(c.getAttribute('data-step'), 10);
      if (cNum === stepNum) {
        c.style.borderColor = 'var(--accent-cyan)';
        c.style.background = 'rgba(6, 182, 212, 0.08)';
      } else {
        c.style.borderColor = 'var(--border-subtle)';
        c.style.background = 'var(--bg-card)';
      }
    });

    detailsContainer.innerHTML = `
      <div style="background:var(--bg-surface); padding:24px; border-radius:var(--radius-lg); border:1px solid var(--border-subtle);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <span class="section-tag" style="margin-bottom:0;">Phase ${s.num} Rationale</span>
          <span style="font-family:var(--font-mono); font-size:0.75rem; color:var(--text-muted);">${s.tools}</span>
        </div>
        <h3 style="font-size:1.35rem; font-weight:800; color:var(--text-primary); margin-bottom:8px;">
          ${s.title}
        </h3>
        <p style="font-size:0.9rem; color:var(--text-secondary); line-height:1.65; margin-bottom:16px;">
          ${s.details}
        </p>
        <div style="display:flex; gap:8px; align-items:center; font-size:0.78rem; color:var(--accent-cyan);">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <span>Grounded in PRCP-1016 notebook execution logs</span>
        </div>
      </div>
    `;
  };

  pipelineContainer.querySelectorAll('.methodology-step-card').forEach(card => {
    card.addEventListener('click', () => {
      const num = parseInt(card.getAttribute('data-step'), 10);
      renderDetail(num);
    });
  });

  // Initial render
  renderDetail(1);
}
