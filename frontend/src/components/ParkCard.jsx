import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Users, ArrowRight } from 'lucide-react';

const ParkCard = ({ park, index, onSelect }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'protected': return 'bg-green-100 text-green-800';
      case 'endangered': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden hover-lift group cursor-pointer"
      onClick={() => onSelect(park)}
    >
      <div className="relative overflow-hidden">
        <img
          src={park.imageUrl || '/api/placeholder/400/250'}
          alt={park.name}
          className="w-full h-48 object-cover group-hover:scale-110 transition duration-500"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition duration-300" />
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(park.conservationStatus)}`}>
            {park.conservationStatus}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-green-600 transition-colors duration-300">
          {park.name}
        </h3>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600">
            <MapPin className="h-4 w-4 mr-2" />
            <span className="text-sm">{park.state}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            <span className="text-sm">Est. {park.establishedYear}</span>
          </div>
          {park.area && (
            <div className="flex items-center text-gray-600">
              <Users className="h-4 w-4 mr-2" />
              <span className="text-sm">{park.area} km²</span>
            </div>
          )}
        </div>
        
        <p className="text-gray-600 text-sm line-clamp-2 mb-4 leading-relaxed">
          {park.description}
        </p>
        
        <div className="flex items-center justify-between">
          <button className="flex items-center text-green-600 font-semibold text-sm group-hover:text-green-700 transition-colors duration-300">
            Explore Park
            <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
          {park.keyAttractions && (
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {park.keyAttractions.split(',')[0]}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ParkCard;