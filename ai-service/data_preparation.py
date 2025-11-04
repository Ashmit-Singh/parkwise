"""
ParkWise AI Species Identification - Data Preparation Pipeline
Prepares training data from various sources for model training
"""

import os
import json
import shutil
from pathlib import Path
from typing import Dict, List, Tuple
import pandas as pd
import numpy as np
from PIL import Image
from tqdm import tqdm
import yaml
from sklearn.model_selection import train_test_split
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class DataPreparationPipeline:
    """Prepare and organize species identification training data"""
    
    def __init__(self, config_path: str = "config/training_config.yaml"):
        with open(config_path, 'r') as f:
            self.config = yaml.safe_load(f)
        
        self.data_dir = Path(self.config['dataset']['data_dir'])
        self.processed_dir = Path(self.config['dataset']['processed_dir'])
        self.image_size = tuple(self.config['dataset']['image_size'])
        self.min_samples = self.config['dataset']['min_samples_per_class']
        
        # Create directories
        self.processed_dir.mkdir(parents=True, exist_ok=True)
        (self.processed_dir / 'train').mkdir(exist_ok=True)
        (self.processed_dir / 'val').mkdir(exist_ok=True)
        (self.processed_dir / 'test').mkdir(exist_ok=True)
        
    def scan_raw_data(self) -> Dict[str, List[Path]]:
        """Scan raw data directory and organize by species"""
        logger.info("Scanning raw data directory...")
        
        species_images = {}
        
        # Expected structure: data/raw/{species_name}/{image_files}
        for species_dir in self.data_dir.iterdir():
            if not species_dir.is_dir():
                continue
                
            species_name = species_dir.name
            image_files = []
            
            # Find all image files
            for ext in ['*.jpg', '*.jpeg', '*.png', '*.JPG', '*.JPEG', '*.PNG']:
                image_files.extend(list(species_dir.glob(ext)))
            
            if len(image_files) >= self.min_samples:
                species_images[species_name] = image_files
                logger.info(f"Found {len(image_files)} images for {species_name}")
            else:
                logger.warning(f"Skipping {species_name}: only {len(image_files)} images (min: {self.min_samples})")
        
        logger.info(f"Total species with sufficient data: {len(species_images)}")
        return species_images
    
    def validate_and_clean_images(self, image_path: Path) -> bool:
        """Validate image file and check if it can be opened"""
        try:
            with Image.open(image_path) as img:
                img.verify()
            
            # Re-open for actual processing
            with Image.open(image_path) as img:
                img = img.convert('RGB')
                width, height = img.size
                
                # Check minimum dimensions
                if width < 100 or height < 100:
                    logger.warning(f"Image too small: {image_path}")
                    return False
                    
            return True
        except Exception as e:
            logger.error(f"Invalid image {image_path}: {e}")
            return False
    
    def preprocess_image(self, image_path: Path, output_path: Path):
        """Preprocess and resize image"""
        try:
            with Image.open(image_path) as img:
                # Convert to RGB
                img = img.convert('RGB')
                
                # Resize maintaining aspect ratio
                img.thumbnail(self.image_size, Image.Resampling.LANCZOS)
                
                # Create new image with padding if needed
                new_img = Image.new('RGB', self.image_size, (0, 0, 0))
                paste_x = (self.image_size[0] - img.width) // 2
                paste_y = (self.image_size[1] - img.height) // 2
                new_img.paste(img, (paste_x, paste_y))
                
                # Save processed image
                new_img.save(output_path, 'JPEG', quality=95)
                
        except Exception as e:
            logger.error(f"Error preprocessing {image_path}: {e}")
            raise
    
    def split_dataset(self, species_images: Dict[str, List[Path]]) -> Tuple[Dict, Dict, Dict]:
        """Split dataset into train, validation, and test sets"""
        logger.info("Splitting dataset...")
        
        train_split = self.config['dataset']['train_split']
        val_split = self.config['dataset']['val_split']
        test_split = self.config['dataset']['test_split']
        
        train_data = {}
        val_data = {}
        test_data = {}
        
        for species_name, image_paths in species_images.items():
            # First split: train vs (val + test)
            train_imgs, temp_imgs = train_test_split(
                image_paths,
                train_size=train_split,
                random_state=42
            )
            
            # Second split: val vs test
            val_size = val_split / (val_split + test_split)
            val_imgs, test_imgs = train_test_split(
                temp_imgs,
                train_size=val_size,
                random_state=42
            )
            
            train_data[species_name] = train_imgs
            val_data[species_name] = val_imgs
            test_data[species_name] = test_imgs
            
            logger.info(f"{species_name}: {len(train_imgs)} train, {len(val_imgs)} val, {len(test_imgs)} test")
        
        return train_data, val_data, test_data
    
    def process_and_save_split(self, data: Dict[str, List[Path]], split_name: str):
        """Process and save images for a specific split"""
        logger.info(f"Processing {split_name} split...")
        
        split_dir = self.processed_dir / split_name
        metadata = []
        
        for species_name, image_paths in tqdm(data.items(), desc=f"Processing {split_name}"):
            # Create species directory
            species_dir = split_dir / species_name
            species_dir.mkdir(exist_ok=True)
            
            for idx, img_path in enumerate(image_paths):
                # Validate image
                if not self.validate_and_clean_images(img_path):
                    continue
                
                # Generate output filename
                output_filename = f"{species_name}_{idx:04d}.jpg"
                output_path = species_dir / output_filename
                
                # Preprocess and save
                try:
                    self.preprocess_image(img_path, output_path)
                    
                    # Add to metadata
                    metadata.append({
                        'filename': str(output_path.relative_to(self.processed_dir)),
                        'species': species_name,
                        'original_path': str(img_path),
                        'split': split_name
                    })
                except Exception as e:
                    logger.error(f"Failed to process {img_path}: {e}")
        
        # Save metadata
        metadata_df = pd.DataFrame(metadata)
        metadata_path = self.processed_dir / f"{split_name}_metadata.csv"
        metadata_df.to_csv(metadata_path, index=False)
        logger.info(f"Saved {len(metadata)} images to {split_name} split")
        
        return metadata_df
    
    def create_class_mapping(self, species_list: List[str]):
        """Create class index mapping"""
        class_to_idx = {species: idx for idx, species in enumerate(sorted(species_list))}
        idx_to_class = {idx: species for species, idx in class_to_idx.items()}
        
        # Save mapping
        mapping_path = self.processed_dir / 'class_mapping.json'
        with open(mapping_path, 'w') as f:
            json.dump({
                'class_to_idx': class_to_idx,
                'idx_to_class': idx_to_class,
                'num_classes': len(class_to_idx)
            }, f, indent=2)
        
        logger.info(f"Created class mapping for {len(class_to_idx)} species")
        return class_to_idx, idx_to_class
    
    def generate_statistics(self, train_df: pd.DataFrame, val_df: pd.DataFrame, test_df: pd.DataFrame):
        """Generate dataset statistics"""
        logger.info("Generating dataset statistics...")
        
        stats = {
            'total_images': len(train_df) + len(val_df) + len(test_df),
            'train_images': len(train_df),
            'val_images': len(val_df),
            'test_images': len(test_df),
            'num_species': train_df['species'].nunique(),
            'species_distribution': {
                'train': train_df['species'].value_counts().to_dict(),
                'val': val_df['species'].value_counts().to_dict(),
                'test': test_df['species'].value_counts().to_dict()
            }
        }
        
        # Save statistics
        stats_path = self.processed_dir / 'dataset_statistics.json'
        with open(stats_path, 'w') as f:
            json.dump(stats, f, indent=2)
        
        logger.info(f"Dataset statistics:")
        logger.info(f"  Total images: {stats['total_images']}")
        logger.info(f"  Train: {stats['train_images']}")
        logger.info(f"  Val: {stats['val_images']}")
        logger.info(f"  Test: {stats['test_images']}")
        logger.info(f"  Species: {stats['num_species']}")
        
        return stats
    
    def run(self):
        """Run complete data preparation pipeline"""
        logger.info("Starting data preparation pipeline...")
        
        # Step 1: Scan raw data
        species_images = self.scan_raw_data()
        
        if not species_images:
            logger.error("No valid species data found!")
            return
        
        # Step 2: Split dataset
        train_data, val_data, test_data = self.split_dataset(species_images)
        
        # Step 3: Process and save splits
        train_df = self.process_and_save_split(train_data, 'train')
        val_df = self.process_and_save_split(val_data, 'val')
        test_df = self.process_and_save_split(test_data, 'test')
        
        # Step 4: Create class mapping
        species_list = list(species_images.keys())
        self.create_class_mapping(species_list)
        
        # Step 5: Generate statistics
        self.generate_statistics(train_df, val_df, test_df)
        
        logger.info("Data preparation complete!")


def main():
    """Main entry point"""
    pipeline = DataPreparationPipeline()
    pipeline.run()


if __name__ == "__main__":
    main()
