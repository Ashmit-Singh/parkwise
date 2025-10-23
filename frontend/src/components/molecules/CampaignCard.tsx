import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';
import Button from '../atoms/Button';
import Badge from '../atoms/Badge';
import { Heart, Users, TrendingUp, Share2, MapPin, Calendar } from 'lucide-react';

export interface CampaignCardProps {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  currentAmount: number;
  targetAmount: number;
  supporters: number;
  daysLeft: number;
  location?: string;
  category?: string;
  onDonate?: () => void;
  onShare?: () => void;
  className?: string;
}

const CampaignCard: React.FC<CampaignCardProps> = ({
  title,
  description,
  imageUrl,
  currentAmount = 0,
  targetAmount = 100000,
  supporters = 0,
  daysLeft = 30,
  location,
  category,
  onDonate,
  onShare,
  className,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const progress = targetAmount > 0 ? (currentAmount / targetAmount) * 100 : 0;

  return (
    <motion.div
      className={cn('relative w-full', className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <div className="relative h-full rounded-2xl overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 shadow-xl dark:bg-black/30 dark:border-white/10">
        {/* Image Section */}
        <div className="relative h-48 overflow-hidden">
          <motion.img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Category Badge */}
          {category && (
            <div className="absolute top-4 left-4">
              <Badge variant="new" glow>
                {category}
              </Badge>
            </div>
          )}

          {/* Share Button */}
          <motion.button
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onShare}
          >
            <Share2 className="w-5 h-5 text-white" />
          </motion.button>

          {/* Days Left Badge */}
          {daysLeft > 0 && (
            <div className="absolute bottom-4 right-4">
              <Badge variant="new" size="sm">
                {daysLeft} days left
              </Badge>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-6 space-y-4">
          {/* Title & Description */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
              {title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {description}
            </p>
          </div>

          {/* Location */}
          {location && (
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <MapPin className="w-4 h-4" />
              <span>{location}</span>
            </div>
          )}

          {/* Progress Section */}
          <div className="space-y-2">
            {/* Progress Bar */}
            <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-400 to-green-600 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
              
              {/* Shimmer Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              />
            </div>

            {/* Amount Info */}
            <div className="flex justify-between items-center text-sm">
              <div>
                <span className="font-bold text-gray-900 dark:text-white">
                  ₹{currentAmount.toLocaleString()}
                </span>
                <span className="text-gray-600 dark:text-gray-400">
                  {' '}raised of ₹{targetAmount.toLocaleString()}
                </span>
              </div>
              <span className="text-gray-600 dark:text-gray-400">
                {progress.toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 pt-2 border-t border-white/10">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Users className="w-4 h-4" />
              <span>{supporters} supporters</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <TrendingUp className="w-4 h-4" />
              <span>{((currentAmount / targetAmount) * 100).toFixed(0)}% funded</span>
            </div>
          </div>

          {/* Action Button */}
          <Button
            variant="primary"
            size="md"
            leftIcon={<Heart className="w-5 h-5" />}
            onClick={onDonate}
            className="w-full"
            glow
          >
            Support Campaign
          </Button>
        </div>

        {/* Hover Glow Effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-2xl"
          animate={{
            boxShadow: isHovered
              ? '0 0 30px rgba(76, 175, 80, 0.3)'
              : '0 0 0px rgba(76, 175, 80, 0)',
          }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </motion.div>
  );
};

export default CampaignCard;
