# CardioPredict AI — Heart Disease Prediction & Risk Stratification System

An interactive cardiovascular clinical diagnostic and risk prediction web application based on the Cleveland Clinic Heart Disease dataset and machine learning research (PRCP-1016).

## Key Features

- **7 Machine Learning Classification Models**:
  - 🏆 **Random Forest Classifier** (Best Model: 91.7% Accuracy, 100% Sensitivity/Recall on positive cases, 0.956 ROC-AUC)
  - **Extra Trees Classifier** (88.9% Accuracy, 100% Recall, 0.950 ROC-AUC)
  - **Gradient Boosting** (86.1% Accuracy, 93.8% Recall, 0.938 ROC-AUC)
  - **K-Nearest Neighbors (KNN)** (86.1% Accuracy, 0.922 ROC-AUC)
  - **Logistic Regression** (83.3% Accuracy, 0.938 ROC-AUC)
  - **Support Vector Machine (SVM)** (80.6% Accuracy, 0.947 ROC-AUC)
  - **Decision Tree** (75.0% Accuracy, 0.756 ROC-AUC)

- **13 Clinical Biomarkers & Diagnostic Features**:
  - Demographics: Age, Biological Sex
  - Vitals & Labs: Resting Blood Pressure (mmHg), Serum Cholesterol (mg/dL), Fasting Blood Sugar > 120 mg/dL
  - Cardiac Electrophysiology: Resting EKG Results (Normal, ST-T Wave Abnormality, Left Ventricular Hypertrophy)
  - Exercise Stress Protocol: Chest Pain Classification (Types 1–4), Max Heart Rate Achieved (bpm), Exercise-Induced Angina, ST Depression (Oldpeak, mm), Slope of Peak Exercise ST Segment (Upsloping, Flat, Downsloping)
  - Advanced Diagnostics: Fluoroscopy Colored Major Vessels (0–3), Thallium Scintigraphy Scan (Normal, Reversible Defect, Fixed Defect)

- **Clinical Decision Support & Risk Analysis**:
  - Real-time Risk Probability Gauge & Triage Category (Low, Moderate, High, Critical)
  - Patient-specific Key Risk Drivers & Feature Contribution Waterfall
  - Multi-Model Consensus Matrix across all 7 algorithms
  - Evidence-based Clinical Management Protocol (AHA / ACC / WHO guidelines)
  - Printable / Exportable Clinical Consultation Summary Report

- **Exploratory Data Analysis (EDA) & Model Benchmarks**:
  - Complete algorithm metrics comparison table (Accuracy, Precision, Recall, F1, ROC-AUC, 5-Fold Cross-Validation)
  - Feature Importance distribution chart matching the Random Forest Gini impurity analysis
  - ROC Curve (AUC = 0.956) and Confusion Matrix with zero false negatives (100% recall)
  - Population cohort statistical distributions (N=180)

- **Batch Cohort Screening Simulator**:
  - Screen multiple patients simultaneously, generate synthetic cases, and export results to CSV.

## Development

```bash
npm install
npm run dev
```

Server runs on `http://0.0.0.0:3000`.
