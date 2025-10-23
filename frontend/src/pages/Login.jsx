import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import Web3Login from '../components/auth/Web3Login';

export default function Login() {
  const [activeTab, setActiveTab] = useState('login');
  const navigate = useNavigate();

  const handleAuthSuccess = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Welcome to ParkWise
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Conservation through technology
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-2 px-4 text-center text-sm font-medium ${
                activeTab === 'login'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-2 px-4 text-center text-sm font-medium ${
                activeTab === 'register'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Register
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'login' && (
            <LoginForm onSuccess={handleAuthSuccess} />
          )}
          
          {activeTab === 'register' && (
            <RegisterForm onSuccess={handleAuthSuccess} />
          )}

          {/* Web3 Login */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or</span>
              </div>
            </div>
            
            <div className="mt-6">
              <Web3Login onSuccess={handleAuthSuccess} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}