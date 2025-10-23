import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';
import Badge from '../atoms/Badge';
import { Shield, Link as LinkIcon, CheckCircle, Clock, TrendingUp, Eye } from 'lucide-react';

interface Transaction {
  id: string;
  hash: string;
  from: string;
  to: string;
  amount: number;
  campaign: string;
  timestamp: Date;
  status: 'pending' | 'confirmed' | 'completed';
  blockNumber?: number;
  confirmations: number;
}

interface BlockchainVisualizerProps {
  transactions?: Transaction[];
  campaignId?: number;
  showLiveUpdates?: boolean;
  className?: string;
}

const BlockchainVisualizer: React.FC<BlockchainVisualizerProps> = ({
  transactions = [],
  campaignId,
  showLiveUpdates = true,
  className,
}) => {
  const [txList, setTxList] = useState<Transaction[]>(transactions);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [totalDonations, setTotalDonations] = useState(0);

  // Mock real-time transaction updates
  useEffect(() => {
    if (!showLiveUpdates) return;

    const interval = setInterval(() => {
      const newTx: Transaction = {
        id: Date.now().toString(),
        hash: `0x${Math.random().toString(16).substr(2, 64)}`,
        from: `0x${Math.random().toString(16).substr(2, 40)}`,
        to: `0x${Math.random().toString(16).substr(2, 40)}`,
        amount: Math.floor(Math.random() * 5000) + 100,
        campaign: 'Save the Tigers',
        timestamp: new Date(),
        status: 'pending',
        confirmations: 0,
      };

      setTxList(prev => [newTx, ...prev].slice(0, 20));
    }, 15000); // New transaction every 15 seconds

    return () => clearInterval(interval);
  }, [showLiveUpdates]);

  // Calculate total donations
  useEffect(() => {
    const total = txList
      .filter(tx => tx.status === 'completed')
      .reduce((sum, tx) => sum + tx.amount, 0);
    setTotalDonations(total);
  }, [txList]);

  const getStatusColor = (status: Transaction['status']) => {
    switch (status) {
      case 'pending':
        return 'from-yellow-500 to-yellow-600';
      case 'confirmed':
        return 'from-blue-500 to-blue-600';
      case 'completed':
        return 'from-green-500 to-green-600';
    }
  };

  const getStatusIcon = (status: Transaction['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'confirmed':
        return <Shield className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
    }
  };

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className={cn('w-full', className)}>
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden dark:bg-black/30 dark:border-white/10">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-gradient-to-br from-purple-400 to-purple-600">
                <LinkIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Blockchain Ledger
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Transparent donation tracking
                </p>
              </div>
            </div>
            <Badge variant="new" pulse>
              Live
            </Badge>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span className="text-xs font-medium text-green-700 dark:text-green-300">
                  Total Raised
                </span>
              </div>
              <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                ₹{totalDonations.toLocaleString()}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
              <div className="flex items-center gap-2 mb-1">
                <LinkIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
                  Transactions
                </span>
              </div>
              <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                {txList.length}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
              <div className="flex items-center gap-2 mb-1">
                <Shield className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span className="text-xs font-medium text-purple-700 dark:text-purple-300">
                  Verified
                </span>
              </div>
              <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                100%
              </div>
            </div>
          </div>
        </div>

        {/* Transaction Flow Visualization */}
        <div className="p-6 border-b border-white/10">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
            Transaction Flow
          </h3>
          <div className="relative h-32">
            <svg className="w-full h-full">
              {/* Animated flow lines */}
              {txList.slice(0, 5).map((tx, index) => (
                <motion.g key={tx.id}>
                  <motion.path
                    d={`M ${index * 20} 60 Q ${index * 20 + 50} 20, ${index * 20 + 100} 60`}
                    stroke="url(#gradient)"
                    strokeWidth="2"
                    fill="none"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.6 }}
                    transition={{ duration: 2, ease: 'easeInOut' }}
                  />
                  <motion.circle
                    cx={index * 20 + 100}
                    cy={60}
                    r="4"
                    fill={tx.status === 'completed' ? '#4CAF50' : '#FFC107'}
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.5, 1] }}
                    transition={{ duration: 0.5, delay: 2 }}
                  />
                </motion.g>
              ))}
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#9C27B0" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#9C27B0" stopOpacity="0.8" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Transaction List */}
        <div className="divide-y divide-white/10 max-h-96 overflow-y-auto">
          <AnimatePresence>
            {txList.map((tx, index) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 hover:bg-white/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                onClick={() => setSelectedTx(tx)}
              >
                <div className="flex items-start gap-4">
                  {/* Status Icon */}
                  <div className={cn(
                    'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center',
                    'bg-gradient-to-br text-white',
                    getStatusColor(tx.status)
                  )}>
                    {getStatusIcon(tx.status)}
                  </div>

                  {/* Transaction Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-4 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900 dark:text-white">
                          ₹{tx.amount.toLocaleString()}
                        </span>
                        <Badge variant="least-concern" size="sm">
                          {tx.campaign}
                        </Badge>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-500">
                        {new Date(tx.timestamp).toLocaleTimeString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                      <span>From: {shortenAddress(tx.from)}</span>
                      <span>→</span>
                      <span>To: {shortenAddress(tx.to)}</span>
                    </div>

                    {tx.confirmations > 0 && (
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex-1 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-green-400 to-green-600"
                            initial={{ width: 0 }}
                            animate={{ width: `${(tx.confirmations / 12) * 100}%` }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {tx.confirmations}/12
                        </span>
                      </div>
                    )}
                  </div>

                  {/* View Details */}
                  <button className="flex-shrink-0 p-2 rounded-lg hover:bg-white/10 transition-colors">
                    <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Selected Transaction Details Modal */}
        <AnimatePresence>
          {selectedTx && (
            <>
              <motion.div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedTx(null)}
              />
              <motion.div
                className="fixed inset-0 flex items-center justify-center z-50 p-4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <div
                  className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 max-w-lg w-full dark:bg-black/30"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Transaction Details
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Hash:</span>
                      <p className="font-mono text-xs text-gray-900 dark:text-white break-all">
                        {selectedTx.hash}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        ₹{selectedTx.amount.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Status:</span>
                      <Badge variant={selectedTx.status === 'completed' ? 'least-concern' : 'new'}>
                        {selectedTx.status}
                      </Badge>
                    </div>
                    {selectedTx.blockNumber && (
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Block:</span>
                        <p className="font-mono text-gray-900 dark:text-white">
                          #{selectedTx.blockNumber}
                        </p>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setSelectedTx(null)}
                    className="mt-6 w-full py-3 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-semibold transition-colors"
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

export default BlockchainVisualizer;
