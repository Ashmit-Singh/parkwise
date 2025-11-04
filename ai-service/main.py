from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any
import numpy as np
from datetime import datetime
import logging

app = FastAPI(title="ParkWise AI Service", version="1.0.0")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class DonorFeatures(BaseModel):
    userId: int
    features: Dict[str, Any]

class EngagementData(BaseModel):
    userId: int
    behaviorHistory: List[Dict[str, Any]]

class ConservationProject(BaseModel):
    projectId: str
    projectData: Dict[str, Any]

class NudgeRequest(BaseModel):
    userId: int
    context: str

class DonorPredictionModel:
    def predict(self, features: Dict[str, Any]) -> Dict[str, float]:
        engagement = features.get('engagementScore', 0.5)
        previous_donations = features.get('previousDonations', 0)
        
        probability = min(0.9, engagement * 0.7 + (previous_donations * 0.1))
        amount = 25.0 + (probability * 50.0)
        
        return {
            'donationProbability': probability,
            'predictedAmount': amount,
            'confidence': 0.75
        }

class EngagementModel:
    def analyze(self, behavior_history: List[Dict[str, Any]]) -> Dict[str, float]:
        if not behavior_history:
            return {'engagementScore': 0.3, 'churnRisk': 0.7}
        
        recent_activity = len([b for b in behavior_history[-10:] if b.get('eventType') == 'page_view'])
        engagement_score = min(0.95, recent_activity * 0.1)
        churn_risk = 1.0 - engagement_score
        
        return {
            'engagementScore': engagement_score,
            'churnRisk': churn_risk
        }

donor_model = DonorPredictionModel()
engagement_model = EngagementModel()

@app.get("/")
async def root():
    return {"message": "ParkWise AI Service", "status": "running"}

@app.post("/predict/donor-behavior")
async def predict_donor_behavior(request: DonorFeatures):
    try:
        prediction = donor_model.predict(request.features)
        
        return {
            "userId": request.userId,
            "donationProbability": prediction['donationProbability'],
            "predictedAmount": prediction['predictedAmount'],
            "confidence": prediction['confidence'],
            "factors": ["engagement_score", "donation_history"],
            "generatedAt": datetime.now().isoformat()
        }
    except Exception as e:
        logger.error(f"Error predicting donor behavior: {e}")
        raise HTTPException(status_code=500, detail="Prediction failed")

@app.post("/analyze/engagement")
async def analyze_engagement(request: EngagementData):
    try:
        analysis = engagement_model.analyze(request.behaviorHistory)
        
        recommended_actions = []
        if analysis['churnRisk'] > 0.7:
            recommended_actions.extend(["send_personalized_email", "show_impact_story"])
        if analysis['engagementScore'] < 0.3:
            recommended_actions.append("offer_incentive")
        
        return {
            "userId": request.userId,
            "engagementScore": analysis['engagementScore'],
            "churnRisk": analysis['churnRisk'],
            "recommendedActions": recommended_actions,
            "generatedAt": datetime.now().isoformat()
        }
    except Exception as e:
        logger.error(f"Error analyzing engagement: {e}")
        raise HTTPException(status_code=500, detail="Analysis failed")

@app.post("/recommend/nudge")
async def recommend_nudge(request: NudgeRequest):
    try:
        nudge_types = ["social_proof", "default_amount", "progress_bar"]
        selected_nudge = np.random.choice(nudge_types)
        
        messages = {
            "social_proof": "Join 1,247 others protecting wildlife",
            "default_amount": "Most people donate $25 to make a difference",
            "progress_bar": "We're 78% of the way to our goal!"
        }
        
        return {
            "nudgeType": selected_nudge,
            "message": messages[selected_nudge],
            "suggestedAmount": 25.0,
            "confidence": 0.8
        }
    except Exception as e:
        logger.error(f"Error recommending nudge: {e}")
        raise HTTPException(status_code=500, detail="Recommendation failed")

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)