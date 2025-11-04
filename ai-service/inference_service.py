"""
ParkWise AI Species Identification - Inference Service
Real-time species identification using trained model
"""

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional
import torch
import torch.nn.functional as F
from torchvision import transforms
from PIL import Image
import json
import yaml
import io
import logging
from pathlib import Path
from datetime import datetime

from models.species_classifier import create_model

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="ParkWise Species Identification AI", version="2.0.0")

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
    predictions: List[Dict[str, any]]
    processing_time_ms: int
    model_version: str
    confidence_threshold: float


class ModelInference:
    """Handle model loading and inference"""
    
    def __init__(self, config_path: str = "config/training_config.yaml", 
                 model_path: str = "models/best_model.pth"):
        
        with open(config_path, 'r') as f:
            self.config = yaml.safe_load(f)
        
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        logger.info(f"Using device: {self.device}")
        
        # Load class mapping
        mapping_path = Path(self.config['dataset']['processed_dir']) / 'class_mapping.json'
        with open(mapping_path, 'r') as f:
            mapping = json.load(f)
            self.idx_to_class = {int(k): v for k, v in mapping['idx_to_class'].items()}
            self.num_classes = mapping['num_classes']
        
        # Load model
        self.model = create_model(self.config)
        
        if Path(model_path).exists():
            self.model.load_state_dict(torch.load(model_path, map_location=self.device))
            logger.info(f"Loaded model from {model_path}")
        else:
            logger.warning(f"Model file not found: {model_path}. Using untrained model.")
        
        self.model.to(self.device)
        self.model.eval()
        
        # Image preprocessing
        self.transform = transforms.Compose([
            transforms.Resize(256),
            transforms.CenterCrop(224),
            transforms.ToTensor(),
            transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
        ])
        
        self.confidence_threshold = self.config['inference']['confidence_threshold']
        self.top_k = self.config['inference']['top_k_predictions']
    
    def preprocess_image(self, image: Image.Image) -> torch.Tensor:
        """Preprocess image for inference"""
        image = image.convert('RGB')
        image_tensor = self.transform(image)
        return image_tensor.unsqueeze(0)
    
    def predict(self, image: Image.Image) -> Dict:
        """Predict species from image"""
        start_time = datetime.now()
        
        # Preprocess
        image_tensor = self.preprocess_image(image).to(self.device)
        
        # Inference
        with torch.no_grad():
            outputs = self.model(image_tensor)
            probabilities = F.softmax(outputs, dim=1)
            top_probs, top_indices = torch.topk(probabilities, self.top_k)
        
        # Format predictions
        predictions = []
        for prob, idx in zip(top_probs[0].cpu().numpy(), top_indices[0].cpu().numpy()):
            species_name = self.idx_to_class[int(idx)]
            predictions.append({
                'species': species_name,
                'confidence': float(prob),
                'confidence_percentage': f"{float(prob) * 100:.2f}%"
            })
        
        processing_time = int((datetime.now() - start_time).total_seconds() * 1000)
        
        return {
            'success': True,
            'predictions': predictions,
            'processing_time_ms': processing_time,
            'model_version': self.config['model']['architecture'],
            'confidence_threshold': self.confidence_threshold
        }


# Initialize model
try:
    model_inference = ModelInference()
    logger.info("Model loaded successfully")
except Exception as e:
    logger.error(f"Failed to load model: {e}")
    model_inference = None


@app.get("/")
async def root():
    return {
        "service": "ParkWise AI Species Identification",
        "version": "2.0.0",
        "status": "running",
        "model_loaded": model_inference is not None
    }


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "model_loaded": model_inference is not None,
        "device": str(model_inference.device) if model_inference else "N/A",
        "timestamp": datetime.now().isoformat()
    }


@app.post("/identify/species", response_model=PredictionResponse)
async def identify_species(file: UploadFile = File(...)):
    """Identify species from uploaded image"""
    
    if model_inference is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    try:
        # Read image
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        
        # Predict
        result = model_inference.predict(image)
        
        logger.info(f"Prediction: {result['predictions'][0]['species']} "
                   f"({result['predictions'][0]['confidence_percentage']})")
        
        return result
        
    except Exception as e:
        logger.error(f"Error during prediction: {e}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")


@app.get("/model/info")
async def model_info():
    """Get model information"""
    if model_inference is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    return {
        "architecture": model_inference.config['model']['architecture'],
        "num_classes": model_inference.num_classes,
        "device": str(model_inference.device),
        "confidence_threshold": model_inference.confidence_threshold,
        "top_k_predictions": model_inference.top_k,
        "species_list": list(model_inference.idx_to_class.values())
    }


@app.get("/species/list")
async def list_species():
    """Get list of all supported species"""
    if model_inference is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    return {
        "total_species": model_inference.num_classes,
        "species": sorted(model_inference.idx_to_class.values())
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
