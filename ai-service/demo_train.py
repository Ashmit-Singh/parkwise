"""
ParkWise AI Species Identification - Demo Training Script
This script demonstrates the training pipeline with minimal setup
"""

import os
import json
import torch
import torch.nn as nn
import torch.optim as optim
from pathlib import Path
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def check_environment():
    """Check if environment is ready for training"""
    logger.info("=" * 60)
    logger.info("ParkWise AI Model Training - Environment Check")
    logger.info("=" * 60)
    
    # Check PyTorch
    logger.info(f"✅ PyTorch version: {torch.__version__}")
    
    # Check CUDA
    if torch.cuda.is_available():
        logger.info(f"✅ CUDA available: {torch.cuda.get_device_name(0)}")
        logger.info(f"   CUDA version: {torch.version.cuda}")
        device = "cuda"
    else:
        logger.info("⚠️  CUDA not available, using CPU (training will be slower)")
        device = "cpu"
    
    return device


def check_training_data():
    """Check if training data is available"""
    logger.info("\n" + "=" * 60)
    logger.info("Checking Training Data")
    logger.info("=" * 60)
    
    data_dir = Path("data/raw")
    species_count = 0
    total_images = 0
    species_info = []
    
    for species_dir in data_dir.iterdir():
        if not species_dir.is_dir():
            continue
        
        # Count images
        image_files = []
        for ext in ['*.jpg', '*.jpeg', '*.png', '*.JPG', '*.JPEG', '*.PNG']:
            image_files.extend(list(species_dir.glob(ext)))
        
        if len(image_files) > 0:
            species_count += 1
            total_images += len(image_files)
            species_info.append({
                'name': species_dir.name,
                'count': len(image_files),
                'status': '✅' if len(image_files) >= 50 else '⚠️'
            })
    
    if species_count == 0:
        logger.warning("❌ No training data found!")
        logger.info("\nTo train the model, you need to:")
        logger.info("1. Collect wildlife images (50+ per species)")
        logger.info("2. Place them in: data/raw/{species_name}/")
        logger.info("3. Supported formats: JPG, PNG")
        logger.info("\nExample structure:")
        logger.info("  data/raw/Bengal_Tiger/tiger_001.jpg")
        logger.info("  data/raw/Bengal_Tiger/tiger_002.jpg")
        logger.info("  data/raw/Indian_Elephant/elephant_001.jpg")
        logger.info("\nSee QUICKSTART_TRAINING.md for detailed instructions.")
        return False, 0, 0
    
    logger.info(f"\n📊 Training Data Summary:")
    logger.info(f"   Total species: {species_count}")
    logger.info(f"   Total images: {total_images}")
    logger.info(f"\n📋 Species breakdown:")
    
    for info in sorted(species_info, key=lambda x: x['count'], reverse=True):
        logger.info(f"   {info['status']} {info['name']}: {info['count']} images")
    
    # Check if we have enough data
    min_images_species = [s for s in species_info if s['count'] >= 50]
    if len(min_images_species) < 2:
        logger.warning(f"\n⚠️  Warning: Only {len(min_images_species)} species have 50+ images")
        logger.warning("   Recommendation: Collect at least 50 images per species")
        logger.warning("   Minimum requirement: 2 species with 50+ images each")
        return False, species_count, total_images
    
    logger.info(f"\n✅ Ready to train! {len(min_images_species)} species have sufficient data")
    return True, species_count, total_images


def test_model_architecture():
    """Test if model architecture can be loaded"""
    logger.info("\n" + "=" * 60)
    logger.info("Testing Model Architecture")
    logger.info("=" * 60)
    
    try:
        from models.species_classifier import SpeciesClassifier
        
        # Create a small test model
        model = SpeciesClassifier(
            num_classes=10,
            architecture='efficientnet_b3',
            pretrained=False  # Don't download weights for test
        )
        
        total_params = sum(p.numel() for p in model.parameters())
        trainable_params = sum(p.numel() for p in model.parameters() if p.requires_grad)
        
        logger.info(f"✅ Model architecture loaded successfully")
        logger.info(f"   Architecture: EfficientNet-B3")
        logger.info(f"   Total parameters: {total_params:,}")
        logger.info(f"   Trainable parameters: {trainable_params:,}")
        
        # Test forward pass with batch size > 1 to avoid BatchNorm issues
        model.eval()  # Set to evaluation mode
        test_input = torch.randn(2, 3, 224, 224)  # Batch size of 2
        with torch.no_grad():
            output = model(test_input)
        
        logger.info(f"   Output shape: {output.shape}")
        logger.info(f"✅ Forward pass successful")
        
        return True
    except Exception as e:
        logger.error(f"❌ Error loading model: {e}")
        logger.info("\nTry installing missing dependencies:")
        logger.info("  pip install timm")
        return False


