import { useState } from 'react';
import { ethers } from 'ethers';
import { authService } from '../../services/auth';

export default function Web3Login({ onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const connectWallet = async () => {
    if (!window.ethereum) {
      setError('MetaMask not found. Please install MetaMask.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = await provider.getSigner();
      const walletAddress = await signer.getAddress();

      const nonce = Math.floor(Math.random() * 1000000);
      const message = `Sign in to ParkWise: ${nonce}`;
      const signature = await signer.signMessage(message);

      await authService.web3Login({
        walletAddress,
        message,
        signature
      });

      onSuccess?.();
    } catch (err) {
      if (err.code === 4001) {
        setError('Connection rejected by user');
      } else {
        setError(err.response?.data?.message || 'Wallet connection failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <button
        onClick={connectWallet}
        disabled={loading}
        className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
      >
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" 
          alt="MetaMask" 
          className="w-5 h-5 mr-2"
        />
        {loading ? 'Connecting...' : 'Connect with MetaMask'}
      </button>

      {error && (
        <div className="text-red-600 text-sm text-center">{error}</div>
      )}
    </div>
  );
}