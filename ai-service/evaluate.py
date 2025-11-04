"""
ParkWise AI Species Identification - Model Evaluation
Evaluate trained model performance on test set
"""

import torch
import torch.nn.functional as F
from torch.utils.data import DataLoader
import pandas as pd
import numpy as np
from pathlib import Path
import yaml
import json
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import (
    accuracy_score, precision_recall_fscore_support,
    confusion_matrix, classification_report
)
from tqdm import tqdm
import logging

from train import SpeciesDataset
from models.species_classifier import create_model

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class ModelEvaluator:
    """Evaluate model performance"""
    
    def __init__(self, config_path='config/training_config.yaml', 
                 model_path='models/best_model.pth'):
        
        with open(config_path, 'r') as f:
            self.config = yaml.safe_load(f)
        
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        
        # Load model
        self.model = create_model(self.config)
        self.model.load_state_dict(torch.load(model_path, map_location=self.device))
        self.model.to(self.device)
        self.model.eval()
        
        # Load class mapping
        data_dir = Path(self.config['dataset']['processed_dir'])
        with open(data_dir / 'class_mapping.json', 'r') as f:
            mapping = json.load(f)
            self.idx_to_class = {int(k): v for k, v in mapping['idx_to_class'].items()}
            self.class_to_idx = mapping['class_to_idx']
        
        logger.info("Model loaded for evaluation")
    
    def evaluate_test_set(self):
        """Evaluate on test set"""
        from torchvision import transforms
        
        test_transform = transforms.Compose([
            transforms.Resize(256),
            transforms.CenterCrop(224),
            transforms.ToTensor(),
            transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
        ])
        
        data_dir = Path(self.config['dataset']['processed_dir'])
        test_df = pd.read_csv(data_dir / 'test_metadata.csv')
        test_dataset = SpeciesDataset(data_dir, test_df, test_transform)
        test_loader = DataLoader(test_dataset, batch_size=32, shuffle=False)
        
        all_preds = []
        all_labels = []
        all_probs = []
        
        logger.info("Running evaluation on test set...")
        
        with torch.no_grad():
            for images, labels in tqdm(test_loader):
                images, labels = images.to(self.device), labels.to(self.device)
                outputs = self.model(images)
                probs = F.softmax(outputs, dim=1)
                _, predicted = torch.max(outputs, 1)
                
                all_preds.extend(predicted.cpu().numpy())
                all_labels.extend(labels.cpu().numpy())
                all_probs.extend(probs.cpu().numpy())
        
        return np.array(all_preds), np.array(all_labels), np.array(all_probs)
    
    def calculate_metrics(self, y_true, y_pred):
        """Calculate evaluation metrics"""
        accuracy = accuracy_score(y_true, y_pred)
        precision, recall, f1, _ = precision_recall_fscore_support(
            y_true, y_pred, average='weighted'
        )
        
        metrics = {
            'accuracy': float(accuracy),
            'precision': float(precision),
            'recall': float(recall),
            'f1_score': float(f1)
        }
        
        # Per-class metrics
        class_report = classification_report(
            y_true, y_pred,
            target_names=[self.idx_to_class[i] for i in range(len(self.idx_to_class))],
            output_dict=True
        )
        
        return metrics, class_report
    
    def plot_confusion_matrix(self, y_true, y_pred, save_path='results/confusion_matrix.png'):
        """Plot confusion matrix"""
        cm = confusion_matrix(y_true, y_pred)
        
        plt.figure(figsize=(12, 10))
        sns.heatmap(cm, annot=True, fmt='d', cmap='Blues',
                   xticklabels=[self.idx_to_class[i] for i in range(len(self.idx_to_class))],
                   yticklabels=[self.idx_to_class[i] for i in range(len(self.idx_to_class))])
        plt.title('Confusion Matrix')
        plt.ylabel('True Label')
        plt.xlabel('Predicted Label')
        plt.xticks(rotation=45, ha='right')
        plt.yticks(rotation=0)
        plt.tight_layout()
        
        Path(save_path).parent.mkdir(parents=True, exist_ok=True)
        plt.savefig(save_path, dpi=300, bbox_inches='tight')
        logger.info(f"Confusion matrix saved to {save_path}")
    
    def plot_top_k_accuracy(self, y_true, y_probs, k_values=[1, 3, 5], 
                           save_path='results/topk_accuracy.png'):
        """Plot top-k accuracy"""
        accuracies = []
        
        for k in k_values:
            top_k_preds = np.argsort(y_probs, axis=1)[:, -k:]
            correct = sum([y_true[i] in top_k_preds[i] for i in range(len(y_true))])
            accuracy = correct / len(y_true)
            accuracies.append(accuracy)
        
        plt.figure(figsize=(8, 6))
        plt.bar([f'Top-{k}' for k in k_values], accuracies)
        plt.ylabel('Accuracy')
        plt.title('Top-K Accuracy')
        plt.ylim([0, 1])
        
        for i, acc in enumerate(accuracies):
            plt.text(i, acc + 0.02, f'{acc:.3f}', ha='center')
        
        Path(save_path).parent.mkdir(parents=True, exist_ok=True)
        plt.savefig(save_path, dpi=300, bbox_inches='tight')
        logger.info(f"Top-k accuracy plot saved to {save_path}")
    
    def run_evaluation(self):
        """Run complete evaluation pipeline"""
        logger.info("Starting model evaluation...")
        
        # Evaluate
        y_pred, y_true, y_probs = self.evaluate_test_set()
        
        # Calculate metrics
        metrics, class_report = self.calculate_metrics(y_true, y_pred)
        
        logger.info("\n" + "="*60)
        logger.info("EVALUATION RESULTS")
        logger.info("="*60)
        logger.info(f"Accuracy:  {metrics['accuracy']:.4f}")
        logger.info(f"Precision: {metrics['precision']:.4f}")
        logger.info(f"Recall:    {metrics['recall']:.4f}")
        logger.info(f"F1-Score:  {metrics['f1_score']:.4f}")
        logger.info("="*60)
        
        # Save results
        results_dir = Path('results')
        results_dir.mkdir(exist_ok=True)
        
        with open(results_dir / 'evaluation_metrics.json', 'w') as f:
            json.dump({
                'overall_metrics': metrics,
                'per_class_metrics': class_report
            }, f, indent=2)
        
        # Plot confusion matrix
        self.plot_confusion_matrix(y_true, y_pred)
        
        # Plot top-k accuracy
        self.plot_top_k_accuracy(y_true, y_probs)
        
        logger.info(f"\nResults saved to {results_dir}/")
        
        return metrics


def main():
    evaluator = ModelEvaluator()
    evaluator.run_evaluation()


if __name__ == "__main__":
    main()
