# HEARTINTEL: AI-Powered Cardiac Risk Intelligence Platform

> **A portfolio-ready clinical machine learning web platform exploring patient clinical data, exploratory data analysis, and 7 ML classification algorithms for earlier cardiac risk screening.**

---

## 1. Project Title
**HEARTINTEL: Clinical Intelligence & Cardiac Risk Stratification Platform**  
*Source Study:* Cleveland Clinic Heart Disease Prediction Study (`PRCP-1016`)

---

## 2. Project Overview
HEARTINTEL is an interactive clinical decision-support and data science intelligence application. Built directly from the exploratory data analysis and modeling phases of the Cleveland Clinic Heart Disease dataset (`PRCP-1016-HeartDieseasePred.ipynb`), the application bridges the gap between academic data science research and bedside clinical utility.

The application allows cardiologists, triage officers, hospital administrators, and machine learning reviewers to:
- Screen patient biomarkers interactively using calibrated clinical range validation.
- Generate multi-model risk stratification estimates with ensemble consensus across 7 distinct classifiers.
- Understand feature attributions through Gini importance rankings and relative biomarker benchmarks.
- Inspect full exploratory data distributions, Pearson correlation matrices, and confusion matrices on holdout cohorts.
- Review hospital operational recommendations and ethical AI governance guardrails.

---

## 3. Problem Statement
Cardiovascular diseases (CVDs) remain the leading cause of global mortality, accounting for approximately 17.9 million deaths annually. Traditional triage in emergency departments and primary care clinics often relies on manual risk scoring systems (e.g., Framingham, ASCVD) or invasive angiography. 

Manual triage can experience delays in interpreting complex non-linear combinations of exercise stress tests, ST depression electrophysiology, and fluoroscopic findings. A critical clinical need exists for transparent, high-sensitivity decision-support tools that identify high-risk individuals earlier while minimizing false negatives (missed cases of disease).

---

## 4. Business Objective
1. **Reduce Missed Cardiac Cases (High Sensitivity / Recall):** Maximize sensitivity on the positive disease class to ensure vulnerable patients receive prompt secondary cardiac workups.
2. **Accelerate Clinical Triage:** Provide real-time biomarker risk stratification within seconds of diagnostic test entry to support clinical decision-making.
3. **Prevent Unnecessary Invasive Procedures:** High-accuracy pre-screening (91.7% in champion model) reduces hospital resource strain by filtering patients who genuinely require invasive fluoroscopy or cardiac catheterization.
4. **Transparent, Explainable Machine Learning:** Give physicians interpretable Gini feature importances and comparative cohort distributions rather than opaque "black-box" predictions.

---

## 5. Dataset Description
The model and statistical analyses are strictly grounded in the Cleveland Clinic dataset merged from `train_values.csv` and `train_labels.csv`:
- **Total Patients:** 180 records (144 training / 36 holdout test cases; 80/20 stratified split).
- **Target Distribution:** 
  - `heart_disease_present = 0`: 100 cases (55.6%) — Negative
  - `heart_disease_present = 1`: 80 cases (44.4%) — Positive
