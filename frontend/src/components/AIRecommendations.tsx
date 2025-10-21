import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

interface Recommendation {
  projectId: number;
  projectName: string;
  category: string;
  latitude: number;
  longitude: number;
  relevanceScore: number;
  reason: string;
}

export default function AIRecommendations() {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [trending, setTrending] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'personalized' | 'trending'>('personalized');

  useEffect(() => {
    if (user) {
      fetchRecommendations();
    }
    fetchTrending();
  }, [user]);

  const fetchRecommendations = async () => {
    if (!user) return;

    try {
      const response = await fetch(`/api/ai/recommendations/${user.id}?limit=5`);
      const data = await response.json();
      setRecommendations(data);
    } catch (error) {
      console.error('Failed to fetch recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrending = async () => {
    try {
      const response = await fetch('/api/ai/trending?limit=10');
      const data = await response.json();
      setTrending(data);
    } catch (error) {
      console.error('Failed to fetch trending projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderProjects = (projects: Recommendation[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects.map((project) => (
        <div key={project.projectId} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-lg font-bold text-green-800">{project.projectName}</h3>
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
              {project.category}
            </span>
          </div>
          
          <p className="text-sm text-gray-600 mb-4">{project.reason}</p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-full bg-gray-200 rounded-full h-2 mr-2" style={{ width: '100px' }}>
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: `${project.relevanceScore}%` }}
                ></div>
              </div>
              <span className="text-xs text-gray-500">{Math.round(project.relevanceScore)}% match</span>
            </div>
            
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition">
              Donate
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-green-800">🤖 AI-Powered Recommendations</h2>
      
      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b">
        <button
          onClick={() => setActiveTab('personalized')}
          className={`px-4 py-2 font-medium transition ${
            activeTab === 'personalized'
              ? 'border-b-2 border-green-600 text-green-600'
              : 'text-gray-600 hover:text-green-600'
          }`}
        >
          For You {user && `(${recommendations.length})`}
        </button>
        <button
          onClick={() => setActiveTab('trending')}
          className={`px-4 py-2 font-medium transition ${
            activeTab === 'trending'
              ? 'border-b-2 border-green-600 text-green-600'
              : 'text-gray-600 hover:text-green-600'
          }`}
        >
          🔥 Trending ({trending.length})
        </button>
      </div>

      {/* Content */}
      {activeTab === 'personalized' ? (
        user ? (
          recommendations.length > 0 ? (
            renderProjects(recommendations)
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No recommendations yet. Start donating to get personalized suggestions!</p>
            </div>
          )
        ) : (
          <div className="text-center py-12 bg-green-50 rounded-lg">
            <p className="text-gray-700 mb-4">Login to see personalized recommendations</p>
            <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition">
              Login
            </button>
          </div>
        )
      ) : (
        renderProjects(trending)
      )}
    </div>
  );
}
