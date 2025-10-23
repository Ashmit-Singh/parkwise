import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';
import { User } from 'lucide-react';

export interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'offline' | 'away' | 'busy';
  fallback?: string;
  ring?: boolean;
  ringColor?: string;
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'Avatar',
  size = 'md',
  status,
  fallback,
  ring = false,
  ringColor = 'ring-primary-500',
  className,
}) => {
  const [imageError, setImageError] = React.useState(false);

  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
  };

  const statusSizes = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4',
  };

  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    away: 'bg-yellow-500',
    busy: 'bg-red-500',
  };

  const getInitials = (name?: string) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const showImage = src && !imageError;

  return (
    <motion.div
      className={cn('relative inline-block', className)}
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
    >
      <div
        className={cn(
          'rounded-full overflow-hidden flex items-center justify-center',
          'bg-gradient-to-br from-primary-400 to-primary-600',
          'text-white font-semibold',
          sizes[size],
          ring && `ring-2 ${ringColor} ring-offset-2 dark:ring-offset-gray-900`
        )}
      >
        {showImage ? (
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : fallback ? (
          <span>{getInitials(fallback)}</span>
        ) : (
          <User className="w-1/2 h-1/2" />
        )}
      </div>

      {status && (
        <motion.span
          className={cn(
            'absolute bottom-0 right-0 rounded-full border-2 border-white dark:border-gray-900',
            statusSizes[size],
            statusColors[status]
          )}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 15 }}
        />
      )}
    </motion.div>
  );
};

export default Avatar;
