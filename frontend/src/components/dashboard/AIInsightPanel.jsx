import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Brain, TrendingUp, Users, AlertTriangle } from 'lucide-react';

export default function AIInsightPanel() {
  const [insights, setInsights] = useState({
    donorPredictions: {
      highValueProspects: 156,
      churnRisk: 89,
      avgEngagementScore: 0.73,
      modelAccuracy: 87.3
    },
    recommendations: [
      { type: 'nudge', message: 'Show social proof to increase conversions by 15%', confidence: 0.85 },
      { type: 'timing', message: 'Send emails at 2 PM for 23% higher open rates', confidence: 0.78 },
      { type: 'amount', message: 'Suggest $25 default amount for optimal conversion', confidence: 0.92 }
    ],
    realTimeAnalysis: {
      currentVisitors: 47,
      predictedConversions: 12,
      optimalNudge: 'social_proof'
    }
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI-Powered Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Donor Intelligence</h4>
              <div className="grid grid-cols-2 gap-4">
                <InsightMetric
                  label="High-Value Prospects"
                  value={insights.donorPredictions.highValueProspects}
                  icon={<TrendingUp className="h-4 w-4 text-green-500" />}
                  color="text-green-600"
                />
                <InsightMetric
                  label="Churn Risk Users"
                  value={insights.donorPredictions.churnRisk}
                  icon={<AlertTriangle className="h-4 w-4 text-red-500" />}
                  color="text-red-600"
                />
                <InsightMetric
                  label="Avg Engagement"
                  value={insights.donorPredictions.avgEngagementScore.toFixed(2)}
                  icon={<Users className="h-4 w-4 text-blue-500" />}
                  color="text-blue-600"
                />
                <InsightMetric
                  label="Model Accuracy"
                  value={`${insights.donorPredictions.modelAccuracy}%`}
                  icon={<Brain className="h-4 w-4 text-purple-500" />}
                  color="text-purple-600"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">AI Recommendations</h4>
              <div className="space-y-3">
                {insights.recommendations.map((rec, index) => (
                  <RecommendationCard key={index} recommendation={rec} />
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">Real-Time Analysis</h4>
            <div className="flex items-center justify-between text-sm">
              <span>Current Visitors: <strong>{insights.realTimeAnalysis.currentVisitors}</strong></span>
              <span>Predicted Conversions: <strong>{insights.realTimeAnalysis.predictedConversions}</strong></span>
              <span>Optimal Nudge: <strong className="text-purple-600">{insights.realTimeAnalysis.optimalNudge}</strong></span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function InsightMetric({ label, value, icon, color }) {
  return (
    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
      {icon}
      <div>
        <div className={`text-lg font-bold ${color}`}>{value}</div>
        <div className="text-xs text-gray-600">{label}</div>
      </div>
    </div>
  );
}

function RecommendationCard({ recommendation }) {
  const getTypeColor = (type) => {
    switch (type) {
      case 'nudge': return 'bg-green-100 text-green-800';
      case 'timing': return 'bg-blue-100 text-blue-800';
      case 'amount': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-3 border rounded-lg">
      <div className="flex items-start justify-between mb-2">
        <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor(recommendation.type)}`}>
          {recommendation.type}
        </span>
        <span className="text-xs text-gray-500">
          {Math.round(recommendation.confidence * 100)}% confidence
        </span>
      </div>
      <p className="text-sm text-gray-700">{recommendation.message}</p>
    </div>
  );
}