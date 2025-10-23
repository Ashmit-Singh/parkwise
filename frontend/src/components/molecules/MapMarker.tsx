import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';
import { MapPin, Eye } from 'lucide-react';
import Badge from '../atoms/Badge';

export interface MapMarkerProps {
  species: string;
  count?: number;
  conservationStatus?: 'endangered' | 'vulnerable' | 'near-threatened' | 'least-concern' | 'data-deficient';
  isActive?: boolean;
  isCluster?: boolean;
  onClick?: () => void;
  className?: string;
}

const MapMarker: React.FC<MapMarkerProps> = ({
  species,
  count = 1,
  conservationStatus,
  isActive = false,
  isCluster = false,
  onClick,
  className,
}) => {
  const statusColors = {
    endangered: 'from-red-500 to-red-600',
    vulnerable: 'from-orange-500 to-orange-600',
    'near-threatened': 'from-yellow-500 to-yellow-600',
    'least-concern': 'from-green-500 to-green-600',
    'data-deficient': 'from-gray-500 to-gray-600',
  };

  const gradientClass = conservationStatus 
    ? statusColors[conservationStatus]
    : 'from-primary-500 to-primary-600';

  return (
    <motion.div
      className={cn('relative cursor-pointer', className)}
      initial={{ y: -100, opacity: 0, scale: 0 }}
      animate={{ 
        y: 0, 
        opacity: 1, 
        scale: isActive ? 1.2 : 1,
      }}
      transition={{
        type: 'spring',
        stiffness: 200,
        damping: 10,
        mass: 0.5,
      }}
      whileHover={{ scale: isActive ? 1.3 : 1.1 }}
      onClick={onClick}
    >
      {/* Pulse Animation */}
      {isActive && (
        <motion.div
          className={cn(
            'absolute inset-0 rounded-full bg-gradient-to-r opacity-30',
            gradientClass
          )}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}

      {/* Marker Pin */}
      <div className="relative">
        {isCluster ? (
          // Cluster Marker
          <motion.div
            className={cn(
              'w-12 h-12 rounded-full flex items-center justify-center',
              'bg-gradient-to-r shadow-lg border-2 border-white',
              gradientClass
            )}
            whileHover={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center">
              <div className="text-white font-bold text-lg">{count}</div>
              <Eye className="w-4 h-4 text-white mx-auto" />
            </div>
          </motion.div>
        ) : (
          // Single Marker
          <div className="relative">
            {/* Pin Shape */}
            <svg
              width="40"
              height="50"
              viewBox="0 0 40 50"
              className="drop-shadow-lg"
            >
              <defs>
                <linearGradient id={`gradient-${species}`} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" className={conservationStatus ? `text-${conservationStatus}-500` : 'text-primary-500'} stopColor="currentColor" />
                  <stop offset="100%" className={conservationStatus ? `text-${conservationStatus}-600` : 'text-primary-600'} stopColor="currentColor" />
                </linearGradient>
              </defs>
              <path
                d="M20 0C11.716 0 5 6.716 5 15c0 8.284 15 35 15 35s15-26.716 15-35c0-8.284-6.716-15-15-15z"
                fill={`url(#gradient-${species})`}
                stroke="white"
                strokeWidth="2"
              />
            </svg>

            {/* Icon */}
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
              <MapPin className="w-5 h-5 text-white" />
            </div>

            {/* Count Badge */}
            {count > 1 && (
              <motion.div
                className="absolute -top-2 -right-2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
              >
                <Badge variant="new" size="sm">
                  {count}
                </Badge>
              </motion.div>
            )}
          </div>
        )}

        {/* Tooltip on Hover */}
        <motion.div
          className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 pointer-events-none"
          initial={{ opacity: 0, y: 10 }}
          whileHover={{ opacity: 1, y: 0 }}
        >
          <div className="bg-black/80 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap">
            {species}
            {count > 1 && ` (${count} sightings)`}
          </div>
          <div className="w-2 h-2 bg-black/80 transform rotate-45 mx-auto -mt-1" />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MapMarker;
