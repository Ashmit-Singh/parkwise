import React, { useState, useEffect } from 'react';
import { adminAPI, analyticsAPI, experimentAPI } from '../services/apiEnhanced';
import { 
  Users, 
  Activity, 
  TrendingUp, 
  Shield,
  Settings,
  BarChart3,
  AlertCircle,
  CheckCircle,
  XCircle,
  Eye,
  Ban,
  UserCheck,
  Database,
  Server,
  Zap
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [systemMetrics, setSystemMetrics] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [experiments, setExperiments] = useState([]);
  const [dashboardMetrics, setDashboardMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);

      // Fetch users
      const usersRes = await adminAPI.getUsers({ page: 0, size: 100 });
      setUsers(usersRes.data.content || usersRes.data);

      // Fetch system metrics
      const metricsRes = await adminAPI.getSystemMetrics();
      setSystemMetrics(metricsRes.data);

      // Fetch audit logs
      const logsRes = await adminAPI.getAuditLogs({ page: 0, size: 50 });
      setAuditLogs(logsRes.data.content || logsRes.data);

      // Fetch experiments
      const experimentsRes = await adminAPI.manageExperiments();
      setExperiments(experimentsRes.data);

      // Fetch dashboard metrics
      const dashboardRes = await analyticsAPI.getDashboardMetrics();
      setDashboardMetrics(dashboardRes.data);

    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      await adminAPI.updateUserRole(userId, newRole);
      toast.success('User role updated successfully');
      fetchAdminData();
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Failed to update user role');
    }
  };

  const handleBanUser = async (userId) => {
    const reason = prompt('Enter reason for ban:');
    if (!reason) return;

    try {
      await adminAPI.banUser(userId, reason);
      toast.success('User banned successfully');
      fetchAdminData();
    } catch (error) {
      console.error('Error banning user:', error);
      toast.error('Failed to ban user');
    }
  };

  const handleUnbanUser = async (userId) => {
    try {
      await adminAPI.unbanUser(userId);
      toast.success('User unbanned successfully');
      fetchAdminData();
    } catch (error) {
      console.error('Error unbanning user:', error);
      toast.error('Failed to unban user');
    }
  };

  const getRoleBadge = (role) => {
    const badges = {
      ADMIN: { color: 'bg-red-100 text-red-800', icon: Shield },
      RESEARCHER: { color: 'bg-purple-100 text-purple-800', icon: BarChart3 },
      USER: { color: 'bg-blue-100 text-blue-800', icon: Users },
      NGO: { color: 'bg-green-100 text-green-800', icon: UserCheck }
    };
    
    const badge = badges[role] || badges.USER;
    const Icon = badge.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
        <Icon className="w-3 h-3" />
        {role}
      </span>
    );
  };

  const getStatusBadge = (status) => {
    const badges = {
      ACTIVE: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      BANNED: { color: 'bg-red-100 text-red-800', icon: Ban },
      INACTIVE: { color: 'bg-gray-100 text-gray-800', icon: XCircle }
    };
    
    const badge = badges[status] || badges.INACTIVE;
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-12 h-12" />
            <h1 className="text-4xl font-bold">Admin Dashboard</h1>
          </div>
          <p className="text-xl text-red-50">
            System management, user administration, and platform monitoring
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* System Metrics Overview */}
        {systemMetrics && (
          <div className="mb-8 grid md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {systemMetrics.totalUsers?.toLocaleString() || users.length}
                  </p>
                </div>
              </div>
              <div className="text-xs text-gray-500">
                +{systemMetrics.newUsersToday || 0} today
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Activity className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Active Sessions</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {systemMetrics.activeSessions || 0}
                  </p>
                </div>
              </div>
              <div className="text-xs text-gray-500">
                {systemMetrics.activePercentage || 0}% of users
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Database className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Database Size</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {systemMetrics.databaseSize || '0 MB'}
                  </p>
                </div>
              </div>
              <div className="text-xs text-gray-500">
                {systemMetrics.storageUsage || 0}% used
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Server className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">System Health</p>
                  <p className="text-2xl font-bold text-green-600">
                    {systemMetrics.systemHealth || 'Good'}
                  </p>
                </div>
              </div>
              <div className="text-xs text-gray-500">
                Uptime: {systemMetrics.uptime || '99.9%'}
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6 bg-white rounded-xl shadow-md p-2 flex gap-2">
          {['overview', 'users', 'experiments', 'audit'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                activeTab === tab
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && dashboardMetrics && (
          <div className="space-y-6">
            {/* Platform Activity Chart */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-blue-600" />
                Platform Activity (Last 30 Days)
              </h3>
              
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dashboardMetrics.activityData || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="users" stroke="#3b82f6" name="Active Users" />
                  <Line type="monotone" dataKey="donations" stroke="#10b981" name="Donations" />
                  <Line type="monotone" dataKey="sightings" stroke="#f59e0b" name="Sightings" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Quick Stats */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6">
                <h4 className="text-lg font-semibold mb-2">Total Donations</h4>
                <p className="text-3xl font-bold">
                  ${dashboardMetrics.totalDonations?.toLocaleString() || 0}
                </p>
                <p className="text-sm text-blue-100 mt-2">
                  {dashboardMetrics.donationCount || 0} transactions
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6">
                <h4 className="text-lg font-semibold mb-2">Species Identified</h4>
                <p className="text-3xl font-bold">
                  {dashboardMetrics.speciesCount?.toLocaleString() || 0}
                </p>
                <p className="text-sm text-green-100 mt-2">
                  {dashboardMetrics.sightingsCount || 0} sightings
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6">
                <h4 className="text-lg font-semibold mb-2">Active Experiments</h4>
                <p className="text-3xl font-bold">
                  {experiments.filter(e => e.status === 'ACTIVE').length}
                </p>
                <p className="text-sm text-purple-100 mt-2">
                  {experiments.length} total
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Users className="w-6 h-6 text-blue-600" />
              User Management
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white font-semibold">
                            {user.name?.charAt(0) || 'U'}
                          </div>
                          <span className="font-medium text-gray-900">{user.name || 'Unknown'}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">{user.email}</td>
                      <td className="px-4 py-4">{getRoleBadge(user.role)}</td>
                      <td className="px-4 py-4">{getStatusBadge(user.status || 'ACTIVE')}</td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedUser(user)}
                            className="text-blue-600 hover:text-blue-700 p-1"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {user.status === 'BANNED' ? (
                            <button
                              onClick={() => handleUnbanUser(user.id)}
                              className="text-green-600 hover:text-green-700 p-1"
                              title="Unban User"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleBanUser(user.id)}
                              className="text-red-600 hover:text-red-700 p-1"
                              title="Ban User"
                            >
                              <Ban className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Experiments Tab */}
        {activeTab === 'experiments' && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Zap className="w-6 h-6 text-purple-600" />
              Experiment Management
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              {experiments.map((exp) => (
                <div key={exp.id} className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-900">{exp.name}</h4>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      exp.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                      exp.status === 'PAUSED' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {exp.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{exp.description}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Variants</p>
                      <p className="font-semibold text-gray-900">{exp.variantCount || 0}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Participants</p>
                      <p className="font-semibold text-gray-900">{exp.participantCount || 0}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Audit Logs Tab */}
        {activeTab === 'audit' && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <AlertCircle className="w-6 h-6 text-orange-600" />
              Audit Logs
            </h3>

            <div className="space-y-3">
              {auditLogs.map((log, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{log.action}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{log.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span>User: {log.userId}</span>
                    <span>IP: {log.ipAddress}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
