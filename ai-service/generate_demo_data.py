"""
Generate synthetic training data for demo purposes
This creates sample images to test the training pipeline
"""

import os
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import random
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def generate_demo_image(species_name: str, index: int, output_path: Path):
    """Generate a synthetic image with species label"""
    # Create image with random background color
    width, height = 224, 224
    
    # Generate color based on species (consistent per species)
    random.seed(hash(species_name) + index)
    bg_color = (
        random.randint(100, 200),
        random.randint(100, 200),
        random.randint(100, 200)
    )
    
    img = Image.new('RGB', (width, height), bg_color)
    draw = ImageDraw.Draw(img)
    
    # Add some random shapes to make images unique
    for _ in range(10):
        x1 = random.randint(0, width - 20)
        y1 = random.randint(0, height - 20)
        x2 = x1 + random.randint(10, 50)
        y2 = y1 + random.randint(10, 50)
        
        # Ensure coordinates are within bounds
        x2 = min(x2, width)
        y2 = min(y2, height)
        
        shape_color = (
            random.randint(50, 255),
            random.randint(50, 255),
            random.randint(50, 255)
        )
        
        shape_type = random.choice(['rectangle', 'ellipse', 'line'])
        if shape_type == 'rectangle':
            draw.rectangle([x1, y1, x2, y2], fill=shape_color)
        elif shape_type == 'ellipse':
            draw.ellipse([x1, y1, x2, y2], fill=shape_color)
        else:
            draw.line([x1, y1, x2, y2], fill=shape_color, width=3)
    
    # Add text label
    try:
        # Try to use a default font, fall back to basic if not available
        font = ImageFont.truetype("arial.ttf", 16)
    except:
        font = ImageFont.load_default()
    
    # Add species name
    text = species_name.replace('_', ' ')
    text_bbox = draw.textbbox((0, 0), text, font=font)
    text_width = text_bbox[2] - text_bbox[0]
    text_height = text_bbox[3] - text_bbox[1]
    
    text_x = (width - text_width) // 2
    text_y = height - text_height - 10
    
    # Draw text with background
    draw.rectangle(
        [text_x - 5, text_y - 5, text_x + text_width + 5, text_y + text_height + 5],
        fill=(255, 255, 255, 200)
    )
    draw.text((text_x, text_y), text, fill=(0, 0, 0), font=font)
    
    # Add image number
    draw.text((10, 10), f"#{index}", fill=(255, 255, 255), font=font)
    
    # Save image
    img.save(output_path, 'JPEG', quality=95)


def generate_demo_dataset(num_images_per_species: int = 60):
    """Generate complete demo dataset"""
    
    logger.info("=" * 60)
    logger.info("Generating Demo Training Dataset")
    logger.info("=" * 60)
    
    # Priority species for demo
    species_list = [
        'Bengal_Tiger',
        'Indian_Elephant',
        'Indian_Rhinoceros',
        'Great_Hornbill',
        'Indian_Peafowl'
    ]
    
    data_dir = Path('data/raw')
    data_dir.mkdir(parents=True, exist_ok=True)
    
    total_images = 0
    
    for species in species_list:
        species_dir = data_dir / species
        species_dir.mkdir(exist_ok=True)
        
        # Remove README.txt if it exists
        readme_file = species_dir / 'README.txt'
        if readme_file.exists():
            readme_file.unlink()
        
        logger.info(f"\nGenerating images for {species}...")
        
        for i in range(1, num_images_per_species + 1):
            filename = f"{species.lower()}_{i:03d}.jpg"
            output_path = species_dir / filename
            
            generate_demo_image(species, i, output_path)
            total_images += 1
            
            if i % 10 == 0:
                logger.info(f"  Generated {i}/{num_images_per_species} images")
        
        logger.info(f"✅ Completed {species}: {num_images_per_species} images")
    
    logger.info("\n" + "=" * 60)
    logger.info(f"✅ Demo Dataset Generated Successfully!")
    logger.info(f"   Total species: {len(species_list)}")
    logger.info(f"   Total images: {total_images}")
    logger.info(f"   Images per species: {num_images_per_species}")
    logger.info("=" * 60)
    
    logger.info("\n📋 Dataset Summary:")
    for species in species_list:
        species_dir = data_dir / species
        image_count = len(list(species_dir.glob('*.jpg')))
        logger.info(f"   ✅ {species}: {image_count} images")
    
    logger.info("\n🚀 Next Steps:")
    logger.info("   1. Run: python data_preparation.py")
    logger.info("   2. Run: python train.py")
    logger.info("   3. Run: python inference_service.py")
    
    logger.info("\n⚠️  Note: This is DEMO data for testing the pipeline.")
    logger.info("   For production, replace with real wildlife images.")
    logger.info("   See QUICKSTART_TRAINING.md for data collection guide.")


if __name__ == "__main__":
    logger.info("\n🤖 ParkWise AI - Demo Data Generator\n")
    
    # Check if demo data already exists
    data_dir = Path('data/raw')
    existing_images = []
    
    if data_dir.exists():
        for species_dir in data_dir.iterdir():
            if species_dir.is_dir():
                images = list(species_dir.glob('*.jpg'))
                if len(images) > 0:
                    existing_images.append((species_dir.name, len(images)))
    
    if existing_images:
        logger.info("⚠️  Existing images found:")
        for species, count in existing_images:
            logger.info(f"   {species}: {count} images")
        
        response = input("\nOverwrite existing demo data? (y/n): ")
        if response.lower() != 'y':
            logger.info("Cancelled. Keeping existing data.")
            exit(0)
    
    # Generate demo dataset
    generate_demo_dataset(num_images_per_species=60)
