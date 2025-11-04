"""
ParkWise AI Species Identification - Training Script
"""

import os
import json
import yaml
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, Dataset
from torchvision import transforms
from PIL import Image
import pandas as pd
from pathlib import Path
from tqdm import tqdm
import logging

from models.species_classifier import create_model

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class SpeciesDataset(Dataset):
    def __init__(self, data_dir: Path, metadata_df: pd.DataFrame, transform=None):
        self.data_dir = data_dir
        self.metadata = metadata_df
        self.transform = transform
        
        with open(data_dir / 'class_mapping.json', 'r') as f:
            self.class_to_idx = json.load(f)['class_to_idx']
    
    def __len__(self):
        return len(self.metadata)
    
    def __getitem__(self, idx):
        row = self.metadata.iloc[idx]
        image = Image.open(self.data_dir / row['filename']).convert('RGB')
        if self.transform:
            image = self.transform(image)
        return image, self.class_to_idx[row['species']]


def train_model(config_path='config/training_config.yaml'):
    with open(config_path, 'r') as f:
        config = yaml.safe_load(f)
    
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    logger.info(f"Using device: {device}")
    
    # Data transforms
    train_transform = transforms.Compose([
        transforms.RandomResizedCrop(224),
        transforms.RandomHorizontalFlip(),
        transforms.ColorJitter(0.2, 0.2, 0.2, 0.1),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ])
    
    val_transform = transforms.Compose([
        transforms.Resize(256),
        transforms.CenterCrop(224),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ])
    
    # Load datasets
    data_dir = Path(config['dataset']['processed_dir'])
    train_df = pd.read_csv(data_dir / 'train_metadata.csv')
    val_df = pd.read_csv(data_dir / 'val_metadata.csv')
    
    train_dataset = SpeciesDataset(data_dir, train_df, train_transform)
    val_dataset = SpeciesDataset(data_dir, val_df, val_transform)
    
    train_loader = DataLoader(train_dataset, batch_size=config['training']['batch_size'], 
                             shuffle=True, num_workers=4)
    val_loader = DataLoader(val_dataset, batch_size=config['training']['batch_size'], 
                           shuffle=False, num_workers=4)
    
    # Create model
    model = create_model(config).to(device)
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=config['training']['learning_rate'])
    
    # Training loop
    best_acc = 0.0
    for epoch in range(config['training']['epochs']):
        model.train()
        train_loss = 0.0
        
        for images, labels in tqdm(train_loader, desc=f"Epoch {epoch+1}"):
            images, labels = images.to(device), labels.to(device)
            
            optimizer.zero_grad()
            outputs = model(images)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()
            
            train_loss += loss.item()
        
        # Validation
        model.eval()
        correct = 0
        total = 0
        
        with torch.no_grad():
            for images, labels in val_loader:
                images, labels = images.to(device), labels.to(device)
                outputs = model(images)
                _, predicted = torch.max(outputs.data, 1)
                total += labels.size(0)
                correct += (predicted == labels).sum().item()
        
        val_acc = 100 * correct / total
        logger.info(f"Epoch {epoch+1}: Loss={train_loss/len(train_loader):.4f}, Val Acc={val_acc:.2f}%")
        
        # Save best model
        if val_acc > best_acc:
            best_acc = val_acc
            torch.save(model.state_dict(), 'models/best_model.pth')
            logger.info(f"Saved best model with accuracy: {best_acc:.2f}%")


if __name__ == "__main__":
    train_model()
