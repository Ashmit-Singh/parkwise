import React, { useState } from 'react';
import { useWallet } from '../hooks/useWallet';
import { useAuth } from '../hooks/useAuth';

export default function WalletConnect() {
  const { address, balance, isConnecting, error, connectWallet, disconnectWallet } = useWallet();
  const { isAuthenticated, loginWithWeb3 } = useAuth();
  const [authLoading, setAuthLoading] = useState(false);

  const handleConnectAndAuth = async () => {
    try {
      if (!address) {
        await connectWallet();
      }
      
      if (address && !isAuthenticated) {
        setAuthLoading(true);
        await loginWithWeb3();
        setAuthLoading(false);
      }
    } catch (err) {
      console.error('Failed to connect and authenticate:', err);
      setAuthLoading(false);
    }
  };

  if (address && isAuthenticated) {
    return (
      <div className="flex items-center gap-3">
        <div className="bg-green-50 px-4 py-2 rounded-lg">
          <div className="text-xs text-gray-600">Balance</div>
          <div className="font-bold text-green-600">
            {parseFloat(balance || '0').toFixed(4)} MATIC
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 px-4 py-2 rounded-lg">
          <div className="text-xs text-gray-600">Connected</div>
          <div className="font-mono text-sm">
            {address.slice(0, 6)}...{address.slice(-4)}
          </div>
        </div>

        <button
          onClick={disconnectWallet}
          className="bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 transition text-sm font-medium"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={handleConnectAndAuth}
        disabled={isConnecting || authLoading}
        className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition flex items-center gap-2"
      >
        {isConnecting || authLoading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            Connecting...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
            </svg>
            Connect Wallet
          </>
        )}
      </button>
      
      {error && (
        <p className="text-red-600 text-sm mt-2">{error}</p>
      )}
    </div>
  );
}
