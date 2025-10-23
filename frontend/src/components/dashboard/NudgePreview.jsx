import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Lightbulb, Users, Target, Clock } from 'lucide-react';

export default function NudgePreview() {
  const [activeNudge, setActiveNudge] = useState({
    type: 'social_proof',
    message: 'Join 1,247 others protecting wildlife today',
    suggestedAmount: 25,
    confidence: 0.87,
    expectedLift: 15.3
  });

  const nudgeTypes = [
    { id: 'social_proof', name: 'Social Proof', icon: <Users className="h-4 w-4" />, color: 'bg-blue-500' },
    { id: 'default_amount', name: 'Default Amount', icon: <Target className="h-4 w-4" />, color: 'bg-green-500' },
    { id: 'urgency', name: 'Urgency', icon: <Clock className="h-4 w-4" />, color: 'bg-red-500' },
    { id: 'progress', name: 'Progress Bar', icon: <Lightbulb className="h-4 w-4" />, color: 'bg-purple-500' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />
          Live Nudge Preview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            {nudgeTypes.map(nudge => (
              <button
                key={nudge.id}
                onClick={() => setActiveNudge(prev => ({ ...prev, type: nudge.id }))}
                className={`flex items-center gap-2 p-2 rounded-lg text-sm transition-all ${
                  activeNudge.type === nudge.id 
                    ? 'bg-gray-900 text-white' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {nudge.icon}
                {nudge.name}
              </button>
            ))}
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gradient-to-br from-white to-gray-50">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                <Lightbulb className="h-4 w-4" />
                AI-Optimized Nudge
              </div>
              
              <div className="text-lg font-semibold text-gray-900">
                {activeNudge.message}
              </div>
              
              <div className="flex justify-center gap-4">
                <button className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg">
                  $10
                </button>
                <button className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold">
                  ${activeNudge.suggestedAmount}
                </button>
                <button className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg">
                  $50
                </button>
              </div>
              
              <div className="text-sm text-gray-600">
                Or enter custom amount
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">AI Confidence:</span>
              <span className="font-semibold">{Math.round(activeNudge.confidence * 100)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Expected Lift:</span>
              <span className="font-semibold text-green-600">+{activeNudge.expectedLift}%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}