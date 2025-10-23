import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';
import Avatar from '../atoms/Avatar';
import Badge from '../atoms/Badge';
import { Trophy, Medal, Award, TrendingUp, Star, Crown } from 'lucide-react';

interface LeaderboardUser {
  id: string;
  name: string;
  avatar?: string;
  rank: number;
  points: number;
  sightings: number;
  donations: number;
  achievements: number;
  rankTitle: string;
  change: number; // Position change from last period
}

interface LeaderboardPanelProps {
  users?: LeaderboardUser[];
  currentUserId?: string;
  period?: 'daily' | 'weekly' | 'monthly' | 'all-time';
  onPeriodChange?: (period: 'daily' | 'weekly' | 'monthly' | 'all-time') => void;
  className?: string;
}

const LeaderboardPanel: React.FC<LeaderboardPanelProps> = ({
  users = [],
  currentUserId,
  period = 'weekly',
  onPeriodChange,
  className,
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState(period);
  const [selectedUser, setSelectedUser] = useState<LeaderboardUser | null>(null);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return <Trophy className="w-5 h-5 text-gray-500" />;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'from-yellow-400 to-yellow-600';
      case 2:
        return 'from-gray-300 to-gray-500';
      case 3:
        return 'from-amber-500 to-amber-700';
      default:
        return 'from-gray-600 to-gray-800';
    }
  };

  const handlePeriodChange = (newPeriod: typeof selectedPeriod) => {
    setSelectedPeriod(newPeriod);
    onPeriodChange?.(newPeriod);
  };

  return (
    <div className={cn('w-full', className)}>
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden dark:bg-black/30 dark:border-white/10">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-gradient-to-br from-amber-400 to-amber-600">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Citizen Scientist Leaderboard
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Top contributors making a difference
                </p>
              </div>
            </div>
          </div>

          {/* Period Selector */}
          <div className="flex gap-2">
            {(['daily', 'weekly', 'monthly', 'all-time'] as const).map((p) => (
              <button
                key={p}
                onClick={() => handlePeriodChange(p)}
                className={cn(
                  'px-4 py-2 rounded-xl font-medium text-sm transition-all',
                  selectedPeriod === p
                    ? 'bg-primary-500 text-white shadow-lg'
                    : 'bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-white/10'
                )}
              >
                {p.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Top 3 Podium */}
        <div className="p-6 bg-gradient-to-b from-white/5 to-transparent dark:from-white/5">
          <div className="flex items-end justify-center gap-4 mb-6">
            {/* 2nd Place */}
            {users[1] && (
              <motion.div
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Avatar
                  src={users[1].avatar}
                  fallback={users[1].name}
                  size="lg"
                  ring
                  ringColor="ring-gray-400"
                />
                <div className="mt-2 text-center">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {users[1].name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {users[1].points.toLocaleString()} pts
                  </p>
                </div>
                <div className="mt-2 w-20 h-16 bg-gradient-to-t from-gray-300 to-gray-500 rounded-t-lg flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
              </motion.div>
            )}

            {/* 1st Place */}
            {users[0] && (
              <motion.div
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="relative">
                  <Avatar
                    src={users[0].avatar}
                    fallback={users[0].name}
                    size="xl"
                    ring
                    ringColor="ring-yellow-500"
                  />
                  <motion.div
                    className="absolute -top-2 -right-2"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Crown className="w-8 h-8 text-yellow-500" />
                  </motion.div>
                </div>
                <div className="mt-2 text-center">
                  <p className="font-bold text-lg text-gray-900 dark:text-white">
                    {users[0].name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {users[0].points.toLocaleString()} pts
                  </p>
                </div>
                <div className="mt-2 w-20 h-24 bg-gradient-to-t from-yellow-400 to-yellow-600 rounded-t-lg flex items-center justify-center shadow-lg">
                  <span className="text-3xl font-bold text-white">1</span>
                </div>
              </motion.div>
            )}

            {/* 3rd Place */}
            {users[2] && (
              <motion.div
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Avatar
                  src={users[2].avatar}
                  fallback={users[2].name}
                  size="lg"
                  ring
                  ringColor="ring-amber-600"
                />
                <div className="mt-2 text-center">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {users[2].name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {users[2].points.toLocaleString()} pts
                  </p>
                </div>
                <div className="mt-2 w-20 h-12 bg-gradient-to-t from-amber-500 to-amber-700 rounded-t-lg flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Leaderboard List */}
        <div className="divide-y divide-white/10 max-h-96 overflow-y-auto">
          <AnimatePresence>
            {users.slice(3).map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  'p-4 hover:bg-white/5 dark:hover:bg-white/5 transition-colors cursor-pointer',
                  currentUserId === user.id && 'bg-primary-500/10 border-l-4 border-primary-500'
                )}
                onClick={() => setSelectedUser(user)}
              >
                <div className="flex items-center gap-4">
                  {/* Rank */}
                  <div className="flex-shrink-0 w-12 text-center">
                    <span className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                      {user.rank}
                    </span>
                  </div>

                  {/* Avatar & Info */}
                  <Avatar
                    src={user.avatar}
                    fallback={user.name}
                    size="md"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-gray-900 dark:text-white truncate">
                        {user.name}
                      </p>
                      {currentUserId === user.id && (
                        <Badge variant="new" size="sm">You</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                      <span>{user.sightings} sightings</span>
                      <span>•</span>
                      <span>{user.achievements} achievements</span>
                    </div>
                  </div>

                  {/* Points & Change */}
                  <div className="flex-shrink-0 text-right">
                    <div className="flex items-center gap-2 mb-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="font-bold text-gray-900 dark:text-white">
                        {user.points.toLocaleString()}
                      </span>
                    </div>
                    {user.change !== 0 && (
                      <div className={cn(
                        'flex items-center gap-1 text-xs',
                        user.change > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      )}>
                        <TrendingUp className={cn(
                          'w-3 h-3',
                          user.change < 0 && 'rotate-180'
                        )} />
                        <span>{Math.abs(user.change)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* User Detail Modal */}
        <AnimatePresence>
          {selectedUser && (
            <>
              <motion.div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedUser(null)}
              />
              <motion.div
                className="fixed inset-0 flex items-center justify-center z-50 p-4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <div
                  className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 max-w-md w-full dark:bg-black/30"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="text-center mb-6">
                    <Avatar
                      src={selectedUser.avatar}
                      fallback={selectedUser.name}
                      size="xl"
                      className="mx-auto mb-4"
                    />
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      {selectedUser.name}
                    </h3>
                    <Badge variant="rank" size="lg">
                      {selectedUser.rankTitle}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-4 rounded-xl bg-white/5">
                      <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                        {selectedUser.points.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Total Points
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5">
                      <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                        #{selectedUser.rank}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Global Rank
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5">
                      <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                        {selectedUser.sightings}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Sightings
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5">
                      <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                        {selectedUser.achievements}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Achievements
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedUser(null)}
                    className="w-full py-3 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-semibold transition-colors"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LeaderboardPanel;
