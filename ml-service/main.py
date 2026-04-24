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
        print(f"Model expects {len(features)} features: {features}")
    else:
        print("⚠️  No trained model found. Run train_model.py first.")

class ClaimData(BaseModel):
    policyNumber: str
    claimAmount: float
    incidentType: str
    collisionType: str = "Front Collision"
    incidentSeverity: str = "Major Damage"
    location: str = ""
    age: int = 35
    monthsAsCustomer: int = 12
    insuredSex: str = "MALE"
    insuredEducationLevel: str = "College"
    insuredOccupation: str = "prof-specialty"
    insuredRelationship: str = "not-in-family"
    incidentHourOfTheDay: int = 12
    numberOfVehiclesInvolved: int = 1
    propertyDamage: str = "YES"
    bodilyInjuries: int = 0
    witnesses: int = 0
    policeReportAvailable: str = "YES"
    injuryClaim: float = 0
    propertyClaim: float = 0
    vehicleClaim: float = 0

@app.get("/")
def home():
    return {
        "message": "Guardian AI ML Service is Online",
        "model_loaded": model is not None
    }

@app.post("/analyze")
async def analyze_claim(claim: ClaimData):
    if model is None:
        return {
            "fraudScore": 0.5,
            "isFlagged": False,
            "threshold": 0.4,
            "reason": "No ML model loaded"
        }
    
    try:
        # Map frontend fields to model features
        input_data = {
            'months_as_customer': claim.monthsAsCustomer,
            'age': claim.age,
            'policy_deductable': 1000,
            'policy_annual_premium': 1200,
            'total_claim_amount': claim.claimAmount,
            'injury_claim': claim.injuryClaim or claim.claimAmount * 0.2,
            'property_claim': claim.propertyClaim or claim.claimAmount * 0.3,
            'vehicle_claim': claim.vehicleClaim or claim.claimAmount * 0.5,
            'incident_type': claim.incidentType,
            'collision_type': claim.collisionType,
            'incident_severity': claim.incidentSeverity,
            'insured_sex': claim.insuredSex,
            'insured_education_level': claim.insuredEducationLevel,
            'insured_occupation': claim.insuredOccupation,
            'insured_relationship': claim.insuredRelationship,
            'number_of_vehicles_involved': claim.numberOfVehiclesInvolved,
            'property_damage': claim.propertyDamage,
            'bodily_injuries': claim.bodilyInjuries,
            'witnesses': claim.witnesses,
            'police_report_available': claim.policeReportAvailable
        }
        
        # Encode categorical variables
        for col in label_encoders:
            if col in input_data:
                try:
                    input_data[col] = label_encoders[col].transform([str(input_data[col])])[0]
                except ValueError:
                    input_data[col] = 0
        
        # Create DataFrame with features in correct order
        input_df = pd.DataFrame([input_data])[features]
        
        print(f"\n--- DEBUG: Input values ---")
        for f in features:
            print(f"  {f}: {input_data.get(f, 'MISSING')}")
        
        # Predict
        fraud_probability = model.predict_proba(input_df)[0][1]
        
        print(f"Fraud probability: {fraud_probability:.4f}")
        
        threshold = 0.3
        is_flagged = fraud_probability > threshold
        
        return {
            "fraudScore": round(float(fraud_probability), 2),
            "isFlagged": bool(is_flagged),
            "threshold": threshold,
            "reason": "⚠️ Potential fraud detected" if is_flagged else "✅ Normal pattern - low risk"
        }
    
    except Exception as e:
        print(f"Prediction error: {e}")
        import traceback
        traceback.print_exc()
        return {
            "fraudScore": 0.5,
            "isFlagged": False,
            "reason": f"Error: {str(e)}"
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)