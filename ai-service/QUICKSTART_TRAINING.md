# 🚀 ParkWise AI Model Training - Quick Start Guide

## 📋 Current Status

✅ **Training Infrastructure**: Complete
✅ **Model Architectures**: 4 options available (EfficientNet-B3, ResNet50, ViT, MobileNet)
✅ **Training Pipeline**: Ready
⚠️ **Training Data**: Needs to be collected

## 🎯 What You Need to Train the Model

### Option 1: Use Demo/Synthetic Data (For Testing)
- Quick way to test the training pipeline
- Uses generated sample images
- Good for verifying everything works
- **Not suitable for production**

### Option 2: Collect Real Wildlife Images (For Production)
- Minimum 50 images per species (100+ recommended)
- High quality, clear subject
- Various angles and lighting conditions
- Proper licensing

## 🚀 Quick Start - Demo Training

### Step 1: Install Dependencies

```bash
cd ai-service
pip install -r requirements-training.txt
```

**Core dependencies:**
- PyTorch (deep learning framework)
- torchvision (computer vision tools)
- timm (pre-trained models)
- PIL/Pillow (image processing)
- pandas, numpy (data handling)

### Step 2: Generate Demo Dataset (Optional - For Testing)

```bash
python download_dataset.py --demo
```

This creates synthetic training data for testing the pipeline.

### Step 3: Prepare Data

```bash
python data_preparation.py
```

This will:
- Validate all images
- Resize to 224x224
- Split into train/val/test (70/15/15)
- Create class mappings
- Generate statistics

### Step 4: Configure Training

Edit `config/training_config.yaml` if needed:

```yaml
model:
  architecture: "efficientnet_b3"  # Best accuracy/speed tradeoff
  num_classes: 10                  # Update based on your species count
  
training:
  batch_size: 32                   # Reduce if out of memory
  epochs: 100                      # More epochs = better accuracy
  learning_rate: 0.001
```

### Step 5: Train Model

```bash
python train.py
```

**Expected output:**
```
Using device: cuda (or cpu)
Epoch 1/100: Loss=2.3456, Val Acc=45.23%
Epoch 2/100: Loss=1.8234, Val Acc=58.67%
...
Epoch 50/100: Loss=0.2134, Val Acc=92.45%
✅ Saved best model with accuracy: 92.45%
```

**Training time:**
- GPU (RTX 3090): 2-4 hours
- GPU (GTX 1080): 6-8 hours  
- CPU: Not recommended (days)

### Step 6: Evaluate Model

```bash
python evaluate.py
```

**Metrics generated:**
- Overall accuracy
- Per-class precision/recall/F1
- Confusion matrix
- Top-1, Top-3, Top-5 accuracy

### Step 7: Start AI Service

```bash
python inference_service.py
```

Service runs on: `http://localhost:8001`

**Test the API:**
```bash
curl -X POST "http://localhost:8001/identify/species" \
  -F "file=@test_image.jpg"
```

## 📁 Collecting Real Training Data

### Recommended Sources

1. **iNaturalist** (Best for research)
   - https://www.inaturalist.org/
   - Research-grade observations
   - Already labeled by experts
   - API available for bulk download

2. **Wikimedia Commons**
   - https://commons.wikimedia.org/
   - Free, licensed images
   - High quality wildlife photos
   - Proper attribution available

3. **Flickr** (Creative Commons)
   - Search with CC licenses
   - Filter by quality
   - Diverse angles and settings

4. **Your Own Photos**
   - Original field photographs
   - No licensing issues
   - Specific to your region

### Data Collection Checklist

For each species, collect:
- ✅ Minimum 50 images (100+ recommended)
- ✅ High resolution (at least 224x224, larger is better)
- ✅ Clear subject (animal visible, not too far)
- ✅ Variety (different angles, lighting, backgrounds)
- ✅ Proper licensing (check usage rights)

### Directory Structure

```
ai-service/data/raw/
├── Bengal_Tiger/
│   ├── tiger_001.jpg
│   ├── tiger_002.jpg
│   ├── tiger_003.jpg
│   └── ... (50+ images)
├── Indian_Elephant/
│   ├── elephant_001.jpg
│   └── ... (50+ images)
├── Great_Hornbill/
│   └── ... (50+ images)
└── ... (more species)
```

