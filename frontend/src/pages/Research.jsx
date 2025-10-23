import { useState } from 'react';
import ResearchDashboard from '../components/research/ResearchDashboard';
import LiveMetrics from '../components/dashboard/LiveMetrics';
import ExperimentVisualization from '../components/dashboard/ExperimentVisualization';
import BlockchainTracker from '../components/dashboard/BlockchainTracker';
import AIInsightPanel from '../components/dashboard/AIInsightPanel';
import InteractiveMap from '../components/dashboard/InteractiveMap';
import NudgePreview from '../components/dashboard/NudgePreview';
import ProtectedRoute from '../components/ProtectedRoute';

export default function Research() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <ProtectedRoute requiredRole="RESEARCHER">
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Research Dashboard</h1>
            <p className="mt-2 text-gray-600">
              Behavioral experiments, AI insights, and conservation analytics
            </p>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                <TabButton
                  active={activeTab === 'dashboard'}
                  onClick={() => setActiveTab('dashboard')}
                >
                  Dashboard
                </TabButton>
                <TabButton
                  active={activeTab === 'experiments'}
                  onClick={() => setActiveTab('experiments')}
                >
                  Experiments
                </TabButton>
                <TabButton
                  active={activeTab === 'analytics'}
                  onClick={() => setActiveTab('analytics')}
                >
                  AI Analytics
                </TabButton>
                <TabButton
                  active={activeTab === 'blockchain'}
                  onClick={() => setActiveTab('blockchain')}
                >
                  Blockchain
                </TabButton>
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  <LiveMetrics />
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ExperimentVisualization />
                    <AIInsightPanel />
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <InteractiveMap />
                    <NudgePreview />
                    <div className="lg:col-span-1">
                      <BlockchainTracker />
                    </div>
                  </div>
                </div>
              )}
              {activeTab === 'experiments' && <ExperimentPanel />}
              {activeTab === 'analytics' && <AnalyticsPanel />}
              {activeTab === 'blockchain' && <BlockchainPanel />}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`py-4 px-1 border-b-2 font-medium text-sm ${
        active
          ? 'border-green-500 text-green-600'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
      }`}
    >
      {children}
    </button>
  );
}

function ExperimentPanel() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Behavioral Experiments</h2>
        <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
          Create Experiment
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ExperimentCard
          title="Donation Amount Nudging"
          status="Active"
          participants={596}
          conversionRate={23.4}
        />
        <ExperimentCard
          title="Social Proof Messaging"
          status="Active"
          participants={423}
          conversionRate={28.1}
        />
        <ExperimentCard
          title="Progress Bar Visualization"
          status="Completed"
          participants={789}
          conversionRate={31.2}
        />
      </div>
    </div>
  );
}

function ExperimentCard({ title, status, participants, conversionRate }) {
  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-semibold">{title}</h3>
        <span className={`px-2 py-1 text-xs rounded-full ${
          status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {status}
        </span>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600">Participants</span>
          <span className="font-medium">{participants}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Conversion Rate</span>
          <span className="font-medium">{conversionRate}%</span>
        </div>
      </div>
    </div>
  );
}

function AnalyticsPanel() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">AI-Powered Analytics</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="font-semibold mb-4">Donor Prediction Model</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Model Accuracy</span>
              <span className="font-medium">87.3%</span>
            </div>
            <div className="flex justify-between">
              <span>Predictions Today</span>
              <span className="font-medium">1,247</span>
            </div>
            <div className="flex justify-between">
              <span>High-Value Prospects</span>
              <span className="font-medium text-green-600">156</span>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="font-semibold mb-4">Engagement Analysis</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Avg Engagement Score</span>
              <span className="font-medium">0.73</span>
            </div>
            <div className="flex justify-between">
              <span>Churn Risk Users</span>
              <span className="font-medium text-red-600">89</span>
            </div>
            <div className="flex justify-between">
              <span>Retention Rate</span>
              <span className="font-medium text-green-600">84.2%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BlockchainPanel() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Blockchain Analytics</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="font-semibold mb-4">Transaction Volume</h3>
          <div className="text-3xl font-bold text-green-600">125.7 ETH</div>
          <div className="text-sm text-gray-600">Total Value Locked</div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="font-semibold mb-4">Smart Contracts</h3>
          <div className="text-3xl font-bold text-blue-600">12</div>
          <div className="text-sm text-gray-600">Active Contracts</div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="font-semibold mb-4">Gas Efficiency</h3>
          <div className="text-3xl font-bold text-purple-600">45K</div>
          <div className="text-sm text-gray-600">Avg Gas Used</div>
        </div>
      </div>
    </div>
  );
}