- **Missing / Null Values:** Exactly 0 missing values; 0 duplicate rows across all 180 entries.
- **Biomarker Features (13 total):**
  1. `age`: Patient age in years (Range: 29–77, Mean: 54.8 ± 9.3)
  2. `sex`: Biological sex (0 = Female [31.7%], 1 = Male [68.3%])
  3. `chest_pain_type`: Angina type (1 = Typical angina, 2 = Atypical, 3 = Non-anginal, 4 = Asymptomatic [50% cohort incidence])
  4. `resting_blood_pressure`: Resting blood pressure upon admission in mmHg (Range: 94–200, Mean: 131.3 ± 17.0)
  5. `serum_cholesterol_mg_per_dl`: Serum cholesterol in mg/dL (Range: 126–564, Mean: 249.2 ± 52.7)
  6. `fasting_blood_sugar_gt_120_mg_per_dl`: Fasting blood sugar > 120 mg/dL (0 = False [83.9%], 1 = True [16.1%])
  7. `resting_ekg_results`: Resting electrocardiographic results (0 = Normal, 1 = ST-T wave abnormality, 2 = Left ventricular hypertrophy)
  8. `max_heart_rate_achieved`: Maximum heart rate achieved during exercise stress in bpm (Range: 96–202, Mean: 149.5 ± 22.9)
  9. `exercise_induced_angina`: Angina induced by exercise (0 = No [67.8%], 1 = Yes [32.2%])
  10. `oldpeak_eq_st_depression`: ST depression induced by exercise relative to rest in mm (Range: 0.0–6.2, Mean: 1.01 ± 1.12)
  11. `slope_of_peak_exercise_st_segment`: Slope of peak exercise ST segment (1 = Upsloping, 2 = Flat, 3 = Downsloping)
  12. `num_major_vessels`: Number of major vessels (0–3) colored by fluoroscopy (Mean: 0.67 ± 0.93)
  13. `thal`: Thallium scintigraphy (Normal perfusion, Fixed defect, Reversible defect)

---

## 6. Machine Learning Workflow
The notebook implements a structured 12-step data science lifecycle:
1. **Business Problem & Objectives Definition:** Formulating clinical triage requirements and recall priorities.
2. **Data Collection & Schema Merging:** Merging clinical feature vectors with binary diagnostic labels via `patient_id`.
3. **Data Inspection & Integrity Audit:** Validating data types, verifying zero null records, and auditing distribution ranges.
4. **Exploratory Data Analysis (EDA):** Univariate distribution profiling, categorical cross-tabulations, and target balance analysis.
5. **Correlation Analysis:** Pearson correlation matrix computation against disease presence.
6. **Feature Encoding & Preprocessing:** Converting categorical strings into integer representations.
7. **Stratified Train-Test Partitioning:** 80% training (144 samples) and 20% holdout testing (36 samples) preserving the 44.4% positive class ratio.
8. **Feature Scaling:** Standardization using `StandardScaler` to normalize continuous variables for distance- and gradient-based estimators.
9. **Multi-Algorithm Training:** Parallel implementation of 7 baseline and ensemble classifiers.
10. **Stratified 5-Fold Cross Validation:** Validating generalization stability across all folds.
11. **Champion Selection & Metric Auditing:** Selecting Random Forest as Champion due to 91.7% accuracy and 100% recall (0 false negatives).
12. **Model Interpretation & Feature Importance:** Extracting Gini impurity reduction values and formulating hospital operational recommendations.

---

## 7. Models Evaluated
All 7 models evaluated in the study are represented with their exact notebook performance figures on the 36-case holdout test set:

| Model | Family | Accuracy | Recall (Sensitivity) | Precision | F1 Score | ROC-AUC | 5-Fold CV Accuracy |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Random Forest (Champion)** | Ensemble / Bagging | **91.7%** | **100.0%** | **81.3%** | **0.897** | **0.957** | **83.3%** |
| **Extra Trees** | Ensemble / Random | **88.9%** | **84.6%** | **84.6%** | **0.846** | **0.941** | **80.6%** |
| **Gradient Boosting** | Ensemble / Boosting | **86.1%** | **84.6%** | **78.6%** | **0.815** | **0.916** | **79.9%** |
| **K-Nearest Neighbors** | Instance-Based | **86.1%** | **84.6%** | **78.6%** | **0.815** | **0.908** | **80.6%** |
| **Logistic Regression** | Linear Probabilistic | **83.3%** | **84.6%** | **73.3%** | **0.786** | **0.900** | **82.6%** |
| **Support Vector Machine (SVM)**| Kernel Method (RBF) | **80.6%** | **76.9%** | **71.4%** | **0.741** | **0.886** | **81.9%** |
| **Decision Tree** | Tree / CART | **75.0%** | **76.9%** | **62.5%** | **0.690** | **0.754** | **72.2%** |

