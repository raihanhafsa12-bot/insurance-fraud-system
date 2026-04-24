from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import joblib
import pandas as pd
import numpy as np
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model and encoders at startup
model = None
label_encoders = None
features = None

@app.on_event("startup")
async def load_model():
    global model, label_encoders, features
    model_path = os.path.join("models", "fraud_model.pkl")
    encoders_path = os.path.join("models", "label_encoders.pkl")
    features_path = os.path.join("models", "features.pkl")
    
    if os.path.exists(model_path):
        model = joblib.load(model_path)
        label_encoders = joblib.load(encoders_path)
        features = joblib.load(features_path)
        print("✅ ML Model loaded successfully")
    else:
        print("⚠️  No trained model found. Run train_model.py first.")

class ClaimData(BaseModel):
    policyNumber: str
    claimAmount: float
    incidentType: str
    location: str

@app.get("/")
def home():
    return {
        "message": "Guardian AI ML Service is Online",
        "model_loaded": model is not None
    }

@app.post("/analyze")
async def analyze_claim(claim: ClaimData):
    if model is None:
        # Fallback to rules-based if no model trained
        score = 0.1
        if claim.claimAmount > 10000:
            score += 0.4
        if claim.incidentType == "Theft":
            score += 0.2
        score += __import__('random').uniform(0, 0.3)
        final_score = min(score, 1.0)
        is_flagged = final_score > 0.7
        return {
            "fraudScore": round(final_score, 2),
            "isFlagged": is_flagged,
            "reason": "Rules-based fallback (no ML model loaded)" if is_flagged else "Normal pattern"
        }
    
    try:
        # Prepare input for the model with default values for missing fields
        input_data = {
            'months_as_customer': 12,  # default
            'age': 35,                  # default
            'policy_deductable': 1000,  # default
            'policy_annual_premium': 1200,  # default
            'total_claim_amount': claim.claimAmount,
            'injury_claim': claim.claimAmount * 0.3,
            'property_claim': claim.claimAmount * 0.3,
            'vehicle_claim': claim.claimAmount * 0.4,
            'incident_type': claim.incidentType,
            'collision_type': 'Front Collision',
            'incident_severity': 'Major Damage',
            'insured_sex': 'MALE',
            'insured_education_level': 'College',
            'insured_occupation': 'prof-specialty',
            'insured_relationship': 'not-in-family',
            'number_of_vehicles_involved': 1,
            'property_damage': 'YES',
            'bodily_injuries': 1,
            'witnesses': 1,
            'police_report_available': 'YES'
        }
        
        # Encode categorical variables
        for col in label_encoders:
            if col in input_data:
                try:
                    input_data[col] = label_encoders[col].transform([str(input_data[col])])[0]
                except ValueError:
                    # If value not seen in training, use the first class
                    input_data[col] = 0
        
        # Create DataFrame with features in correct order
        input_df = pd.DataFrame([input_data])[features]
        
        # Predict
        fraud_probability = model.predict_proba(input_df)[0][1]  # probability of fraud
        is_flagged = fraud_probability > 0.5
        
        return {
            "fraudScore": round(float(fraud_probability), 2),
            "isFlagged": bool(is_flagged),
            "reason": "ML model prediction" if is_flagged else "ML model prediction - normal pattern"
        }
    
    except Exception as e:
        print(f"Prediction error: {e}")
        return {
            "fraudScore": 0.5,
            "isFlagged": False,
            "reason": f"Error in prediction: {str(e)}"
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)