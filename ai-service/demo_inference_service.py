"""
ParkWise AI Species Identification - Demo Inference Service
Runs without trained model for testing and demonstration
"""

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict
from PIL import Image
import io
import random
import logging
from datetime import datetime

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="ParkWise Species Identification AI (Demo)", version="2.0.0-demo")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class PredictionResponse(BaseModel):
    success: bool
    predictions: List[Dict]
    processing_time_ms: int
    model_version: str
    confidence_threshold: float
    demo_mode: bool = True


# Demo species database
DEMO_SPECIES = [
    "Bengal Tiger",
    "Indian Elephant",
    "Great Hornbill",
    "Indian Rhinoceros",
    "Asiatic Lion",
    "Snow Leopard",
    "Clouded Leopard",
    "Sloth Bear",
    "Indian Peafowl",
    "Wild Water Buffalo",
    "Indian Leopard",
    "Nilgai",
    "Blackbuck",
    "Chital (Spotted Deer)",
    "Sambar Deer"
]


@app.get("/")
async def root():
    return {
        "service": "ParkWise AI Species Identification",
        "version": "2.0.0-demo",
        "status": "running",
        "mode": "demo",
        "message": "Demo mode - returns simulated predictions. Train a model for real predictions."
    }


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "model_loaded": False,
        "demo_mode": True,
        "timestamp": datetime.now().isoformat()
    }


@app.post("/identify/species", response_model=PredictionResponse)
async def identify_species(file: UploadFile = File(...)):
    """Identify species from uploaded image (Demo Mode)"""
    
    try:
        start_time = datetime.now()
        
        # Read and validate image
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        
        # Verify it's a valid image
        image.verify()
        
        logger.info(f"Processing image: {file.filename} ({image.format if hasattr(image, 'format') else 'unknown'})")
        
        # Generate demo predictions
        predictions = generate_demo_predictions()
        
        processing_time = int((datetime.now() - start_time).total_seconds() * 1000)
        
        return {
            "success": True,
            "predictions": predictions,
            "processing_time_ms": processing_time,
            "model_version": "demo-v1",
            "confidence_threshold": 0.5,
            "demo_mode": True
        }
        
    except Exception as e:
        logger.error(f"Error during prediction: {e}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")


def generate_demo_predictions() -> List[Dict]:
    """Generate realistic demo predictions"""
    
    # Randomly select species
    selected_species = random.sample(DEMO_SPECIES, min(5, len(DEMO_SPECIES)))
    
    # Generate confidence scores (decreasing)
    confidences = []
    remaining = 1.0
    for i in range(len(selected_species)):
        if i == len(selected_species) - 1:
            conf = remaining
        else:
            # First prediction gets higher confidence
            if i == 0:
                conf = random.uniform(0.65, 0.95)
            else:
                conf = random.uniform(0.05, remaining * 0.5)
            remaining -= conf
        confidences.append(conf)
    
    # Sort by confidence
    species_conf = list(zip(selected_species, confidences))
    species_conf.sort(key=lambda x: x[1], reverse=True)
    
    predictions = []
    for species, confidence in species_conf:
        predictions.append({
            "species": species,
            "confidence": round(confidence, 4),
            "confidence_percentage": f"{confidence * 100:.2f}%"
        })
    
    return predictions


@app.get("/model/info")
async def model_info():
    """Get model information"""
    return {
        "architecture": "demo",
        "num_classes": len(DEMO_SPECIES),
        "device": "cpu",
        "confidence_threshold": 0.5,
        "top_k_predictions": 5,
        "demo_mode": True,
        "message": "Demo mode active. Train a model for real predictions.",
        "species_list": DEMO_SPECIES
    }


@app.get("/species/list")
async def list_species():
    """Get list of all supported species"""
    return {
        "total_species": len(DEMO_SPECIES),
        "species": sorted(DEMO_SPECIES),
        "demo_mode": True
    }


if __name__ == "__main__":
    import uvicorn
    logger.info("="*60)
    logger.info("Starting ParkWise AI Service in DEMO MODE")
    logger.info("="*60)
    logger.info("This is a demonstration service that returns simulated predictions.")
    logger.info("To use real AI predictions:")
    logger.info("  1. Collect training images (50+ per species)")
    logger.info("  2. Run: python data_preparation.py")
    logger.info("  3. Run: python train.py")
    logger.info("  4. Run: python inference_service.py")
    logger.info("="*60)
    uvicorn.run(app, host="0.0.0.0", port=8001)
