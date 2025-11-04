"""
ParkWise AI - Dataset Download Script
Downloads Indian wildlife species images from various sources
"""

import os
import requests
from pathlib import Path
import logging
from tqdm import tqdm
import json

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class DatasetDownloader:
    """Download wildlife species datasets"""
    
    def __init__(self, output_dir: str = "data/raw"):
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)
    
    def download_from_inaturalist(self, species_list: list):
        """
        Download images from iNaturalist API
        Note: Requires iNaturalist API key
        """
        logger.info("Downloading from iNaturalist...")
        
        # iNaturalist API endpoint
        base_url = "https://api.inaturalist.org/v1/observations"
        
        for species in tqdm(species_list, desc="Downloading species"):
            species_dir = self.output_dir / species.replace(" ", "_")
            species_dir.mkdir(exist_ok=True)
            
            # Query iNaturalist
            params = {
                'taxon_name': species,
                'quality_grade': 'research',
                'photos': 'true',
                'per_page': 100,
                'order': 'desc',
                'order_by': 'created_at'
            }
            
            try:
                response = requests.get(base_url, params=params)
                data = response.json()
                
                if 'results' in data:
                    for idx, obs in enumerate(data['results'][:50]):  # Limit to 50 per species
                        if 'photos' in obs and len(obs['photos']) > 0:
                            photo_url = obs['photos'][0]['url'].replace('square', 'medium')
                            
                            # Download image
                            img_response = requests.get(photo_url)
                            if img_response.status_code == 200:
                                img_path = species_dir / f"{species.replace(' ', '_')}_{idx:04d}.jpg"
                                with open(img_path, 'wb') as f:
                                    f.write(img_response.content)
                
                logger.info(f"Downloaded images for {species}")
                
            except Exception as e:
                logger.error(f"Error downloading {species}: {e}")
    
    def create_sample_dataset(self):
        """
        Create a sample dataset structure for testing
        Users should replace with real images
        """
        logger.info("Creating sample dataset structure...")
        
        sample_species = [
            "Bengal_Tiger",
            "Indian_Elephant",
            "Great_Hornbill",
            "Indian_Rhinoceros",
            "Asiatic_Lion",
            "Snow_Leopard",
            "Sloth_Bear",
            "Indian_Peafowl",
            "Clouded_Leopard",
            "Wild_Water_Buffalo"
        ]
        
        for species in sample_species:
            species_dir = self.output_dir / species
            species_dir.mkdir(exist_ok=True)
            
            # Create README
            readme_path = species_dir / "README.txt"
            with open(readme_path, 'w') as f:
                f.write(f"Place {species} images here\n")
                f.write(f"Minimum 50 images recommended\n")
                f.write(f"Supported formats: JPG, PNG\n")
                f.write(f"Recommended size: 224x224 or larger\n")
        
        logger.info(f"Created sample structure for {len(sample_species)} species")
        logger.info(f"Please add images to: {self.output_dir}")
        
        # Create instructions
        instructions = {
            "instructions": "Add wildlife species images to the data/raw directory",
            "structure": "data/raw/{species_name}/{image_files}",
            "minimum_images_per_species": 50,
            "recommended_sources": [
                "iNaturalist (https://www.inaturalist.org/)",
                "Wikimedia Commons (https://commons.wikimedia.org/)",
                "Flickr with appropriate licenses",
                "Your own field photographs",
                "Wildlife photography databases"
            ],
            "image_requirements": {
                "format": ["JPG", "PNG"],
                "min_resolution": "224x224",
                "quality": "High quality, clear subject",
                "licensing": "Ensure proper licensing for use"
            },
            "species_list": sample_species
        }
        
        with open(self.output_dir / "INSTRUCTIONS.json", 'w') as f:
            json.dump(instructions, f, indent=2)
        
        logger.info("Created INSTRUCTIONS.json with dataset guidelines")


def main():
    """Main entry point"""
    downloader = DatasetDownloader()
    
    # Create sample structure
    downloader.create_sample_dataset()
    
    logger.info("\n" + "="*60)
    logger.info("NEXT STEPS:")
    logger.info("1. Add wildlife species images to data/raw/{species_name}/")
    logger.info("2. Minimum 50 images per species recommended")
    logger.info("3. Run: python data_preparation.py")
    logger.info("4. Run: python train.py")
    logger.info("="*60)


if __name__ == "__main__":
    main()
