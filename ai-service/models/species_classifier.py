"""
ParkWise AI Species Identification - Model Architecture
Custom CNN models for wildlife species classification
"""

import torch
import torch.nn as nn
import torchvision.models as models
import timm
from typing import Optional


class SpeciesClassifier(nn.Module):
    """Base species classification model with multiple backbone options"""
    
    def __init__(
        self,
        num_classes: int,
        architecture: str = 'efficientnet_b3',
        pretrained: bool = True,
        dropout_rate: float = 0.3,
        freeze_backbone: bool = False
    ):
        super(SpeciesClassifier, self).__init__()
        
        self.num_classes = num_classes
        self.architecture = architecture
        
        # Select backbone architecture
        if architecture == 'resnet50':
            self.backbone = models.resnet50(pretrained=pretrained)
            num_features = self.backbone.fc.in_features
            self.backbone.fc = nn.Identity()
            
        elif architecture == 'efficientnet_b3':
            self.backbone = timm.create_model('efficientnet_b3', pretrained=pretrained)
            num_features = self.backbone.classifier.in_features
            self.backbone.classifier = nn.Identity()
            
        elif architecture == 'efficientnet_b4':
            self.backbone = timm.create_model('efficientnet_b4', pretrained=pretrained)
            num_features = self.backbone.classifier.in_features
            self.backbone.classifier = nn.Identity()
            
        elif architecture == 'vit_base':
            self.backbone = timm.create_model('vit_base_patch16_224', pretrained=pretrained)
            num_features = self.backbone.head.in_features
            self.backbone.head = nn.Identity()
            
        elif architecture == 'mobilenet_v3':
            self.backbone = models.mobilenet_v3_large(pretrained=pretrained)
            num_features = self.backbone.classifier[0].in_features
            self.backbone.classifier = nn.Identity()
            
        elif architecture == 'convnext_base':
            self.backbone = timm.create_model('convnext_base', pretrained=pretrained)
            num_features = self.backbone.head.fc.in_features
            self.backbone.head.fc = nn.Identity()
            
        else:
            raise ValueError(f"Unknown architecture: {architecture}")
        
        # Freeze backbone if specified
        if freeze_backbone:
            for param in self.backbone.parameters():
                param.requires_grad = False
        
        # Classification head
        self.classifier = nn.Sequential(
            nn.Dropout(dropout_rate),
            nn.Linear(num_features, 512),
            nn.ReLU(),
            nn.BatchNorm1d(512),
            nn.Dropout(dropout_rate / 2),
            nn.Linear(512, num_classes)
        )
        
    def forward(self, x):
        features = self.backbone(x)
        output = self.classifier(features)
        return output
    
    def get_features(self, x):
        """Extract features without classification"""
        return self.backbone(x)


class EnsembleSpeciesClassifier(nn.Module):
    """Ensemble of multiple models for improved accuracy"""
    
    def __init__(
        self,
        num_classes: int,
        architectures: list = ['efficientnet_b3', 'resnet50'],
        pretrained: bool = True,
        dropout_rate: float = 0.3
    ):
        super(EnsembleSpeciesClassifier, self).__init__()
        
        self.models = nn.ModuleList([
            SpeciesClassifier(
                num_classes=num_classes,
                architecture=arch,
                pretrained=pretrained,
                dropout_rate=dropout_rate
            )
            for arch in architectures
        ])
        
    def forward(self, x):
        # Average predictions from all models
        outputs = [model(x) for model in self.models]
        return torch.mean(torch.stack(outputs), dim=0)


