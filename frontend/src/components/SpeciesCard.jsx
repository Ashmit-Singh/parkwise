import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, PawPrint, AlertTriangle } from 'lucide-react';

const SpeciesCard = ({ species, index }) => {
  const getConservationColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'CRITICAL':
      case 'CRITICALLY ENDANGERED':
        return 'bg-red-500';
      case 'ENDANGERED':
        return 'bg-orange-500';
      case 'VULNERABLE':
        return 'bg-yellow-500';
      case 'NEAR THREATENED':
        return 'bg-blue-500';
      default:
        return 'bg-green-500';
    }
  };

  const getTypeIcon = (type) => {
    return type === 'FLORA' ? 
      <Leaf className="h-5 w-5" /> : 
      <PawPrint className="h-5 w-5" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden hover-lift group"
    >
      <div className="relative">
        <img
          src={species.imageUrl || '/api/placeholder/400/300'}
          alt={species.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition duration-500"
        />
        <div className="absolute top-4 left-4 flex items-center space-x-2">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2">
            {getTypeIcon(species.type)}
          </div>
          {species.conservationStatus && (
            <div className={`${getConservationColor(species.conservationStatus)} text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1`}>
              <AlertTriangle className="h-3 w-3" />
              <span>{species.conservationStatus}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-green-600 transition-colors duration-300">
          {species.name}
        </h3>
        {species.scientificName && (
          <p className="text-gray-500 text-sm italic mb-3">
            {species.scientificName}
          </p>
        )}
        
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
          {species.description}
        </p>
        
        <div className="space-y-2 text-sm text-gray-600">
          {species.habitat && (
            <div>
              <strong>Habitat:</strong> {species.habitat}
            </div>
          )}
          {species.diet && (
            <div>
              <strong>Diet:</strong> {species.diet}
            </div>
          )}
          {species.lifespan && (
            <div>
              <strong>Lifespan:</strong> {species.lifespan}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default SpeciesCard;