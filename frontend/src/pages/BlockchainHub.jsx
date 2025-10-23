import React, { useState, useEffect } from 'react';
import { blockchainAPI } from '../services/apiEnhanced';
import { useAuthStore } from '../stores/authStore';
import { 
  Blocks, 
  Award, 
  Shield, 
  TrendingUp,
  ExternalLink,
  CheckCircle,
  Clock,
  Coins,
  Trophy,
  Star,
  Zap
} from 'lucide-react';
import toast from 'react-hot-toast';
import { ethers } from 'ethers';

const BlockchainHub = () => {
  const { user } = useAuthStore();
  const [status, setStatus] = useState(null);
  const [userBadges, setUserBadges] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [mintingBadge, setMintingBadge] = useState(false);

  useEffect(() => {
    fetchBlockchainData();
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.listAccounts();
        
        if (accounts.length > 0) {
          setWalletConnected(true);
          setWalletAddress(accounts[0].address);
        }
      } catch (error) {
        console.error('Error checking wallet:', error);
      }
    }
  };

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send('eth_requestAccounts', []);
        
        setWalletConnected(true);
        setWalletAddress(accounts[0]);
        toast.success('Wallet connected successfully!');
      } catch (error) {
        console.error('Error connecting wallet:', error);
        toast.error('Failed to connect wallet');
      }
    } else {
      toast.error('Please install MetaMask to use blockchain features');
    }
  };

  const fetchBlockchainData = async () => {
    try {
      setLoading(true);
      
      // Fetch blockchain status
      const statusRes = await blockchainAPI.getStatus();
      setStatus(statusRes.data);

      // Fetch user transactions if wallet connected
      if (user?.walletAddress) {
        const txRes = await blockchainAPI.getTransactions(user.id);
        setRecentTransactions(txRes.data || []);
      }

    } catch (error) {
      console.error('Error fetching blockchain data:', error);
      toast.error('Failed to load blockchain data');
    } finally {
      setLoading(false);
    }
  };

  const mintReputationBadge = async (badgeType) => {
    if (!walletAddress) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      setMintingBadge(true);
      
      const response = await blockchainAPI.mintBadge({
        userAddress: walletAddress,
        badgeType: badgeType,
        donationCount: user?.donationCount || 0,
        speciesCount: user?.speciesCount || 0,
        points: user?.points || 0
      });

      toast.success('Reputation badge minted successfully!');
      
      // Refresh data
      fetchBlockchainData();
      
    } catch (error) {
      console.error('Error minting badge:', error);
      toast.error('Failed to mint badge');
    } finally {
      setMintingBadge(false);
    }
  };

  const getBadgeIcon = (badgeType) => {
    const icons = {
      BRONZE: Trophy,
      SILVER: Star,
      GOLD: Award,
      PLATINUM: Zap,
      DIAMOND: Shield
    };
    return icons[badgeType] || Award;
  };

  const getBadgeColor = (badgeType) => {
    const colors = {
      BRONZE: 'from-orange-400 to-orange-600',
      SILVER: 'from-gray-300 to-gray-500',
      GOLD: 'from-yellow-400 to-yellow-600',
      PLATINUM: 'from-blue-400 to-blue-600',
      DIAMOND: 'from-purple-400 to-purple-600'
    };
    return colors[badgeType] || 'from-gray-400 to-gray-600';
  };

  const getTransactionStatusBadge = (status) => {
    const badges = {
      CONFIRMED: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      PENDING: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      FAILED: { color: 'bg-red-100 text-red-800', icon: ExternalLink }
    };
    
    const badge = badges[status] || badges.PENDING;
    const Icon = badge.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
        <Icon className="w-3 h-3" />
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Blocks className="w-12 h-12" />
            <h1 className="text-4xl font-bold">Blockchain Hub</h1>
          </div>
          <p className="text-xl text-purple-50">
            Transparent donations, reputation badges, and immutable impact tracking
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Wallet Connection */}
        {!walletConnected && (
          <div className="mb-8 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
                <p className="text-purple-100">
                  Connect your Web3 wallet to access blockchain features
                </p>
              </div>
              <button
                onClick={connectWallet}
                className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors flex items-center gap-2"
              >
                <Shield className="w-5 h-5" />
                Connect Wallet
              </button>
            </div>
          </div>
        )}

        {walletConnected && (
          <div className="mb-8 bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Connected Wallet</p>
                <p className="font-mono text-lg font-semibold text-gray-900">
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </p>
              </div>
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Connected</span>
              </div>
            </div>
          </div>
        )}

        {/* Blockchain Status */}
        {status && (
          <div className="mb-8 grid md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Blocks className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Network</p>
                  <p className="text-lg font-bold text-gray-900">{status.network || 'Polygon'}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="text-lg font-bold text-green-600">
                    {status.connected ? 'Connected' : 'Disconnected'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Block Height</p>
                  <p className="text-lg font-bold text-gray-900">
                    {status.blockHeight?.toLocaleString() || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Coins className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Gas Price</p>
                  <p className="text-lg font-bold text-gray-900">
                    {status.gasPrice || 'N/A'} Gwei
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Reputation Badges */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Award className="w-6 h-6 text-purple-600" />
              Reputation Badges
            </h2>

            <div className="space-y-4 mb-6">
              {['BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'DIAMOND'].map((badgeType) => {
                const Icon = getBadgeIcon(badgeType);
                const gradient = getBadgeColor(badgeType);
                
                return (
                  <div
                    key={badgeType}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-3 bg-gradient-to-br ${gradient} rounded-lg`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{badgeType} Badge</h3>
                        <p className="text-sm text-gray-600">
                          {badgeType === 'BRONZE' && 'Complete 5 donations'}
                          {badgeType === 'SILVER' && 'Complete 25 donations'}
                          {badgeType === 'GOLD' && 'Complete 100 donations'}
                          {badgeType === 'PLATINUM' && 'Complete 500 donations'}
                          {badgeType === 'DIAMOND' && 'Complete 1000 donations'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => mintReputationBadge(badgeType)}
                      disabled={mintingBadge || !walletConnected}
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-sm font-medium"
                    >
                      {mintingBadge ? 'Minting...' : 'Mint'}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-900">
                <strong>Note:</strong> Reputation badges are soulbound NFTs (ERC-721) that cannot be transferred. They represent your verified contributions to conservation.
              </p>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-blue-600" />
              Recent Transactions
            </h2>

            {recentTransactions.length > 0 ? (
              <div className="space-y-4">
                {recentTransactions.map((tx, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-sm text-gray-700">
                        {tx.txHash?.slice(0, 10)}...{tx.txHash?.slice(-8)}
                      </span>
                      {getTransactionStatusBadge(tx.status)}
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Amount</span>
                      <span className="font-semibold text-gray-900">
                        {tx.amount} {tx.currency || 'MATIC'}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm mt-1">
                      <span className="text-gray-600">Date</span>
                      <span className="text-gray-700">
                        {new Date(tx.timestamp).toLocaleDateString()}
                      </span>
                    </div>

                    {tx.txHash && (
                      <a
                        href={`https://polygonscan.com/tx/${tx.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm mt-2"
                      >
                        View on Explorer
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Blocks className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No transactions yet</p>
                <p className="text-sm text-gray-500 mt-2">
                  Make your first blockchain donation to see transactions here
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Smart Contract Info */}
        <div className="mt-8 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Shield className="w-6 h-6" />
            Smart Contract Information
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-indigo-100 text-sm mb-1">Donation Contract</p>
              <p className="font-mono text-sm bg-white/10 px-3 py-2 rounded">
                {status?.donationContract || '0x...'}
              </p>
            </div>
            <div>
              <p className="text-indigo-100 text-sm mb-1">Reputation Contract</p>
              <p className="font-mono text-sm bg-white/10 px-3 py-2 rounded">
                {status?.reputationContract || '0x...'}
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-white/10 rounded-lg">
            <p className="text-sm">
              All transactions are secured by Polygon's Proof-of-Stake consensus mechanism, ensuring transparency, immutability, and low gas fees for conservation funding.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockchainHub;
