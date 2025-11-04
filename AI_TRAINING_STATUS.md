# 🤖 ParkWise AI Species Identification - Training Status

**Date**: November 4, 2025  
**Status**: ✅ Infrastructure Ready, ⚠️ Awaiting Training Data

---

## ✅ What's Complete

### 1. Training Infrastructure
- ✅ PyTorch 2.9.0 installed
- ✅ torchvision 0.24.0 installed
- ✅ timm (PyTorch Image Models) installed
- ✅ All core dependencies ready
- ✅ Model architectures tested and working

### 2. Model Architectures Available
- ✅ **EfficientNet-B3** (Recommended) - 11.5M parameters
- ✅ **ResNet50** - Proven baseline
- ✅ **Vision Transformer (ViT)** - State-of-the-art
- ✅ **MobileNet-V3** - Lightweight for mobile
- ✅ **Attention-based models** - Enhanced feature focus
- ✅ **Ensemble models** - Multiple model voting

### 3. Training Pipeline
- ✅ Data preparation script (`data_preparation.py`)
- ✅ Training script (`train.py`)
- ✅ Evaluation script (`evaluate.py`)
- ✅ Inference service (`inference_service.py`)
- ✅ Configuration system (`config/training_config.yaml`)

### 4. Documentation
- ✅ Comprehensive training guide (`AI_MODEL_TRAINING_GUIDE.md`)
- ✅ Quick start guide (`QUICKSTART_TRAINING.md`)
- ✅ Species identification guide (`AI_SPECIES_IDENTIFICATION_GUIDE.md`)
- ✅ Demo script for testing (`demo_train.py`)

### 5. Backend Integration
- ✅ AISpeciesIdentificationService configured
- ✅ API endpoints ready (`/api/species/submit`)
- ✅ Fallback to Google Cloud Vision API
- ✅ Confidence scoring and top-K predictions

---

## ⚠️ What's Needed

### Training Data Collection

**Current Status**: No training images collected yet

**Requirements**:
- Minimum 50 images per species (100+ recommended)
- High quality, clear subject
- Various angles and lighting conditions
- Proper licensing

**Priority Species for India**:

#### Mammals (10 species)
- Bengal Tiger
- Indian Elephant  
- Indian Rhinoceros
- Asiatic Lion
- Snow Leopard
- Clouded Leopard
- Sloth Bear
- Wild Water Buffalo
- Indian Gaur
- Nilgai

#### Birds (5 species)
- Great Hornbill
- Indian Peafowl
- Sarus Crane
- Great Indian Bustard
- Himalayan Monal

#### Reptiles (3 species)
- King Cobra
- Gharial
- Saltwater Crocodile

---

## 📸 How to Collect Training Data

### Recommended Sources

#### 1. iNaturalist (Best for Research)
**URL**: https://www.inaturalist.org/

**Advantages**:
- Research-grade observations
- Already labeled by experts
- API available for bulk download
- Community-verified data

**How to use**:
1. Search for species (e.g., "Bengal Tiger")
2. Filter by "Research Grade"
3. Filter by location (India)
4. Download images with proper attribution

#### 2. Wikimedia Commons
**URL**: https://commons.wikimedia.org/

**Advantages**:
- Free, licensed images
- High quality wildlife photos
- Proper attribution available
- No usage restrictions

**How to use**:
1. Search for species
2. Check license (should be CC-BY or CC0)
3. Download high-resolution versions
4. Keep attribution information

#### 3. Flickr (Creative Commons)
**URL**: https://www.flickr.com/

**Advantages**:
- Large collection
- Creative Commons filters
- Various quality levels

**How to use**:
1. Search for species
2. Filter by "Commercial use allowed"
3. Download and attribute properly

#### 4. Your Own Field Photographs
**Advantages**:
- No licensing issues
- Specific to your region
- Original, unique data

---

## 📁 Directory Structure

Place collected images in this structure:

```
ai-service/data/raw/
├── Bengal_Tiger/
│   ├── tiger_001.jpg
│   ├── tiger_002.jpg
│   ├── tiger_003.jpg
│   └── ... (50+ images)
├── Indian_Elephant/
│   ├── elephant_001.jpg
│   ├── elephant_002.jpg
│   └── ... (50+ images)
├── Great_Hornbill/
│   ├── hornbill_001.jpg
│   └── ... (50+ images)
└── ... (more species)
```

**Image Requirements**:
- Format: JPG or PNG
- Minimum resolution: 224x224 pixels (larger is better)
- Quality: Clear subject, good lighting
- Variety: Different angles, backgrounds, conditions

---

## 🚀 Training Steps (Once Data is Ready)

### Step 1: Verify Data
```bash
cd ai-service
python demo_train.py
```

This will check:
- ✅ Environment setup
- ✅ Model architecture
- ✅ Training data availability

### Step 2: Prepare Dataset
```bash
python data_preparation.py
```

This will:
- Validate all images
- Resize to 224x224
- Split into train/val/test (70/15/15)
- Create class mappings
- Generate statistics

### Step 3: Configure Training
Edit `config/training_config.yaml`:

```yaml
model:
  architecture: "efficientnet_b3"
  num_classes: 18  # Update based on your species count
  
training:
  batch_size: 32  # Reduce if out of memory
  epochs: 100
  learning_rate: 0.001
```

### Step 4: Train Model
```bash
python train.py
```

