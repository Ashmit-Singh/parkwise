import React, { useState, useEffect } from 'react';
import { behavioralAPI, experimentAPI } from '../services/apiEnhanced';
import { 
  FlaskConical, 
  TrendingUp, 
  Users, 
  Target,
  BarChart3,
  PieChart,
  Activity,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart as RechartsPie, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import toast from 'react-hot-toast';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

const ExperimentsDashboard = () => {
  const [experiments, setExperiments] = useState([]);
  const [selectedExperiment, setSelectedExperiment] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExperiments();
  }, []);

  useEffect(() => {
    if (selectedExperiment) {
      fetchExperimentDetails(selectedExperiment.id);
    }
  }, [selectedExperiment]);

  const fetchExperiments = async () => {
    try {
      setLoading(true);
      const response = await experimentAPI.getExperiments();
      setExperiments(response.data);
      
      if (response.data.length > 0) {
        setSelectedExperiment(response.data[0]);
      }
    } catch (error) {
      console.error('Error fetching experiments:', error);
      toast.error('Failed to load experiments');
    } finally {
      setLoading(false);
    }
  };

  const fetchExperimentDetails = async (experimentId) => {
    try {
      // Fetch analytics
      const analyticsRes = await behavioralAPI.getAnalytics(experimentId);
      setAnalytics(analyticsRes.data);

      // Fetch metrics
      const metricsRes = await behavioralAPI.getExperimentMetrics(experimentId);
      setMetrics(metricsRes.data);
    } catch (error) {
      console.error('Error fetching experiment details:', error);
      toast.error('Failed to load experiment details');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      ACTIVE: { color: 'bg-green-100 text-green-800', icon: Activity },
      PAUSED: { color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle },
      COMPLETED: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
      DRAFT: { color: 'bg-gray-100 text-gray-800', icon: XCircle }
    };
    
    const badge = badges[status] || badges.DRAFT;
    const Icon = badge.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${badge.color}`}>
        <Icon className="w-4 h-4" />
        {status}
      </span>
    );
  };

  const calculateWinningVariant = () => {
    if (!metrics || metrics.length === 0) return null;
    
    return metrics.reduce((max, variant) => 
      variant.conversionRate > (max?.conversionRate || 0) ? variant : max
    , null);
  };

  const prepareConversionData = () => {
    if (!metrics) return [];
    
    return metrics.map(variant => ({
      name: variant.variantName,
      conversions: variant.conversions,
      visitors: variant.visitors,
      rate: (variant.conversionRate * 100).toFixed(2)
    }));
  };

  const prepareDistributionData = () => {
    if (!metrics) return [];
    
    return metrics.map(variant => ({
      name: variant.variantName,
      value: variant.visitors
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  const winningVariant = calculateWinningVariant();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <FlaskConical className="w-12 h-12" />
            <h1 className="text-4xl font-bold">Behavioral Experiments</h1>
          </div>
          <p className="text-xl text-purple-50">
            A/B testing dashboard with Thompson Sampling and statistical analysis
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar - Experiment List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Active Experiments
              </h2>
              
              <div className="space-y-3">
                {experiments.map((exp) => (
                  <div
                    key={exp.id}
                    onClick={() => setSelectedExperiment(exp)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedExperiment?.id === exp.id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {exp.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      {getStatusBadge(exp.status)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {selectedExperiment && (
              <>
                {/* Experiment Overview */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {selectedExperiment.name}
                      </h2>
                      <p className="text-gray-600">
                        {selectedExperiment.description}
                      </p>
                    </div>
                    {getStatusBadge(selectedExperiment.status)}
                  </div>

                  {/* Key Metrics */}
                  <div className="grid md:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="w-5 h-5 text-blue-600" />
                        <span className="text-sm text-blue-900 font-medium">Total Visitors</span>
                      </div>
                      <div className="text-2xl font-bold text-blue-900">
                        {metrics.reduce((sum, m) => sum + m.visitors, 0).toLocaleString()}
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="w-5 h-5 text-green-600" />
                        <span className="text-sm text-green-900 font-medium">Conversions</span>
                      </div>
                      <div className="text-2xl font-bold text-green-900">
                        {metrics.reduce((sum, m) => sum + m.conversions, 0).toLocaleString()}
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-5 h-5 text-purple-600" />
                        <span className="text-sm text-purple-900 font-medium">Avg. Rate</span>
                      </div>
                      <div className="text-2xl font-bold text-purple-900">
                        {metrics.length > 0
                          ? ((metrics.reduce((sum, m) => sum + m.conversionRate, 0) / metrics.length) * 100).toFixed(2)
                          : 0}%
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <BarChart3 className="w-5 h-5 text-orange-600" />
                        <span className="text-sm text-orange-900 font-medium">Variants</span>
                      </div>
                      <div className="text-2xl font-bold text-orange-900">
                        {metrics.length}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Winning Variant */}
                {winningVariant && (
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl shadow-md p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <CheckCircle className="w-8 h-8" />
                      <h3 className="text-2xl font-bold">Leading Variant</h3>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div>
                        <p className="text-green-100 text-sm mb-1">Variant Name</p>
                        <p className="text-2xl font-bold">{winningVariant.variantName}</p>
                      </div>
                      <div>
                        <p className="text-green-100 text-sm mb-1">Conversion Rate</p>
                        <p className="text-2xl font-bold">
                          {(winningVariant.conversionRate * 100).toFixed(2)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-green-100 text-sm mb-1">Total Conversions</p>
                        <p className="text-2xl font-bold">
                          {winningVariant.conversions} / {winningVariant.visitors}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Conversion Rate Chart */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <BarChart3 className="w-6 h-6 text-blue-600" />
                    Conversion Rates by Variant
                  </h3>
                  
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={prepareConversionData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="conversions" fill="#10b981" name="Conversions" />
                      <Bar dataKey="visitors" fill="#3b82f6" name="Visitors" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Variant Distribution */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl shadow-md p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                      <PieChart className="w-6 h-6 text-purple-600" />
                      Traffic Distribution
                    </h3>
                    
                    <ResponsiveContainer width="100%" height={250}>
                      <RechartsPie>
                        <Pie
                          data={prepareDistributionData()}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={(entry) => `${entry.name}: ${entry.value}`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {prepareDistributionData().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RechartsPie>
                    </ResponsiveContainer>
                  </div>

                  {/* Variant Details Table */}
                  <div className="bg-white rounded-xl shadow-md p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">
                      Variant Performance
                    </h3>
                    
                    <div className="space-y-3">
                      {metrics.map((variant, index) => (
                        <div
                          key={variant.variantId}
                          className="p-4 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-gray-900">
                              {variant.variantName}
                            </span>
                            <span className="text-sm font-medium text-gray-600">
                              {(variant.conversionRate * 100).toFixed(2)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="h-2 rounded-full"
                              style={{
                                width: `${variant.conversionRate * 100}%`,
                                backgroundColor: COLORS[index % COLORS.length]
                              }}
                            />
                          </div>
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>{variant.conversions} conversions</span>
                            <span>{variant.visitors} visitors</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Statistical Analysis */}
                {analytics && (
                  <div className="bg-white rounded-xl shadow-md p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                      <Activity className="w-6 h-6 text-orange-600" />
                      Statistical Analysis
                    </h3>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      {analytics.variantAnalytics?.map((variant) => (
                        <div key={variant.variantId} className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg">
                          <h4 className="font-semibold text-gray-900 mb-3">
                            {variant.variantName}
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Confidence Interval:</span>
                              <span className="font-medium text-gray-900">
                                {(variant.confidenceInterval?.lower * 100).toFixed(2)}% - {(variant.confidenceInterval?.upper * 100).toFixed(2)}%
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Statistical Power:</span>
                              <span className="font-medium text-gray-900">
                                {(variant.statisticalPower * 100).toFixed(2)}%
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">P-Value:</span>
                              <span className="font-medium text-gray-900">
                                {variant.pValue?.toFixed(4)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperimentsDashboard;
