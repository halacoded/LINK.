# LINK. – AI-Powered Customer Retention Platform for Telecoms

**LINK.** is a full-stack customer intelligence web platform designed to help telecom operators take action on behavioral insights, predict customer dissatisfaction, and improve retention. This project was developed during **Huawei x Kuwait University Internship Program Summer 2025** and is inspired by Huawei's **SmartCare** solution.

<div align="center">
  <img src="src/assets/ReadmePG/demo1.gif" alt="LINK Demo" />
</div>


## Supervisors

- **Supervisor Trainee:** Dr. Essam Alruqobah  
- **Supervisor Engineer:** Eng. Ali Alsairafi  
- **Supervisor Huawei Site:** Eng. Rahaf Alhasan


## Machine Learning

LINK. is built to interface with a Python-based churn prediction model trained on IBM’s public Telco Customer Churn dataset. The model uses classification techniques (Logistic Regression, XGBoost) with telecom-inspired feature engineering:

- Custom Metrics:  
  - **KQI**: Key Quality Indicators  
  - **SQM**: Service Quality Metrics  
  - **NPM**: Network Performance Metrics

- ML Stack:  
  - scikit-learn, XGBoost, Optuna (hyperparameter tuning)  
  - Performance metrics: Accuracy, Recall, F1-score

ML Repo: [View Machine Learning Model on GitHub](https://github.com/halacoded/Churn-Prediction-Model-Based-on-Huawei-SmartCare) 

## Backend

The backend of **LINK.** is built with **Node.js**, **Express**, and **MongoDB Atlas**. It powers user authentication, stores prediction data, and integrates with the machine learning model for churn classification.

 BK Repo: [View Backend on GitHub](https://github.com/halacoded/LINK-Backend)

### Features

- Churn prediction integration via REST API  
- OAuth authentication with Google & GitHub  
- MongoDB Atlas for user and prediction data  
- Express routes for handling core platform logic

## Tech Stack

| Layer        | Technology                           |
|--------------|----------------------------------------|
| Frontend     | React.js                              |
| Backend      | Node.js + Express                     |
| Database     | MongoDB                               |
| Design Tools | Figma for UI/UX                       |
| Styling      | Tailwind CSS / CSS Modules            |
| API Layer    | REST endpoints for model results      |
| Deployment   | Netlify                               |


