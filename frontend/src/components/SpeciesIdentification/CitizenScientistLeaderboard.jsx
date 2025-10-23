import React, { useState, useEffect } from 'react'
import { Trophy, Loader, AlertCircle, Award, Target } from 'lucide-react'
import axios from 'axios'

const API_BASE_URL = 'http://localhost:8080/api'

/**
 * Citizen Scientist Leaderboard Component
 */
export const CitizenScientistLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchLeaderboard()
  }, [])

  const fetchLeaderboard = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await axios.get(`${API_BASE_URL}/species/leaderboard`)
      setLeaderboard(response.data)
    } catch (err) {
      setError('Failed to load leaderboard: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const getRankBadge = (rank) => {
    const badges = {
      NOVICE: { icon: '🌱', color: 'bg-gray-100', text: 'Novice' },
      EXPLORER: { icon: '🔍', color: 'bg-blue-100', text: 'Explorer' },
      NATURALIST: { icon: '🦅', color: 'bg-green-100', text: 'Naturalist' },
      EXPERT: { icon: '🏆', color: 'bg-yellow-100', text: 'Expert' }
    }
    return badges[rank] || badges.NOVICE
  }

  const getMedalColor = (position) => {
    switch (position) {
      case 0:
        return 'text-yellow-500' // Gold
      case 1:
        return 'text-gray-400' // Silver
      case 2:
        return 'text-orange-600' // Bronze
      default:
        return 'text-gray-300'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
        <Loader className="animate-spin h-8 w-8 text-green-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
        <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
        <p className="text-red-700">{error}</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <Trophy className="h-6 w-6 mr-2 text-yellow-500" />
        Citizen Scientist Leaderboard
      </h2>

      {leaderboard.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No contributors yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {leaderboard.map((contributor, index) => {
            const badge = getRankBadge(contributor.rank)
            const medalColor = getMedalColor(index)

            return (
              <div
                key={contributor.id}
                className="flex items-center p-4 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-lg hover:shadow-md transition"
              >
                {/* Rank */}
                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                  {index < 3 ? (
                    <Trophy className={`h-8 w-8 ${medalColor}`} />
                  ) : (
                    <span className="text-lg font-bold text-gray-600">#{index + 1}</span>
                  )}
                </div>

                {/* User Info */}
                <div className="flex-1 ml-4">
                  <div className="flex items-center space-x-2 mb-1">
                    <p className="font-semibold text-gray-800">User #{contributor.userId}</p>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${badge.color}`}>
                      {badge.icon} {badge.text}
                    </span>
                  </div>
                  <div className="flex space-x-6 text-sm text-gray-600">
                    <span>📸 {contributor.approvedSubmissions} approved</span>
                    <span>🦁 {contributor.speciesIdentified} species</span>
                    <span>⭐ {contributor.points} points</span>
                  </div>
                </div>

                {/* Points Display */}
                <div className="flex-shrink-0 text-right">
                  <p className="text-2xl font-bold text-green-600">{contributor.points}</p>
                  <p className="text-xs text-gray-600">points</p>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Rank Explanation */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { rank: 'NOVICE', icon: '🌱', desc: '0-9 approved' },
          { rank: 'EXPLORER', icon: '🔍', desc: '10-49 approved' },
          { rank: 'NATURALIST', icon: '🦅', desc: '50-99 approved' },
          { rank: 'EXPERT', icon: '🏆', desc: '100+ approved' }
        ].map((item) => (
          <div key={item.rank} className="p-3 bg-gray-50 rounded-lg text-center">
            <p className="text-2xl mb-1">{item.icon}</p>
            <p className="text-xs font-medium text-gray-800">{item.rank}</p>
            <p className="text-xs text-gray-600 mt-1">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* How to Contribute */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
          <Target className="h-5 w-5 mr-2" />
          How to Climb the Ranks
        </h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>✓ Submit high-quality species photos</li>
          <li>✓ Include accurate location and date information</li>
          <li>✓ Get your submissions approved by expert reviewers</li>
          <li>✓ Earn 10 points per approved submission</li>
          <li>✓ Unlock badges and climb the leaderboard!</li>
        </ul>
      </div>
    </div>
  )
}

export default CitizenScientistLeaderboard
