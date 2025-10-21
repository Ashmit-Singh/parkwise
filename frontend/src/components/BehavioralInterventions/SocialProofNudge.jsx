import React from 'react'
import { Users, TrendingUp } from 'lucide-react'

/**
 * Social Proof Nudge Component
 * Displays donor counts and peer activity to encourage donations
 */
export const SocialProofNudge = ({ 
  donorCount = 147, 
  todayCount = 23, 
  topDonor = 'Anonymous',
  variant = 'default' 
}) => {
  if (variant === 'control') {
    return null
  }

  return (
    <div className="bg-gradient-to-r from-green-50 to-blue-50 border-l-4 border-green-500 p-4 mb-4 rounded">
      <div className="flex items-start space-x-3">
        <Users className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800 mb-2">Join the Conservation Movement</h3>
          <div className="space-y-1 text-sm text-gray-700">
            <p>
              <span className="font-bold text-green-600">{donorCount.toLocaleString()}</span> people have donated to conservation this month
            </p>
            <p>
              <span className="font-bold text-blue-600">{todayCount}</span> donations today alone
            </p>
            <p className="text-xs text-gray-600 mt-2">
              <TrendingUp className="inline h-4 w-4 mr-1" />
              Top supporter: {topDonor}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SocialProofNudge
