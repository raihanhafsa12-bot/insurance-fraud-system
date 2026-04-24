import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, precision_score, recall_score, classification_report
import joblib
import os

print("Loading dataset...")
df = pd.read_csv('data/insurance_claims.csv')

# Clean column names (remove leading/trailing spaces)
df.columns = df.columns.str.strip()

# Convert fraud_reported to binary (Y=1, N=0)
df['fraud_reported'] = df['fraud_reported'].map({'Y': 1, 'N': 0})

# Select features we have in our Claim model
features = ['months_as_customer', 'age', 'policy_deductable', 'policy_annual_premium',
            'total_claim_amount', 'injury_claim', 'property_claim', 'vehicle_claim',
            'incident_type', 'collision_type', 'incident_severity', 
            'insured_sex', 'insured_education_level', 'insured_occupation',
            'insured_relationship', 'number_of_vehicles_involved',
            'property_damage', 'bodily_injuries', 'witnesses', 'police_report_available']

# Prepare data
df_clean = df[features + ['fraud_reported']].copy()

# Handle '?' values - replace with NaN and fill
df_clean = df_clean.replace('?', np.nan)

# Fill numeric columns with median
numeric_cols = ['months_as_customer', 'age', 'policy_deductable', 'policy_annual_premium',
                'total_claim_amount', 'injury_claim', 'property_claim', 'vehicle_claim',
                'number_of_vehicles_involved']
for col in numeric_cols:
    df_clean[col] = pd.to_numeric(df_clean[col], errors='coerce')
    df_clean[col] = df_clean[col].fillna(df_clean[col].median())

# Fill categorical columns with mode
categorical_cols = ['incident_type', 'collision_type', 'incident_severity', 
                    'insured_sex', 'insured_education_level', 'insured_occupation',
                    'insured_relationship', 'property_damage', 'bodily_injuries',
                    'witnesses', 'police_report_available']
for col in categorical_cols:
    df_clean[col] = df_clean[col].fillna(df_clean[col].mode()[0] if len(df_clean[col].mode()) > 0 else 'Unknown')

# Encode categorical variables
label_encoders = {}
for col in categorical_cols:
    le = LabelEncoder()
    df_clean[col] = le.fit_transform(df_clean[col].astype(str))
    label_encoders[col] = le

# Split features and target
X = df_clean[features]
y = df_clean['fraud_reported']

# Split into train and test sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

print(f"Training samples: {len(X_train)}")
print(f"Test samples: {len(X_test)}")

# Train Random Forest model
print("\nTraining Random Forest Classifier...")
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Make predictions
y_pred = model.predict(X_test)

# Evaluate
print("\n" + "="*50)
print("MODEL PERFORMANCE")
print("="*50)
print(f"Accuracy:  {accuracy_score(y_test, y_pred):.4f}")
print(f"Precision: {precision_score(y_test, y_pred):.4f}")
print(f"Recall:    {recall_score(y_test, y_pred):.4f}")
print("\nClassification Report:")
print(classification_report(y_test, y_pred, target_names=['Genuine', 'Fraudulent']))

# Save the model and encoders
os.makedirs('models', exist_ok=True)
joblib.dump(model, 'models/fraud_model.pkl')
joblib.dump(label_encoders, 'models/label_encoders.pkl')
joblib.dump(features, 'models/features.pkl')

print("\n✅ Model saved to models/fraud_model.pkl")
print("✅ Encoders saved to models/label_encoders.pkl")