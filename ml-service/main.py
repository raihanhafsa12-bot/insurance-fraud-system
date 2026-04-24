from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import random

app = FastAPI()

# Allow connections from your Node.js backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define what a Claim looks like for Python
class ClaimData(BaseModel):
    policyNumber: str
    claimAmount: float
    incidentType: str
    location: str

@app.get("/")
def home():
    return {"message": "Guardian AI ML Service is Online"}

@app.post("/analyze")
async def analyze_claim(claim: ClaimData):
    # --- Simple Fraud Logic (The "AI" Brain) ---
    score = 0.1  # Base risk
    
    # Red Flag 1: High Amount
    if claim.claimAmount > 10000:
        score += 0.4
    
    # Red Flag 2: Specific Incident Types
    if claim.incidentType == "Theft":
        score += 0.2
        
    # Red Flag 3: Random "Suspicion" Factor (Simulating complex patterns)
    score += random.uniform(0, 0.3)
    
    # Cap the score at 1.0 (100%)
    final_score = min(score, 1.0)
    
    # Determine if it should be flagged
    is_flagged = final_score > 0.7

    return {
        "fraudScore": round(final_score, 2),
        "isFlagged": is_flagged,
        "reason": "High amount and incident pattern" if is_flagged else "Normal pattern"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)