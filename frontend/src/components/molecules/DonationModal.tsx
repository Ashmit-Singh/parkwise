import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';
import Button from '../atoms/Button';
import { X, Wallet, DollarSign, Heart, TrendingUp, Shield, CheckCircle } from 'lucide-react';
import { modalBackdrop, modalContent } from '../../theme/animations';

export interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaignName: string;
  campaignId: number;
  currentAmount: number;
  targetAmount: number;
  onDonate?: (amount: number) => Promise<void>;
}

const DonationModal: React.FC<DonationModalProps> = ({
  isOpen,
  onClose,
  campaignName,
  currentAmount,
  targetAmount,
  onDonate,
}) => {
  const [amount, setAmount] = useState<number>(100);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);

  const presetAmounts = [50, 100, 250, 500, 1000, 2500];

  const handleDonate = async () => {
    setIsProcessing(true);
    try {
      await onDonate?.(amount);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 3000);
    } catch (error) {
      console.error('Donation failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const connectWallet = async () => {
    // Mock wallet connection
    setWalletConnected(true);
  };

  const progress = (currentAmount / targetAmount) * 100;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            variants={modalBackdrop}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              className="relative w-full max-w-lg"
              variants={modalContent}
              initial="initial"
              animate="animate"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden dark:bg-black/30 dark:border-white/10">
                {/* Success Overlay */}
                <AnimatePresence>
                  {isSuccess && (
                    <motion.div
                      className="absolute inset-0 bg-green-500/90 backdrop-blur-sm flex items-center justify-center z-10"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                    >
                      <div className="text-center text-white">
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: 'spring', stiffness: 200 }}
                        >
                          <CheckCircle className="w-20 h-20 mx-auto mb-4" />
                        </motion.div>
                        <h3 className="text-2xl font-bold mb-2">Thank You!</h3>
                        <p className="text-lg">Your donation makes a difference</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-20"
                >
                  <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                </button>

                {/* Header */}
                <div className="p-6 border-b border-white/10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-full bg-gradient-to-br from-green-400 to-green-600">
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Support {campaignName}
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Every contribution helps conservation
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        ₹{currentAmount.toLocaleString()} raised
                      </span>
                      <span className="text-gray-600 dark:text-gray-400">
                        ₹{targetAmount.toLocaleString()} goal
                      </span>
                    </div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-green-400 to-green-600"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-500 text-right">
                      {progress.toFixed(1)}% funded
                    </p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                  {/* Wallet Connection */}
                  {!walletConnected ? (
                    <div className="space-y-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                        Connect your wallet to make a blockchain-verified donation
                      </p>
                      <Button
                        variant="primary"
                        leftIcon={<Wallet className="w-5 h-5" />}
                        onClick={connectWallet}
                        className="w-full"
                        glow
                      >
                        Connect Wallet
                      </Button>
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                        <Shield className="w-4 h-4" />
                        <span>Secured by blockchain technology</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Amount Selection */}
                      <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Select Amount (₹)
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {presetAmounts.map((preset) => (
                            <motion.button
                              key={preset}
                              onClick={() => setAmount(preset)}
                              className={cn(
                                'p-3 rounded-xl border-2 font-semibold transition-all',
                                amount === preset
                                  ? 'border-green-500 bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                                  : 'border-gray-200 bg-white/50 text-gray-700 dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-300'
                              )}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              ₹{preset}
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      {/* Custom Amount */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Or enter custom amount
                        </label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 bg-white/50 focus:ring-2 focus:ring-green-500 focus:border-transparent dark:border-gray-700 dark:bg-gray-800/50 dark:text-white"
                            min="10"
                          />
                        </div>
                      </div>

                      {/* Impact Preview */}
                      <div className="p-4 rounded-xl bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border border-green-200 dark:border-green-800">
                        <div className="flex items-start gap-3">
                          <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                              Your Impact
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              ₹{amount} can help protect {Math.floor(amount / 50)} acres of habitat
                              or support {Math.floor(amount / 100)} camera traps for wildlife monitoring.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Donate Button */}
                      <Button
                        variant="primary"
                        size="lg"
                        leftIcon={<Heart className="w-5 h-5" />}
                        onClick={handleDonate}
                        isLoading={isProcessing}
                        className="w-full"
                        glow
                      >
                        {isProcessing ? 'Processing...' : `Donate ₹${amount}`}
                      </Button>

                      {/* Security Note */}
                      <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                        <Shield className="w-4 h-4" />
                        <span>100% transparent • Blockchain verified • Tax deductible</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default DonationModal;
