import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';
import Badge from '../atoms/Badge';
import Button from '../atoms/Button';
import { Eye, MapPin, Camera, Heart, Info } from 'lucide-react';

export interface SpeciesCardProps {
  id: number;
  name: string;
  scientificName: string;
  conservationStatus: 'endangered' | 'vulnerable' | 'near-threatened' | 'least-concern' | 'data-deficient';
  imageUrl: string;
  habitat?: string;
  sightings?: number;
  lastSeen?: string;
  description?: string;
  onIdentify?: () => void;
  onViewDetails?: () => void;
  onReportSighting?: () => void;
  className?: string;
}

const SpeciesCard: React.FC<SpeciesCardProps> = ({
  name,
  scientificName,
  conservationStatus,
  imageUrl,
  habitat,
  sightings,
  lastSeen,
  description,
  onIdentify,
  onViewDetails,
  onReportSighting,
  className,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const conservationLabels = {
    endangered: 'Endangered',
    vulnerable: 'Vulnerable',
    'near-threatened': 'Near Threatened',
    'least-concern': 'Least Concern',
    'data-deficient': 'Data Deficient',
  };

  return (
    <motion.div
      className={cn('relative w-full h-96 perspective-1000', className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <motion.div
        className="relative w-full h-full cursor-pointer preserve-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* Front Side */}
        <div className="absolute w-full h-full backface-hidden">
          <div className="relative w-full h-full rounded-2xl overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 shadow-xl dark:bg-black/30 dark:border-white/10">
            {/* Image */}
            <div className="relative h-56 overflow-hidden">
              <motion.img
                src={imageUrl}
                alt={name}
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {/* Conservation Badge */}
              <div className="absolute top-4 right-4">
                <Badge variant={conservationStatus} glow>
                  {conservationLabels[conservationStatus]}
                </Badge>
              </div>

              {/* Like Button */}
              <motion.button
                className="absolute top-4 left-4 p-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsLiked(!isLiked);
                }}
              >
                <Heart
                  className={cn(
                    'w-5 h-5 transition-colors',
                    isLiked ? 'fill-red-500 text-red-500' : 'text-white'
                  )}
                />
              </motion.button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {name}
                </h3>
                <p className="text-sm italic text-gray-600 dark:text-gray-400">
                  {scientificName}
                </p>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                {habitat && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{habitat}</span>
                  </div>
                )}
                {sightings !== undefined && (
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{sightings} sightings</span>
                  </div>
                )}
              </div>

              {lastSeen && (
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  Last seen: {lastSeen}
                </p>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="glass"
                  leftIcon={<Camera className="w-4 h-4" />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onIdentify?.();
                  }}
                  className="flex-1"
                >
                  Identify
                </Button>
                <Button
                  size="sm"
                  variant="glass"
                  leftIcon={<Info className="w-4 h-4" />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewDetails?.();
                  }}
                  className="flex-1"
                >
                  Details
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Back Side */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180">
          <div className="w-full h-full rounded-2xl overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 shadow-xl dark:bg-black/30 dark:border-white/10 p-6 flex flex-col">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              About {name}
            </h3>
            
            <div className="flex-1 overflow-y-auto">
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {description || 'No description available for this species.'}
              </p>
            </div>

            <div className="mt-4 space-y-2">
              <Button
                variant="primary"
                size="sm"
                leftIcon={<MapPin className="w-4 h-4" />}
                onClick={(e) => {
                  e.stopPropagation();
                  onReportSighting?.();
                }}
                className="w-full"
              >
                Report Sighting
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFlipped(false);
                }}
                className="w-full"
              >
                Back to Card
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SpeciesCard;