## 🎓 Training Tips

### For Best Accuracy

1. **More Data**: 100+ images per species
2. **Quality Over Quantity**: Clear, well-lit photos
3. **Balanced Dataset**: Similar number of images per species
4. **Diverse Angles**: Front, side, back views
5. **Various Conditions**: Day/night, different weather

### If Accuracy is Low (<80%)

1. Collect more diverse training data
2. Check for mislabeled images
3. Increase training epochs to 150-200
4. Try different architecture (EfficientNet-B4)
5. Adjust learning rate

### If Training is Slow

1. Reduce batch_size to 16 or 8
2. Use smaller model (MobileNet-V3)
3. Reduce image size to 224x224
4. Use GPU if available

### If Out of Memory

1. Reduce batch_size to 8 or 4
2. Use smaller model architecture
3. Close other applications
4. Enable mixed precision training

## 🔌 Integration with Backend

Once trained, the backend automatically uses the custom model:

**Backend Configuration** (`application.properties`):
```properties
# Use custom AI model
ai.service.url=http://localhost:8001
ai.model.type=custom

# Model settings
ai.confidence.threshold=0.5
ai.top.predictions=5
```

**API Flow:**
1. User uploads image → Backend (`/api/species/submit`)
2. Backend sends to AI service → `http://localhost:8001/identify/species`
3. AI service returns predictions with confidence scores
4. Backend stores results and shows to user

## 📊 Expected Performance

### With Sufficient Data (100+ images/species)

| Species Count | Expected Accuracy | Training Time (GPU) |
|--------------|-------------------|---------------------|
| 10 species   | 95-98%           | 1-2 hours          |
| 25 species   | 92-95%           | 2-4 hours          |
| 50 species   | 90-93%           | 4-6 hours          |

### Model Comparison

| Architecture    | Accuracy | Speed  | Size  | Best For          |
|----------------|----------|--------|-------|-------------------|
| EfficientNet-B3| 92-95%   | Fast   | 12MB  | **Recommended**   |
| ResNet50       | 90-93%   | Fast   | 25MB  | Stable baseline   |
| ViT (Transformer)| 93-96% | Medium | 86MB  | Best accuracy     |
| MobileNet-V3   | 88-91%   | Fastest| 5MB   | Mobile/Edge       |

## 🎯 Priority Species for India

**Mammals (High Priority):**
- Bengal Tiger
- Indian Elephant
- Indian Rhinoceros
- Asiatic Lion
- Snow Leopard
- Sloth Bear
- Indian Leopard
- Wild Water Buffalo
- Indian Gaur
- Nilgai

**Birds (High Priority):**
- Great Hornbill
- Indian Peafowl
- Sarus Crane
- Great Indian Bustard
- Himalayan Monal

**Reptiles:**
- King Cobra
- Indian Python
- Gharial
- Saltwater Crocodile

## 🆘 Troubleshooting

### "No module named 'torch'"
```bash
pip install torch torchvision
```

### "CUDA out of memory"
Reduce batch_size in `config/training_config.yaml`:
```yaml
training:
  batch_size: 8  # or even 4
```

### "Not enough training data"
You need at least 50 images per species. Collect more data or reduce the number of species.

### "Model accuracy stuck at 50%"
- Check if images are correctly labeled
- Ensure images are clear and high quality
- Try training for more epochs
- Increase learning rate slightly

## 📞 Next Steps

1. ✅ Install dependencies: `pip install -r requirements-training.txt`
2. ⚠️ Collect training images (50+ per species)
3. ⚠️ Run data preparation: `python data_preparation.py`
4. ⚠️ Train model: `python train.py`
5. ⚠️ Evaluate: `python evaluate.py`
6. ⚠️ Start service: `python inference_service.py`
7. ✅ Backend integration (already configured)

## 🎉 Success Criteria

- [ ] Training data collected (50+ images per species)
- [ ] Model trained (>85% validation accuracy)
- [ ] Model evaluated on test set
- [ ] AI service running on port 8001
- [ ] Backend successfully calling AI service
- [ ] Tested with real wildlife images

---

**Status**: Infrastructure Ready, Awaiting Training Data
**Last Updated**: November 4, 2025
