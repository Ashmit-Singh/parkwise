import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { researchAPI, analyticsAPI } from '../services/apiEnhanced';

const ResearcherDashboard = () => {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await researchAPI.getDashboard();
        setMetrics(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching research metrics:', error);
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) {
    return <div>Loading research dashboard...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Research Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Conservation Impact Metrics</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={metrics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="metricName" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Key Metrics</h2>
          <div className="space-y-4">
            {metrics.map(metric => (
              <div key={metric.metricName} className="flex justify-between items-center">
                <span>{metric.metricName}</span>
                <span className="font-bold">{metric.value} {metric.unit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResearcherDashboard;
