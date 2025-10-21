import React, { useState } from 'react';
import { useWallet } from '../hooks/useWallet';

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: any | null;
}

export const useAuth = () => {
  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: !!localStorage.getItem('authToken'),
    token: localStorage.getItem('authToken'),
    user: JSON.parse(localStorage.getItem('user') || 'null'),
  });

  const { address, signMessage } = useWallet();

  // Traditional login
  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      setAuth({
        isAuthenticated: true,
        token: data.token,
        user: data.user,
      });

      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // Web3 wallet login
  const loginWithWeb3 = async () => {
    if (!address) {
      throw new Error('Wallet not connected');
    }

    try {
      const message = `Sign this message to authenticate with ParkWise: ${Date.now()}`;
      const signature = await signMessage(message);

      const response = await fetch('/api/auth/web3/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: address,
          message,
          signature,
        }),
      });

      if (!response.ok) {
        throw new Error('Web3 login failed');
      }

      const data = await response.json();
      
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      setAuth({
        isAuthenticated: true,
        token: data.token,
        user: data.user,
      });

      return data;
    } catch (error) {
      console.error('Web3 login error:', error);
      throw error;
    }
  };

  // Register
  const register = async (email: string, password: string, username: string) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, username }),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      const data = await response.json();
      
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      setAuth({
        isAuthenticated: true,
        token: data.token,
        user: data.user,
      });

      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    
    setAuth({
      isAuthenticated: false,
      token: null,
      user: null,
    });
  };

  return {
    ...auth,
    login,
    loginWithWeb3,
    register,
    logout,
  };
};