def show_training_instructions():
    """Show instructions for actual training"""
    logger.info("\n" + "=" * 60)
    logger.info("🚀 Ready to Train!")
    logger.info("=" * 60)
    
    logger.info("\n📝 Training Steps:")
    logger.info("\n1. Prepare Data:")
    logger.info("   python data_preparation.py")
    logger.info("   (Validates images, creates train/val/test splits)")
    
    logger.info("\n2. Configure Training:")
    logger.info("   Edit config/training_config.yaml")
    logger.info("   - Set num_classes to match your species count")
    logger.info("   - Adjust batch_size if needed (default: 32)")
    logger.info("   - Set epochs (default: 100)")
    
    logger.info("\n3. Train Model:")
    logger.info("   python train.py")
    logger.info("   (This will take several hours depending on GPU)")
    
    logger.info("\n4. Evaluate Model:")
    logger.info("   python evaluate.py")
    logger.info("   (Check accuracy, confusion matrix, etc.)")
    
    logger.info("\n5. Start AI Service:")
    logger.info("   python inference_service.py")
    logger.info("   (Runs on http://localhost:8001)")
    
    logger.info("\n📚 For detailed guide, see:")
    logger.info("   - QUICKSTART_TRAINING.md")
    logger.info("   - AI_MODEL_TRAINING_GUIDE.md")


def show_data_collection_guide():
    """Show guide for collecting training data"""
    logger.info("\n" + "=" * 60)
    logger.info("📸 How to Collect Training Data")
    logger.info("=" * 60)
    
    logger.info("\n🎯 Recommended Sources:")
    logger.info("\n1. iNaturalist (Best for research)")
    logger.info("   https://www.inaturalist.org/")
    logger.info("   - Research-grade observations")
    logger.info("   - Already labeled by experts")
    logger.info("   - API available for bulk download")
    
    logger.info("\n2. Wikimedia Commons")
    logger.info("   https://commons.wikimedia.org/")
    logger.info("   - Free, licensed images")
    logger.info("   - High quality wildlife photos")
    
    logger.info("\n3. Your Own Photos")
    logger.info("   - Original field photographs")
    logger.info("   - No licensing issues")
    logger.info("   - Specific to your region")
    
    logger.info("\n📋 Requirements per Species:")
    logger.info("   ✅ Minimum: 50 images")
    logger.info("   ✅ Recommended: 100+ images")
    logger.info("   ✅ Resolution: 224x224 or larger")
    logger.info("   ✅ Quality: Clear subject, good lighting")
    logger.info("   ✅ Variety: Different angles, backgrounds")
    
    logger.info("\n📁 Directory Structure:")
    logger.info("   data/raw/")
    logger.info("   ├── Bengal_Tiger/")
    logger.info("   │   ├── tiger_001.jpg")
    logger.info("   │   ├── tiger_002.jpg")
    logger.info("   │   └── ... (50+ images)")
    logger.info("   ├── Indian_Elephant/")
    logger.info("   │   └── ... (50+ images)")
    logger.info("   └── Great_Hornbill/")
    logger.info("       └── ... (50+ images)")
    
    logger.info("\n🐯 Priority Species for India:")
    logger.info("   Mammals: Bengal Tiger, Indian Elephant, Indian Rhinoceros")
    logger.info("   Birds: Great Hornbill, Indian Peafowl, Sarus Crane")
    logger.info("   Reptiles: King Cobra, Gharial, Saltwater Crocodile")


def main():
    """Main demo training function"""
    print("\n")
    logger.info("🤖 ParkWise AI Species Identification")
    logger.info("    Training Pipeline Demo & Readiness Check")
    print("\n")
    
    # Step 1: Check environment
    device = check_environment()
    
    # Step 2: Check training data
    has_data, species_count, total_images = check_training_data()
    
    # Step 3: Test model architecture
    model_ok = test_model_architecture()
    
    # Summary
    logger.info("\n" + "=" * 60)
    logger.info("📊 Readiness Summary")
    logger.info("=" * 60)
    
    logger.info(f"\n✅ Environment: Ready ({device})")
    logger.info(f"{'✅' if model_ok else '❌'} Model Architecture: {'Ready' if model_ok else 'Error'}")
    logger.info(f"{'✅' if has_data else '❌'} Training Data: {'Ready' if has_data else 'Not Ready'}")
    
    if has_data and model_ok:
        logger.info("\n🎉 All systems ready for training!")
        show_training_instructions()
    else:
        if not has_data:
            show_data_collection_guide()
        
        logger.info("\n⚠️  Action Required:")
        if not model_ok:
            logger.info("   1. Install missing dependencies:")
            logger.info("      pip install -r requirements-training.txt")
        if not has_data:
            logger.info("   2. Collect training images (see guide above)")
            logger.info("   3. Place images in data/raw/{species_name}/")
            logger.info("   4. Run this script again to verify")
    
    logger.info("\n" + "=" * 60)
    logger.info("For detailed instructions, see:")
    logger.info("  - QUICKSTART_TRAINING.md")
    logger.info("  - AI_MODEL_TRAINING_GUIDE.md")
    logger.info("=" * 60 + "\n")


if __name__ == "__main__":
    main()
