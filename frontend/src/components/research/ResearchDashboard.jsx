import { useState, useEffect } from 'react';
import { authService } from '../../services/auth';

export default function ResearchDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/research/dashboard', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      const data = await response.json();
      setDashboardData(data);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Active Experiments"
          value={dashboardData?.activeExperiments || 0}
          icon="🧪"
          color="bg-blue-500"
        />
        <MetricCard
          title="Total Participants"
          value={dashboardData?.totalParticipants || 0}
          icon="👥"
          color="bg-green-500"
        />
        <MetricCard
          title="Conversion Rate"
          value={`${((dashboardData?.conversionRate || 0) * 100).toFixed(1)}%`}
          icon="📈"
          color="bg-purple-500"
        />
        <MetricCard
          title="Avg Donation"
          value={`$${dashboardData?.avgDonationAmount || 0}`}
          icon="💰"
          color="bg-yellow-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Blockchain Activity</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Transactions</span>
              <span className="font-semibold">{dashboardData?.blockchainTransactions || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Success Rate</span>
              <span className="font-semibold text-green-600">98.7%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Value Locked</span>
              <span className="font-semibold">125.7 ETH</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Conservation Impact</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Active Projects</span>
              <span className="font-semibold">{dashboardData?.geoProjectsActive || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Area Protected</span>
              <span className="font-semibold text-green-600">2,847 km²</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Species Monitored</span>
              <span className="font-semibold">156</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon, color }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`${color} rounded-lg p-3 text-white text-2xl mr-4`}>
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}