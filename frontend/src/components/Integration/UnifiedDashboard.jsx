import React, { useState, useEffect } from 'react'
import { BarChart3, Award, TrendingUp, Zap } from 'lucide-react'
import axios from 'axios'

const API_BASE_URL = 'http://localhost:8080/api'

/**
 * Unified Dashboard Component
 * Displays combined stats from both behavioral interventions and species identification
 */
export const UnifiedDashboard = ({ userId }) => {
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchDashboard()
  }, [userId])

  const fetchDashboard = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_BASE_URL}/integration/dashboard/${userId}`)
      setDashboard(response.data)
      setError(null)
    } catch (err) {
      console.error('Error fetching dashboard:', err)
      setError('Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-700">{error}</p>
      </div>
    )
  }

  if (!dashboard) {
    return <div className="text-center py-12">No data available</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome, {dashboard.name}!</h1>
        <p className="text-green-100">Your conservation journey at a glance</p>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Points */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Points</p>
              <p className="text-3xl font-bold text-green-600">{dashboard.totalPoints}</p>
            </div>
            <Zap className="h-8 w-8 text-green-500 opacity-50" />
          </div>
        </div>

        {/* Overall Rank */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Your Rank</p>
              <p className="text-3xl font-bold text-blue-600">{dashboard.overallRank}</p>
            </div>
            <Award className="h-8 w-8 text-blue-500 opacity-50" />
          </div>
        </div>

        {/* Species Submitted */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Species Submitted</p>
              <p className="text-3xl font-bold text-purple-600">{dashboard.speciesSubmissions}</p>
            </div>
            <BarChart3 className="h-8 w-8 text-purple-500 opacity-50" />
          </div>
        </div>

        {/* Donations Made */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Donations</p>
              <p className="text-3xl font-bold text-orange-600">{dashboard.totalDonations}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-orange-500 opacity-50" />
          </div>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Species Identification Stats */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">🦁 Species Identification</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-gray-600">Submissions</span>
              <span className="font-bold text-gray-800">{dashboard.speciesSubmissions}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-gray-600">Approved</span>
              <span className="font-bold text-green-600">{dashboard.approvedSubmissions}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Species Identified</span>
              <span className="font-bold text-blue-600">{dashboard.speciesIdentified}</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{
                  width: `${dashboard.speciesSubmissions > 0 ? (dashboard.approvedSubmissions / dashboard.speciesSubmissions) * 100 : 0}%`
                }}
              ></div>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              Approval Rate: {dashboard.speciesSubmissions > 0 ? ((dashboard.approvedSubmissions / dashboard.speciesSubmissions) * 100).toFixed(0) : 0}%
            </p>
          </div>
        </div>

        {/* Donation Stats */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">💰 Donation Activity</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-gray-600">Total Donations</span>
              <span className="font-bold text-gray-800">{dashboard.totalDonations}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-gray-600">Total Amount</span>
              <span className="font-bold text-green-600">₹{dashboard.totalDonationAmount?.toLocaleString() || '0'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Average Donation</span>
              <span className="font-bold text-blue-600">
                ₹{dashboard.totalDonations > 0 ? (dashboard.totalDonationAmount / dashboard.totalDonations).toFixed(0) : '0'}
              </span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-gray-600">
              🎯 Keep contributing to unlock higher ranks and exclusive badges!
            </p>
          </div>
        </div>
      </div>

      {/* Rank Progression */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">📈 Rank Progression</h2>
        <div className="flex justify-between items-center">
          <div className="text-center">
            <p className="text-2xl">🌱</p>
            <p className="text-xs text-gray-600 mt-1">NOVICE</p>
            <p className="text-xs font-bold">0 pts</p>
          </div>
          <div className="flex-1 h-1 bg-gray-200 mx-2"></div>
          <div className="text-center">
            <p className="text-2xl">🔍</p>
            <p className="text-xs text-gray-600 mt-1">EXPLORER</p>
            <p className="text-xs font-bold">100 pts</p>
          </div>
          <div className="flex-1 h-1 bg-gray-200 mx-2"></div>
          <div className="text-center">
            <p className="text-2xl">🦅</p>
            <p className="text-xs text-gray-600 mt-1">NATURALIST</p>
            <p className="text-xs font-bold">500 pts</p>
          </div>
          <div className="flex-1 h-1 bg-gray-200 mx-2"></div>
          <div className="text-center">
            <p className="text-2xl">🏆</p>
            <p className="text-xs text-gray-600 mt-1">EXPERT</p>
            <p className="text-xs font-bold">1000 pts</p>
          </div>
        </div>
        <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
          <p className="text-sm text-blue-800">
            ✨ You are currently a <strong>{dashboard.overallRank}</strong> with <strong>{dashboard.totalPoints}</strong> points.
            {dashboard.totalPoints < 100 && ` Keep going! ${100 - dashboard.totalPoints} more points to reach EXPLORER.`}
            {dashboard.totalPoints >= 100 && dashboard.totalPoints < 500 && ` Great work! ${500 - dashboard.totalPoints} more points to reach NATURALIST.`}
            {dashboard.totalPoints >= 500 && dashboard.totalPoints < 1000 && ` Excellent! ${1000 - dashboard.totalPoints} more points to reach EXPERT.`}
            {dashboard.totalPoints >= 1000 && ` 🎉 You are an EXPERT! Keep inspiring others!`}
          </p>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border-2 border-green-200 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-2">Ready to make more impact?</h3>
        <p className="text-gray-600 mb-4">Continue your conservation journey by:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded transition">
            🦁 Submit Species Sighting
          </button>
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition">
            💰 Make a Donation
          </button>
        </div>
      </div>
    </div>
  )
}

export default UnifiedDashboard