class AttentionSpeciesClassifier(nn.Module):
    """Species classifier with attention mechanism for better feature focus"""
    
    def __init__(
        self,
        num_classes: int,
        architecture: str = 'efficientnet_b3',
        pretrained: bool = True,
        dropout_rate: float = 0.3
    ):
        super(AttentionSpeciesClassifier, self).__init__()
        
        # Backbone
        if architecture == 'efficientnet_b3':
            self.backbone = timm.create_model('efficientnet_b3', pretrained=pretrained, features_only=True)
            num_features = 1536  # EfficientNet-B3 final feature dimension
        elif architecture == 'resnet50':
            self.backbone = models.resnet50(pretrained=pretrained)
            self.backbone = nn.Sequential(*list(self.backbone.children())[:-2])
            num_features = 2048
        else:
            raise ValueError(f"Attention not implemented for {architecture}")
        
        # Spatial attention
        self.spatial_attention = nn.Sequential(
            nn.Conv2d(num_features, 1, kernel_size=1),
            nn.Sigmoid()
        )
        
        # Global average pooling
        self.gap = nn.AdaptiveAvgPool2d(1)
        
        # Classification head
        self.classifier = nn.Sequential(
            nn.Dropout(dropout_rate),
            nn.Linear(num_features, 512),
            nn.ReLU(),
            nn.BatchNorm1d(512),
            nn.Dropout(dropout_rate / 2),
            nn.Linear(512, num_classes)
        )
        
    def forward(self, x):
        # Extract features
        if isinstance(self.backbone, nn.Sequential):
            features = self.backbone(x)
        else:
            features = self.backbone(x)[-1]  # Get last feature map
        
        # Apply spatial attention
        attention_weights = self.spatial_attention(features)
        attended_features = features * attention_weights
        
        # Global pooling
        pooled = self.gap(attended_features)
        pooled = pooled.view(pooled.size(0), -1)
        
        # Classification
        output = self.classifier(pooled)
        return output


class MetricLearningClassifier(nn.Module):
    """Species classifier with metric learning for better feature separation"""
    
    def __init__(
        self,
        num_classes: int,
        architecture: str = 'efficientnet_b3',
        pretrained: bool = True,
        embedding_dim: int = 512,
        dropout_rate: float = 0.3
    ):
        super(MetricLearningClassifier, self).__init__()
        
        # Backbone
        if architecture == 'efficientnet_b3':
            self.backbone = timm.create_model('efficientnet_b3', pretrained=pretrained)
            num_features = self.backbone.classifier.in_features
            self.backbone.classifier = nn.Identity()
        else:
            self.backbone = models.resnet50(pretrained=pretrained)
            num_features = self.backbone.fc.in_features
            self.backbone.fc = nn.Identity()
        
        # Embedding layer
        self.embedding = nn.Sequential(
            nn.Linear(num_features, embedding_dim),
            nn.ReLU(),
            nn.BatchNorm1d(embedding_dim),
            nn.Dropout(dropout_rate)
        )
        
        # Classification head
        self.classifier = nn.Linear(embedding_dim, num_classes)
        
    def forward(self, x, return_embedding=False):
        features = self.backbone(x)
        embedding = self.embedding(features)
        
        if return_embedding:
            return embedding
        
        output = self.classifier(embedding)
        return output


def create_model(config: dict) -> nn.Module:
    """Factory function to create model based on configuration"""
    
    model_config = config['model']
    architecture = model_config['architecture']
    num_classes = model_config['num_classes']
    pretrained = model_config['pretrained']
    dropout_rate = model_config['dropout_rate']
    freeze_backbone = model_config.get('freeze_backbone', False)
    
    # Create model based on type
    model_type = model_config.get('type', 'standard')
    
    if model_type == 'standard':
        model = SpeciesClassifier(
            num_classes=num_classes,
            architecture=architecture,
            pretrained=pretrained,
            dropout_rate=dropout_rate,
            freeze_backbone=freeze_backbone
        )
    elif model_type == 'attention':
        model = AttentionSpeciesClassifier(
            num_classes=num_classes,
            architecture=architecture,
            pretrained=pretrained,
            dropout_rate=dropout_rate
        )
    elif model_type == 'metric_learning':
        model = MetricLearningClassifier(
            num_classes=num_classes,
            architecture=architecture,
            pretrained=pretrained,
            dropout_rate=dropout_rate
        )
    elif model_type == 'ensemble':
        architectures = model_config.get('ensemble_architectures', ['efficientnet_b3', 'resnet50'])
        model = EnsembleSpeciesClassifier(
            num_classes=num_classes,
            architectures=architectures,
            pretrained=pretrained,
            dropout_rate=dropout_rate
        )
    else:
        raise ValueError(f"Unknown model type: {model_type}")
    
    return model


if __name__ == "__main__":
    # Test model creation
    model = SpeciesClassifier(num_classes=50, architecture='efficientnet_b3')
    print(f"Model created: {model.architecture}")
    print(f"Total parameters: {sum(p.numel() for p in model.parameters()):,}")
    print(f"Trainable parameters: {sum(p.numel() for p in model.parameters() if p.requires_grad):,}")
    
    # Test forward pass
    x = torch.randn(2, 3, 224, 224)
    output = model(x)
    print(f"Output shape: {output.shape}")