**Expected output**:
```
Epoch 1/100: Loss=2.3456, Val Acc=45.23%
Epoch 2/100: Loss=1.8234, Val Acc=58.67%
...
Epoch 50/100: Loss=0.2134, Val Acc=92.45%
✅ Saved best model with accuracy: 92.45%
```

**Training time** (with 18 species, 100 images each):
- GPU (RTX 3090): 2-4 hours
- GPU (GTX 1080): 6-8 hours
- CPU: Not recommended (days)

### Step 5: Evaluate Model
```bash
python evaluate.py
```

Generates:
- Overall accuracy
- Per-class metrics
- Confusion matrix
- Top-1, Top-3, Top-5 accuracy

### Step 6: Start AI Service
```bash
python inference_service.py
```

Service runs on: `http://localhost:8001`

### Step 7: Test Integration
```bash
# Test the AI service directly
curl -X POST "http://localhost:8001/identify/species" \
  -F "file=@test_image.jpg"

# Test through backend
# Upload image via frontend at http://localhost:5173
```

---

## 📊 Expected Performance

### With Sufficient Data (100+ images/species)

| Species Count | Expected Accuracy | Training Time (GPU) |
|--------------|-------------------|---------------------|
| 10 species   | 95-98%           | 1-2 hours          |
| 18 species   | 92-95%           | 2-4 hours          |
| 25 species   | 90-93%           | 3-5 hours          |
| 50 species   | 88-91%           | 4-6 hours          |

### Model Comparison

| Architecture    | Accuracy | Speed  | Size  | Best For          |
|----------------|----------|--------|-------|-------------------|
| EfficientNet-B3| 92-95%   | Fast   | 12MB  | **Recommended**   |
| ResNet50       | 90-93%   | Fast   | 25MB  | Stable baseline   |
| ViT            | 93-96%   | Medium | 86MB  | Best accuracy     |
| MobileNet-V3   | 88-91%   | Fastest| 5MB   | Mobile/Edge       |

---

## 🎯 Current System Behavior

### Without Custom Model (Current)
1. User uploads wildlife image
2. Backend calls Google Cloud Vision API (if configured)
3. Returns generic labels (may not be wildlife-specific)
4. Limited to Google's pre-trained categories

### With Custom Model (After Training)
1. User uploads wildlife image
2. Backend calls custom AI service at `localhost:8001`
3. Returns species-specific predictions
4. Top 5 predictions with confidence scores
5. Optimized for Indian wildlife species
6. 90%+ accuracy on trained species

---

## 🔧 System Configuration

### Backend (`application.properties`)
```properties
# AI Service Configuration
ai.service.url=http://localhost:8001
ai.model.type=custom  # or google_vision
ai.confidence.threshold=0.5

# Google Cloud Vision (fallback)
google.cloud.vision.enabled=false
```

### AI Service (Port 8001)
- Runs independently
- FastAPI-based REST API
- Accepts image uploads
- Returns JSON predictions

### Integration Flow
```
Frontend (5173) 
    ↓
Backend (8080) → /api/species/submit
    ↓
AI Service (8001) → /identify/species
    ↓
Returns: {
  "species": "Bengal Tiger",
  "confidence": 0.95,
  "alternatives": [...]
}
```

---

## 📞 Next Steps

### Immediate Actions
1. ⚠️ **Collect training images** (50+ per species)
   - Start with 3-5 priority species
   - Use iNaturalist or Wikimedia Commons
   - Ensure proper licensing

2. ⚠️ **Organize images** in `data/raw/` directory
   - Create species folders
   - Name files descriptively
   - Verify image quality

3. ⚠️ **Run data preparation**
   ```bash
   python data_preparation.py
   ```

4. ⚠️ **Train initial model**
   ```bash
   python train.py
   ```

5. ⚠️ **Evaluate and iterate**
   - Check accuracy
   - Collect more data if needed
   - Adjust hyperparameters

### Long-term Goals
- Expand to 50+ species
- Achieve 90%+ accuracy
- Deploy to production
- Enable mobile inference
- Continuous learning from user submissions

---

## 🆘 Troubleshooting

### "No training data found"
- Collect images and place in `data/raw/{species_name}/`
- Minimum 50 images per species
- Supported formats: JPG, PNG

### "CUDA out of memory"
- Reduce `batch_size` in config (try 16 or 8)
- Use smaller model (MobileNet-V3)
- Close other applications

### "Low accuracy (<80%)"
- Collect more diverse training data
- Check for mislabeled images
- Train for more epochs
- Try different architecture

### "Training is too slow"
- Use GPU if available
- Reduce image size
- Use smaller model
- Reduce batch size

---

## 📚 Documentation

- **Quick Start**: `QUICKSTART_TRAINING.md`
- **Detailed Guide**: `AI_MODEL_TRAINING_GUIDE.md`
- **Species ID Guide**: `AI_SPECIES_IDENTIFICATION_GUIDE.md`
- **Demo Script**: `demo_train.py`

---

## ✅ Success Criteria

- [ ] Training data collected (50+ images per species)
- [ ] Data preparation completed
- [ ] Model trained (>85% validation accuracy)
- [ ] Model evaluated on test set
- [ ] AI service running on port 8001
- [ ] Backend successfully calling AI service
- [ ] Tested with real wildlife images
- [ ] Deployed to production

---

**Status**: Infrastructure Complete, Ready for Data Collection  
**Next Action**: Collect training images for priority species  
**Estimated Time to Production**: 1-2 weeks (with data collection)
