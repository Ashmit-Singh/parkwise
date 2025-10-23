import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { TrendingUp, Users, Zap, Globe } from 'lucide-react';

export default function LiveMetrics() {
  const [metrics, setMetrics] = useState({
    totalDonations: 0,
    activeUsers: 0,
    experimentsRunning: 0,
    conservationImpact: 0
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        totalDonations: prev.totalDonations + Math.random() * 100,
        activeUsers: Math.floor(Math.random() * 50) + 1200,
        experimentsRunning: 5,
        conservationImpact: prev.conservationImpact + Math.random() * 10
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        title="Total Donations"
        value={`$${metrics.totalDonations.toFixed(0)}`}
        change="+12.5%"
        icon={<TrendingUp className="h-6 w-6" />}
        color="text-green-600"
        bgColor="bg-green-50"
      />
      <MetricCard
        title="Active Users"
        value={metrics.activeUsers.toLocaleString()}
        change="+8.2%"
        icon={<Users className="h-6 w-6" />}
        color="text-blue-600"
        bgColor="bg-blue-50"
      />
      <MetricCard
        title="Live Experiments"
        value={metrics.experimentsRunning}
        change="Running"
        icon={<Zap className="h-6 w-6" />}
        color="text-purple-600"
        bgColor="bg-purple-50"
      />
      <MetricCard
        title="Conservation Impact"
        value={`${metrics.conservationImpact.toFixed(1)} km²`}
        change="+5.7%"
        icon={<Globe className="h-6 w-6" />}
        color="text-emerald-600"
        bgColor="bg-emerald-50"
      />
    </div>
  );
}

function MetricCard({ title, value, change, icon, color, bgColor }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            <p className={`text-sm ${color}`}>{change}</p>
          </div>
          <div className={`${bgColor} ${color} p-3 rounded-full`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}