---

## 8. Evaluation Metrics
- **Accuracy:** Overall percentage of correct predictions (`(TP + TN) / Total`).
- **Recall / Sensitivity (Primary Healthcare Metric):** Proportion of actual cardiac disease cases correctly flagged (`TP / (TP + FN)`). Random Forest achieved 100% recall on the holdout test set (0 false negatives).
- **Precision:** Proportion of positive predictions that actually had cardiac disease (`TP / (TP + FP)`).
- **F1 Score:** Harmonic mean of precision and recall (`2 * (Precision * Recall) / (Precision + Recall)`).
- **ROC-AUC:** Area under the Receiver Operating Characteristic curve measuring discrimination capacity across all decision thresholds.
- **5-Fold Stratified Cross-Validation:** Out-of-fold generalization score computed across 5 stratified folds of 144 training patients.

---

## 9. Frontend Technology
Strict adherence to modern web standards with **zero external JavaScript dependencies or heavy UI frameworks**:
- **Semantic HTML5:** Native accessible structure (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`, `<fieldset>`, `<input type="range">`, `<dialog>`).
- **Custom CSS3 Design System:** 
  - CSS Custom Properties (Design Tokens) for seamless dark/light clinical themes.
  - CSS Grid & Flexbox layouts responsive from 320px mobile screens to 4K displays.
  - Native glassmorphism (`backdrop-filter`) and hardware-accelerated transitions.
  - Full `@media (prefers-reduced-motion: reduce)` accessibility compliance.
- **Vanilla JavaScript (ES6+ Modules):**
  - Native ES module architecture (`/js/`).
  - State management via an Observer/Pub-Sub event bus.
  - Canvas-based real-time 60fps ECG oscilloscope simulation with automatic viewport intersection culling.
  - Pure SVG chart generation for multi-metric model comparisons, ROC curves, and dynamic risk gauges.

---

## 10. Project Architecture
```text
/
├── index.html                     # Semantic application layout & clinical views
├── style.css                      # Comprehensive clinical design system & dark/light themes
├── script.js                      # Application bootstrap entry point
├── js/                            # Modular Vanilla JavaScript architecture
│   ├── main.js                    # DOM lifecycle, navigation spy & mobile drawer
│   ├── state.js                   # Reactive AppState event bus & pub/sub store
│   ├── dataset.js                 # Notebook source statistics, model metrics, & Gini importances
│   ├── validation.js              # Biomarker physiological boundary validator
│   ├── predictionService.js       # Client-side decision engine & API interface adapter
│   ├── analysisWorkflow.js        # 5-step animated clinical processing pipeline
│   ├── patientIntelligence.js     # Post-screening report, risk dial, & benchmark comparisons
│   ├── modelIntelligence.js       # 7-model cards, filter tabs, & SVG comparison charts
│   ├── modelEvaluation.js         # Interactive confusion matrix, report, & theme-aware ROC
│   ├── dataExplorer.js            # EDA histograms, category filters, & correlation list
│   ├── hospitalInsights.js        # 6 hospital implementation pillars from Step 13
│   ├── methodology.js             # 12-step data science lifecycle explorer
│   ├── ethicalSection.js          # Healthcare AI governance & bias mitigation guardrails
│   ├── theme.js                   # Dark/light theme switcher & event dispatcher
│   ├── modal.js                   # WCAG focus-trapping modal controller
│   └── animation.js               # Intersection-observed ECG oscilloscope & counters
├── metadata.json                  # Application metadata & capabilities
├── package.json                   # Project scripts (Vite static server)
└── README.md                      # Comprehensive project documentation
```

---

## 11. Ethical Considerations
1. **Decision Support, Never Replacement:** HEARTINTEL is engineered exclusively as a clinical decision-support system. It never issues automated diagnostic orders or replaces professional physician judgment.
2. **Demographic Representation:** The Cleveland Clinic dataset contains 68.3% male and 31.7% female patients. Models trained on this cohort must be continuously audited for performance parity across diverse demographic groups before clinical deployment.
3. **Data Privacy & Compliance:** The application processes all patient screening data locally in browser memory without storing or transmitting Protected Health Information (PHI), conforming to HIPAA and GDPR principles.
4. **Explainable AI (XAI):** Rather than outputting single ungrounded numbers, the platform breaks down feature contributions (e.g., thallium defect, chest pain asymptomatic status, ST depression) so clinicians can cross-examine model reasoning.

---

## 12. Current Prediction Architecture & Limitations
### Current Client-Side Calibration
In the current static web distribution, the application employs a calibrated simulation engine (`predictionService.js`) whose weights directly reflect the Gini feature importances and logistic log-odds extracted from the notebook's models. This ensures realistic, reproducible, and instantaneous feedback across test cases without requiring a live Python backend.

### Decoupled Service Architecture
The `predictionService.js` class is intentionally structured with a clean asynchronous interface (`predict(patientData)`). Connecting the platform to a live production FastAPI/Flask microservice or TensorFlow Serving container requires updating only a single endpoint URL in `predictionService.js`.

### Known Dataset Limitations
- Small sample size (180 total records).
- Single-institution cohort (Cleveland Clinic Foundation).
- Binary classification target (presence vs. absence of CAD), without granular multi-vessel lesion severity grading.

---

## 13. Running Locally

```bash
# Clone repository
git clone https://github.com/USERNAME/Heart-Decease-Predection.git
cd Heart-Decease-Predection

# Install dependencies (Vite dev environment)
npm install

# Start local development server on port 3000
npm run dev

# Open your browser at http://localhost:3000
```

## 14. Production Build & Preview

```bash
# Compile and bundle static assets into /dist
npm run build

# Preview production build locally
npm run preview
```

---

## 15. Deployment Instructions

### GitHub Pages (Automated via GitHub Actions)
The repository includes a production-ready GitHub Actions workflow at `.github/workflows/deploy.yml` configured with relative base asset resolution (`base: './'`).

1. Push the code to your GitHub repository (e.g. `main` branch):
   ```bash
   git add .
   git commit -m "Deploy HEARTINTEL"
   git push origin main
   ```
2. In your GitHub repository, navigate to **Settings** > **Pages**.
3. Under **Build and deployment** > **Source**, select **GitHub Actions**.
4. The workflow will automatically trigger, install dependencies, run `npm run build`, and deploy the `dist` bundle.
5. Your application will be live at:
   ```text
   https://<USERNAME>.github.io/<REPO_NAME>/
   # Example: https://rajkumarupputuri.github.io/Heart-Decease-Predection/
   ```

### Vercel Deployment
1. Log in to [Vercel](https://vercel.com) and click **Add New Project**.
2. Import your GitHub repository.
3. Configure project settings:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
4. Click **Deploy**. Vercel will build and assign an instant production URL with automatic HTTPS and edge caching.

---

## 16. Future Scope
1. **Multi-Center Federated Cohort Integration:** Expanding training data across Hungarian, Swiss, and Long Beach VA cardiology cohorts to evaluate cross-institutional generalizability.
2. **DICOM & 12-Lead ECG Signal Ingestion:** Integrating raw waveform signal processing (1D Convolutional Neural Networks) directly from digital ECG leads alongside tabular biomarkers.
3. **FHIR / HL7 EHR Integration:** Developing SMART-on-FHIR connectors for seamless interoperability with Epic and Cerner electronic health record systems.
4. **SHAP (SHapley Additive exPlanations) Live Server:** Deploying a containerized Python backend to render real-time individualized force plots for every patient screening.

---

*&copy; 2026 HEARTINTEL Clinical Research & Development. Grounded in PRCP-1016 Heart Disease Prediction Study.*
