"""
ParkWise AI Insights Pipeline
FastAPI microservice for predictive analytics and geo-impact scoring
"""

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict
import pandas as pd
import numpy as np
from sklearn.cluster import KMeans
from sklearn.ensemble import RandomForestClassifier, GradientBoostingRegressor
from sklearn.preprocessing import StandardScaler
import joblib
import psycopg2
from psycopg2.extras import RealDictCursor
from geopy.distance import geodesic
import os
from datetime import datetime, timedelta

app = FastAPI(title="ParkWise AI Pipeline", version="2.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database connection
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:password@localhost/parkwise")

# Models cache
models_cache = {}

# Pydantic Models
class DonorFeatures(BaseModel):
    user_id: int
    total_donations: float
    donation_count: int
    avg_donation: float
    days_since_last: int
    preferred_category: Optional[str] = None

class GeoImpactRequest(BaseModel):
    project_id: int
    latitude: float
    longitude: float
    area_hectares: float
    species_count: int
    has_sensors: bool

class PredictiveSegmentRequest(BaseModel):
    lookback_days: int = 90
    min_donations: int = 1

class ImpactVerification(BaseModel):
    project_id: int
    latitude: float
    longitude: float
    evidence_url: str
    species_observed: List[str]

# ============================
# Database Functions
# ============================

def get_db_connection():
    """Get PostgreSQL connection"""
    return psycopg2.connect(DATABASE_URL, cursor_factory=RealDictCursor)

def fetch_donor_data(lookback_days: int = 90):
    """Fetch donor data for analysis"""
    conn = get_db_connection()
    query = f"""
        SELECT 
            user_id,
            COUNT(*) as donation_count,
            SUM(amount) as total_donations,
            AVG(amount) as avg_donation,
            MAX(created_at) as last_donation_date,
            EXTRACT(EPOCH FROM (NOW() - MAX(created_at)))/86400 as days_since_last
        FROM blockchain_transactions
        WHERE created_at >= NOW() - INTERVAL '{lookback_days} days'
        GROUP BY user_id
        HAVING COUNT(*) >= 1
    """
    df = pd.read_sql(query, conn)
    conn.close()
    return df

def fetch_project_data():
    """Fetch project data for geo-impact analysis"""
    conn = get_db_connection()
    query = """
        SELECT 
            gp.id,
            gp.name,
            ST_X(gp.location::geometry) as longitude,
            ST_Y(gp.location::geometry) as latitude,
            gp.species_count,
            gp.area_size,
            gp.has_sensor_network,
            COUNT(DISTINCT bt.id) as donation_count,
            COALESCE(SUM(bt.amount), 0) as total_funds
        FROM geo_projects gp
        LEFT JOIN blockchain_transactions bt ON bt.campaign_id = gp.id
        GROUP BY gp.id, gp.name, gp.location, gp.species_count, gp.area_size, gp.has_sensor_network
    """
    df = pd.read_sql(query, conn)
    conn.close()
    return df

# ============================
# AI Models
# ============================

class DonorSegmentationModel:
    """Predictive donor segmentation using K-Means"""
    
    def __init__(self):
        self.model = KMeans(n_clusters=4, random_state=42)
        self.scaler = StandardScaler()
        self.is_trained = False
    
    def train(self, df: pd.DataFrame):
        """Train segmentation model"""
        features = df[['donation_count', 'avg_donation', 'days_since_last']].fillna(0)
        
        # Scale features
        scaled_features = self.scaler.fit_transform(features)
        
        # Train model
        self.model.fit(scaled_features)
        self.is_trained = True
        
        # Assign segments
        df['segment'] = self.model.labels_
        df['segment_name'] = df['segment'].map({
            0: 'CHAMPION',      # High frequency, high amount
            1: 'LOYAL',         # Regular donors
            2: 'POTENTIAL',     # Occasional donors
            3: 'AT_RISK'        # Low recent activity
        })
        
        return df
    
    def predict(self, features: np.ndarray):
        """Predict segment for new donor"""
        if not self.is_trained:
            raise ValueError("Model not trained")
        
        scaled_features = self.scaler.transform(features.reshape(1, -1))
        segment = self.model.predict(scaled_features)[0]
        
        segment_names = {
            0: 'CHAMPION',
            1: 'LOYAL',
            2: 'POTENTIAL',
            3: 'AT_RISK'
        }
        
        return {
            'segment_id': int(segment),
            'segment_name': segment_names[segment],
            'engagement_score': self._calculate_engagement_score(features)
        }
    
    def _calculate_engagement_score(self, features: np.ndarray) -> float:
        """Calculate 0-100 engagement score"""
        donation_count, avg_donation, days_since_last = features
        
        # Frequency score (40%)
        freq_score = min(donation_count * 10, 40)
        
        # Amount score (30%)
        amount_score = min(avg_donation / 10, 30)
        
        # Recency score (30%)
        recency_score = max(0, 30 - (days_since_last / 10))
        
        return min(100, freq_score + amount_score + recency_score)

class GeoImpactScorer:
    """Geo-impact scoring with ML"""
    
    def __init__(self):
        self.model = GradientBoostingRegressor(n_estimators=100, random_state=42)
        self.scaler = StandardScaler()
        self.is_trained = False
    
    def train(self, df: pd.DataFrame):
        """Train impact scoring model"""
        features = df[[
            'species_count',
            'area_size',
            'has_sensor_network',
            'donation_count',
            'total_funds'
        ]].fillna(0)
        
        # Create synthetic impact scores for training (in production, use actual verified scores)
        df['impact_score'] = (
            (df['species_count'] * 0.3) +
            (df['area_size'] * 0.2) +
            (df['has_sensor_network'].astype(int) * 20) +
            (np.log1p(df['donation_count']) * 10) +
            (np.log1p(df['total_funds']) * 15)
        )
        
        # Normalize to 0-100
        df['impact_score'] = (df['impact_score'] / df['impact_score'].max()) * 100
        
        # Scale and train
        X = self.scaler.fit_transform(features)
        y = df['impact_score']
        
        self.model.fit(X, y)
        self.is_trained = True
        
        return df
    
    def predict_impact(self, features: Dict) -> Dict:
        """Predict geo-impact score for project"""
        if not self.is_trained:
            raise ValueError("Model not trained")
        
        feature_array = np.array([[
            features['species_count'],
            features['area_hectares'],
            1 if features['has_sensors'] else 0,
            features.get('donation_count', 0),
            features.get('total_funds', 0)
        ]])
        
        scaled_features = self.scaler.transform(feature_array)
        impact_score = self.model.predict(scaled_features)[0]
        
        # Calculate geospatial proximity bonus
        proximity_bonus = self._calculate_proximity_bonus(
            features['latitude'],
            features['longitude']
        )
        
        final_score = min(100, impact_score + proximity_bonus)
        
        return {
            'base_impact_score': float(impact_score),
            'proximity_bonus': float(proximity_bonus),
            'final_impact_score': float(final_score),
            'classification': self._classify_impact(final_score)
        }
    
    def _calculate_proximity_bonus(self, lat: float, lon: float) -> float:
        """Calculate bonus based on proximity to critical areas"""
        # Example: Amazon rainforest center
        critical_areas = [
            (-3.4653, -62.2159),  # Amazon
            (-1.8312, 29.9189),   # Virunga
            (27.9881, 86.9250)    # Everest
        ]
        
        min_distance = min([
            geodesic((lat, lon), area).kilometers
            for area in critical_areas
        ])
        
        # Bonus decreases with distance (max 10 points)
        if min_distance < 100:
            return 10
        elif min_distance < 500:
            return 5
        elif min_distance < 1000:
            return 2
        return 0
    
    def _classify_impact(self, score: float) -> str:
        """Classify impact level"""
        if score >= 80:
            return "CRITICAL_HIGH_IMPACT"
        elif score >= 60:
            return "HIGH_IMPACT"
        elif score >= 40:
            return "MODERATE_IMPACT"
        else:
            return "DEVELOPING_IMPACT"

# Initialize models
donor_segmentation = DonorSegmentationModel()
geo_impact_scorer = GeoImpactScorer()

# ============================
# API Endpoints
# ============================

@app.on_event("startup")
async def startup_event():
    """Train models on startup"""
    try:
        # Train donor segmentation
        donor_df = fetch_donor_data()
        if not donor_df.empty:
            donor_segmentation.train(donor_df)
            print("✅ Donor segmentation model trained")
        
        # Train geo-impact scorer
        project_df = fetch_project_data()
        if not project_df.empty:
            geo_impact_scorer.train(project_df)
            print("✅ Geo-impact scorer trained")
    except Exception as e:
        print(f"⚠️ Model training failed: {e}")

@app.get("/")
async def root():
    return {
        "service": "ParkWise AI Pipeline",
        "version": "2.0.0",
        "status": "operational",
        "models": {
            "donor_segmentation": donor_segmentation.is_trained,
            "geo_impact_scorer": geo_impact_scorer.is_trained
        }
    }

@app.post("/ai/predictive-segmentation")
async def predictive_donor_segmentation(request: PredictiveSegmentRequest):
    """
    Predictive donor segmentation with behavioral analytics
    Returns: Donor segments with engagement scores
    """
    try:
        df = fetch_donor_data(request.lookback_days)
        
        if df.empty:
            raise HTTPException(status_code=404, detail="No donor data found")
        
        # Train/retrain model
        segmented_df = donor_segmentation.train(df)
        
        # Aggregate statistics
        segments = segmented_df.groupby('segment_name').agg({
            'user_id': 'count',
            'total_donations': 'sum',
            'avg_donation': 'mean',
            'days_since_last': 'mean'
        }).reset_index()
        
        segments.columns = ['segment', 'count', 'total_value', 'avg_donation', 'avg_recency']
        
        return {
            "timestamp": datetime.now().isoformat(),
            "lookback_days": request.lookback_days,
            "total_donors": len(segmented_df),
            "segments": segments.to_dict('records'),
            "recommendations": {
                "CHAMPION": "VIP treatment, exclusive updates, recognition",
                "LOYAL": "Regular engagement, impact reports, community events",
                "POTENTIAL": "Targeted campaigns, success stories, incentives",
                "AT_RISK": "Re-engagement campaigns, special offers"
            }
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/ai/donor-predict")
async def predict_donor_segment(features: DonorFeatures):
    """
    Predict segment for individual donor
    """
    try:
        feature_array = np.array([
            features.donation_count,
            features.avg_donation,
            features.days_since_last
        ])
        
        prediction = donor_segmentation.predict(feature_array)
        
        return {
            "user_id": features.user_id,
            "prediction": prediction,
            "recommendation": get_segment_recommendation(prediction['segment_name'])
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/ai/geo-impact-score")
async def calculate_geo_impact_score(request: GeoImpactRequest):
    """
    Calculate geo-impact score with ML predictions
    """
    try:
        features = {
            'species_count': request.species_count,
            'area_hectares': request.area_hectares,
            'has_sensors': request.has_sensors,
            'latitude': request.latitude,
            'longitude': request.longitude
        }
        
        impact_result = geo_impact_scorer.predict_impact(features)
        
        return {
            "project_id": request.project_id,
            "location": {
                "latitude": request.latitude,
                "longitude": request.longitude
            },
            "impact_analysis": impact_result,
            "funding_recommendation": calculate_funding_recommendation(
                impact_result['final_impact_score']
            )
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/ai/verify-impact")
async def verify_conservation_impact(verification: ImpactVerification):
    """
    AI-powered impact verification with geofencing
    """
    try:
        # Verify geofence
        conn = get_db_connection()
        cur = conn.cursor()
        
        cur.execute("""
            SELECT 
                name,
                ST_X(location::geometry) as lon,
                ST_Y(location::geometry) as lat,
                ST_Distance(
                    location::geography,
                    ST_SetSRID(ST_MakePoint(%s, %s), 4326)::geography
                ) / 1000 as distance_km
            FROM geo_projects
            WHERE id = %s
        """, (verification.longitude, verification.latitude, verification.project_id))
        
        project = cur.fetchone()
        conn.close()
        
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        
        # Calculate verification score
        is_within_geofence = project['distance_km'] < 10  # 10km radius
        species_diversity_score = len(verification.species_observed) * 10
        
        verification_score = (
            (50 if is_within_geofence else 0) +
            min(species_diversity_score, 30) +
            20  # Evidence quality (would analyze image in production)
        )
        
        return {
            "project_id": verification.project_id,
            "verification_status": "VERIFIED" if verification_score >= 70 else "PENDING_REVIEW",
            "verification_score": verification_score,
            "geofence_check": {
                "within_boundary": is_within_geofence,
                "distance_km": float(project['distance_km'])
            },
            "species_analysis": {
                "count": len(verification.species_observed),
                "diversity_score": species_diversity_score
            }
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/ai/dashboard-metrics")
async def get_dashboard_metrics():
    """
    Real-time dashboard metrics combining blockchain and AI insights
    """
    try:
        conn = get_db_connection()
        
        # Blockchain metrics
        cur = conn.cursor()
        cur.execute("""
            SELECT 
                COUNT(DISTINCT user_id) as total_donors,
                COUNT(*) as total_donations,
                SUM(amount) as total_value,
                AVG(amount) as avg_donation
            FROM blockchain_transactions
        """)
        blockchain_metrics = cur.fetchone()
        
        # AI insights
        donor_df = fetch_donor_data()
        if not donor_df.empty:
            segmented = donor_segmentation.train(donor_df)
            segment_distribution = segmented['segment_name'].value_counts().to_dict()
        else:
            segment_distribution = {}
        
        # Project impact
        cur.execute("""
            SELECT 
                COUNT(*) as total_projects,
                AVG(species_count) as avg_species,
                SUM(area_size) as total_protected_area
            FROM geo_projects
            WHERE is_active = true
        """)
        project_metrics = cur.fetchone()
        
        conn.close()
        
        return {
            "timestamp": datetime.now().isoformat(),
            "blockchain": {
                "total_donors": blockchain_metrics['total_donors'],
                "total_donations": blockchain_metrics['total_donations'],
                "total_value_eth": float(blockchain_metrics['total_value'] or 0),
                "avg_donation": float(blockchain_metrics['avg_donation'] or 0)
            },
            "ai_insights": {
                "donor_segments": segment_distribution,
                "total_analyzed": len(donor_df) if not donor_df.empty else 0
            },
            "conservation_impact": {
                "active_projects": project_metrics['total_projects'],
                "avg_species_per_project": float(project_metrics['avg_species'] or 0),
                "total_protected_hectares": float(project_metrics['total_protected_area'] or 0)
            }
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ============================
# Helper Functions
# ============================

def get_segment_recommendation(segment_name: str) -> str:
    """Get recommendation for donor segment"""
    recommendations = {
        "CHAMPION": "VIP treatment: exclusive updates, recognition wall, early access to new projects",
        "LOYAL": "Engagement: monthly impact reports, community events, ambassador program",
        "POTENTIAL": "Nurture: personalized recommendations, success stories, seasonal campaigns",
        "AT_RISK": "Re-engage: win-back campaigns, special incentives, satisfaction survey"
    }
    return recommendations.get(segment_name, "Monitor and engage")

def calculate_funding_recommendation(impact_score: float) -> Dict:
    """Calculate funding recommendation based on impact score"""
    if impact_score >= 80:
        return {
            "priority": "CRITICAL_HIGH",
            "recommended_allocation": "25-30%",
            "rationale": "Exceptional conservation value with measurable impact"
        }
    elif impact_score >= 60:
        return {
            "priority": "HIGH",
            "recommended_allocation": "15-20%",
            "rationale": "Strong conservation potential with good oversight"
        }
    elif impact_score >= 40:
        return {
            "priority": "MODERATE",
            "recommended_allocation": "10-15%",
            "rationale": "Developing project needing support to reach potential"
        }
    else:
        return {
            "priority": "LOW",
            "recommended_allocation": "5-10%",
            "rationale": "Early-stage project requiring additional verification"
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
