import React, { useState } from 'react';
import { useWallet } from '../hooks/useWallet';
import { useAuth } from '../hooks/useAuth';

export default function DonateWithWeb3() {
  const { address, balance } = useWallet();
  const { token } = useAuth();
  const [amount, setAmount] = useState('');
  const [campaignId, setCampaignId] = useState('');
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [error, setError] = useState('');

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!address) {
      setError('Please connect your wallet first');
      return;
    }

    if (!token) {
      setError('Please login first');
      return;
    }

    setLoading(true);
    setError('');
    setTxHash('');

    try {
      const response = await fetch('/api/blockchain/donate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          campaignId: parseInt(campaignId),
          amount: parseFloat(amount),
          walletAddress: address,
          network: 'POLYGON',
        }),
      });

      if (!response.ok) {
        throw new Error('Donation failed');
      }

      const data = await response.json();
      setTxHash(data.transactionHash);
      
      // Reset form
      setAmount('');
      setCampaignId('');
    } catch (err: any) {
      setError(err.message || 'Failed to process donation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-green-800">Donate with Web3</h2>
      
      {/* Wallet Info */}
      <div className="mb-6 p-4 bg-green-50 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-700 font-medium">Wallet Address:</span>
          <span className="text-sm text-gray-600 font-mono">
            {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Not connected'}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-700 font-medium">Balance:</span>
          <span className="text-green-600 font-bold">
            {balance ? `${parseFloat(balance).toFixed(4)} MATIC` : '0 MATIC'}
          </span>
        </div>
      </div>

      {/* Donation Form */}
      <form onSubmit={handleDonate} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Campaign ID
          </label>
          <input
            type="number"
            value={campaignId}
            onChange={(e) => setCampaignId(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Enter campaign ID"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Amount (MATIC)
          </label>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="0.00"
            required
          />
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {txHash && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 font-medium mb-2">✅ Donation Successful!</p>
            <p className="text-sm text-gray-600">Transaction Hash:</p>
            <a
              href={`https://polygonscan.com/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline text-sm font-mono break-all"
            >
              {txHash}
            </a>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !address}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
        >
          {loading ? 'Processing...' : 'Donate Now'}
        </button>
      </form>
    </div>
  );
}
