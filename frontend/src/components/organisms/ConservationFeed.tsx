import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';
import Avatar from '../atoms/Avatar';
import Badge from '../atoms/Badge';
import { MapPin, Heart, TrendingUp, Camera, Award, Bell } from 'lucide-react';

interface FeedItem {
  id: string;
  type: 'sighting' | 'donation' | 'milestone' | 'achievement' | 'alert';
  user?: {
    name: string;
    avatar?: string;
  };
  species?: string;
  location?: string;
  amount?: number;
  campaign?: string;
  message: string;
  timestamp: Date;
  imageUrl?: string;
}

interface ConservationFeedProps {
  items?: FeedItem[];
  onLoadMore?: () => void;
  className?: string;
}

const ConservationFeed: React.FC<ConservationFeedProps> = ({
  items = [],
  onLoadMore,
  className,
}) => {
  const [feedItems, setFeedItems] = useState<FeedItem[]>(items);
  const [isLoading, setIsLoading] = useState(false);

  // Mock real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      const newItem: FeedItem = {
        id: Date.now().toString(),
        type: 'sighting',
        user: {
          name: 'Wildlife Observer',
          avatar: undefined,
        },
        species: 'Bengal Tiger',
        location: 'Jim Corbett National Park',
        message: 'Spotted a Bengal Tiger near the river',
        timestamp: new Date(),
      };
      
      setFeedItems(prev => [newItem, ...prev].slice(0, 20));
    }, 30000); // New item every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getIcon = (type: FeedItem['type']) => {
    switch (type) {
      case 'sighting':
        return <Camera className="w-5 h-5" />;
      case 'donation':
        return <Heart className="w-5 h-5" />;
      case 'milestone':
        return <TrendingUp className="w-5 h-5" />;
      case 'achievement':
        return <Award className="w-5 h-5" />;
      case 'alert':
        return <Bell className="w-5 h-5" />;
    }
  };

  const getColor = (type: FeedItem['type']) => {
    switch (type) {
      case 'sighting':
        return 'from-blue-500 to-blue-600';
      case 'donation':
        return 'from-pink-500 to-pink-600';
      case 'milestone':
        return 'from-green-500 to-green-600';
      case 'achievement':
        return 'from-purple-500 to-purple-600';
      case 'alert':
        return 'from-orange-500 to-orange-600';
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className={cn('w-full', className)}>
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden dark:bg-black/30 dark:border-white/10">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Live Conservation Feed
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Real-time updates from the field
              </p>
            </div>
            <Badge variant="new" pulse>
              Live
            </Badge>
          </div>
        </div>

        {/* Feed Items */}
        <div className="divide-y divide-white/10 max-h-[600px] overflow-y-auto">
          <AnimatePresence initial={false}>
            {feedItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                className="p-6 hover:bg-white/5 dark:hover:bg-white/5 transition-colors"
              >
                <div className="flex gap-4">
                  {/* Icon */}
                  <div className={cn(
                    'flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center',
                    'bg-gradient-to-br text-white',
                    getColor(item.type)
                  )}>
                    {getIcon(item.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex items-center gap-2">
                        {item.user && (
                          <>
                            <Avatar
                              src={item.user.avatar}
                              fallback={item.user.name}
                              size="sm"
                            />
                            <span className="font-semibold text-gray-900 dark:text-white">
                              {item.user.name}
                            </span>
                          </>
                        )}
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-500 whitespace-nowrap">
                        {formatTimestamp(item.timestamp)}
                      </span>
                    </div>

                    <p className="text-gray-700 dark:text-gray-300 mb-2">
                      {item.message}
                    </p>

                    {/* Metadata */}
                    <div className="flex flex-wrap gap-2">
                      {item.species && (
                        <Badge variant="least-concern" size="sm">
                          {item.species}
                        </Badge>
                      )}
                      {item.location && (
                        <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                          <MapPin className="w-3 h-3" />
                          <span>{item.location}</span>
                        </div>
                      )}
                      {item.amount && (
                        <Badge variant="rank" size="sm">
                          ₹{item.amount.toLocaleString()}
                        </Badge>
                      )}
                    </div>

                    {/* Image */}
                    {item.imageUrl && (
                      <motion.img
                        src={item.imageUrl}
                        alt="Feed item"
                        className="mt-3 rounded-xl w-full h-48 object-cover"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Load More */}
        {onLoadMore && (
          <div className="p-4 border-t border-white/10">
            <button
              onClick={() => {
                setIsLoading(true);
                onLoadMore();
                setTimeout(() => setIsLoading(false), 1000);
              }}
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 dark:bg-white/5 dark:hover:bg-white/10 transition-colors text-gray-700 dark:text-gray-300 font-medium disabled:opacity-50"
            >
              {isLoading ? 'Loading...' : 'Load More'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConservationFeed;
