import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { BarChart3, Activity, Target } from 'lucide-react';

export default function ExperimentVisualization() {
  const [experiments, setExperiments] = useState([
    { id: 1, name: 'Social Proof Nudge', participants: 1247, conversionRate: 23.4, status: 'active' },
    { id: 2, name: 'Default Amount Test', participants: 856, conversionRate: 18.7, status: 'active' },
    { id: 3, name: 'Progress Bar UI', participants: 2103, conversionRate: 31.2, status: 'completed' },
    { id: 4, name: 'Urgency Messaging', participants: 634, conversionRate: 15.9, status: 'active' }
  ]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Behavioral Experiments
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {experiments.map(experiment => (
            <ExperimentCard key={experiment.id} experiment={experiment} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function ExperimentCard({ experiment }) {
  const statusColor = experiment.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  
  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-gray-900">{experiment.name}</h4>
        <span className={`px-2 py-1 text-xs rounded-full ${statusColor}`}>
          {experiment.status}
        </span>
      </div>
      
      <div className="grid grid-cols-3 gap-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-gray-600">Participants:</span>
          <span className="font-medium">{experiment.participants.toLocaleString()}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-gray-600">Conversion:</span>
          <span className="font-medium">{experiment.conversionRate}%</span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-gray-600">Confidence:</span>
          <span className="font-medium">95%</span>
        </div>
      </div>
      
      <div className="mt-3">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(experiment.conversionRate * 3, 100)}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}