import React, { useState, useEffect } from 'react';
import { aiAPI } from '../services/apiEnhanced';
import { useAuthStore } from '../stores/authStore';
import { 
  TrendingUp, 
  Users, 
  Target, 
  Award, 
  Brain,
  Sparkles,
  ArrowUpRight,
  Heart
} from 'lucide-react';
import toast from 'react-hot-toast';

const AIInsights = () => {
  const { user } = useAuthStore();
  const [donorScore, setDonorScore] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [trendingProjects, setTrendingProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAIInsights();
  }, [user]);

  const fetchAIInsights = async () => {
    try {
      setLoading(true);
      
      // Fetch donor score
      if (user?.id) {
        const scoreRes = await aiAPI.getDonorScore(user.id);
        setDonorScore(scoreRes.data);
      }

      // Fetch recommendations
      if (user?.id) {
        const recsRes = await aiAPI.getRecommendations(user.id, 5);
        setRecommendations(recsRes.data);
      }

      // Fetch trending projects
      const trendingRes = await aiAPI.getTrendingProjects(10);
      setTrendingProjects(trendingRes.data);

    } catch (error) {
      console.error('Error fetching AI insights:', error);
      toast.error('Failed to load AI insights');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-blue-600 bg-blue-50';
    if (score >= 40) return 'text-yellow-600 bg-yellow-50';
    return 'text-gray-600 bg-gray-50';
  };

  const getClassificationBadge = (classification) => {
    const badges = {
      CHAMPION: { color: 'bg-purple-100 text-purple-800', icon: Award },
      LOYAL: { color: 'bg-blue-100 text-blue-800', icon: Heart },
      POTENTIAL: { color: 'bg-yellow-100 text-yellow-800', icon: Target },
      PROSPECT: { color: 'bg-gray-100 text-gray-800', icon: Users }
    };
    
    const badge = badges[classification] || badges.PROSPECT;
    const Icon = badge.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${badge.color}`}>
        <Icon className="w-4 h-4" />
        {classification}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="w-12 h-12 text-purple-600" />
            <h1 className="text-4xl font-bold text-gray-900">AI Insights</h1>
          </div>
          <p className="text-xl text-gray-600">
            Personalized recommendations powered by artificial intelligence
          </p>
        </div>

        {/* Donor Score Card */}
        {donorScore && (
          <div className="mb-8">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Your Donor Profile</h2>
                <Sparkles className="w-8 h-8 text-yellow-500" />
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                {/* Score */}
                <div className="text-center">
                  <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full ${getScoreColor(donorScore.score)} mb-4`}>
                    <span className="text-4xl font-bold">{Math.round(donorScore.score)}</span>
                  </div>
                  <p className="text-sm text-gray-600">Donor Score</p>
                </div>

                {/* Classification */}
                <div className="flex flex-col items-center justify-center">
                  <p className="text-sm text-gray-600 mb-3">Classification</p>
                  {getClassificationBadge(donorScore.classification)}
                  <p className="text-xs text-gray-500 mt-4 text-center max-w-xs">
                    {donorScore.recommendation}
                  </p>
                </div>

                {/* Stats */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Engagement Level</span>
                    <span className="font-semibold text-gray-900">
                      {donorScore.score >= 80 ? 'High' : donorScore.score >= 60 ? 'Medium' : 'Low'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Impact Potential</span>
                    <span className="font-semibold text-gray-900">
                      {donorScore.classification === 'CHAMPION' ? 'Maximum' : 'Growing'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Personalized Recommendations */}
        {recommendations.length > 0 && (
          <div className="mb-8">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <Target className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">Recommended For You</h2>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendations.map((project, index) => (
                  <div 
                    key={index}
                    className="group bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 border border-gray-200 hover:border-green-400 hover:shadow-lg transition-all duration-300 cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                        {project.projectName}
                      </h3>
                      <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors" />
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {project.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Match Score</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-green-400 to-blue-500"
                            style={{ width: `${project.matchScore}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-gray-900">
                          {project.matchScore}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Trending Projects */}
        {trendingProjects.length > 0 && (
          <div>
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="w-6 h-6 text-orange-600" />
                <h2 className="text-2xl font-bold text-gray-900">Trending Projects</h2>
              </div>
              
              <div className="space-y-4">
                {trendingProjects.map((project, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-4 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                      <span className="text-xl font-bold text-orange-600">#{index + 1}</span>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {project.projectName}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-1">
                        {project.description}
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">
                        {project.donationCount} donations
                      </p>
                      <p className="text-xs text-gray-500">
                        Last 30 days
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!donorScore && recommendations.length === 0 && trendingProjects.length === 0 && (
          <div className="text-center py-12">
            <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No AI insights available yet
            </h3>
            <p className="text-gray-600">
              Start donating to conservation projects to get personalized recommendations
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIInsights;
