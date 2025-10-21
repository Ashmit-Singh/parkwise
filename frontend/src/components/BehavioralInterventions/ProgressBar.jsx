import React from 'react'
import { TrendingUp } from 'lucide-react'

/**
 * Campaign Progress Bar Component
 * Shows progress towards campaign goal
 */
export const ProgressBar = ({ 
  currentAmount = 87000,
  targetAmount = 100000,
  variant = 'default',
  donorCount = 234
}) => {
  if (variant === 'control') {
    return null
  }

  const progressPercentage = Math.min((currentAmount / targetAmount) * 100, 100)
  const remainingAmount = Math.max(targetAmount - currentAmount, 0)

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold text-gray-800">Campaign Progress</h4>
        <span className="text-sm font-bold text-green-600">{progressPercentage.toFixed(0)}%</span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden mb-3">
        <div
          className="bg-gradient-to-r from-green-400 to-green-600 h-full rounded-full transition-all duration-500"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 text-sm">
        <div>
          <p className="text-gray-600">Raised</p>
          <p className="font-bold text-gray-800">₹{(currentAmount / 1000).toFixed(0)}K</p>
        </div>
        <div>
          <p className="text-gray-600">Goal</p>
          <p className="font-bold text-gray-800">₹{(targetAmount / 1000).toFixed(0)}K</p>
        </div>
        <div>
          <p className="text-gray-600">Donors</p>
          <p className="font-bold text-gray-800">{donorCount}</p>
        </div>
      </div>

      {remainingAmount > 0 && (
        <p className="text-xs text-gray-600 mt-3 flex items-center">
          <TrendingUp className="h-3 w-3 mr-1" />
          ₹{remainingAmount.toLocaleString()} more to reach goal
        </p>
      )}
    </div>
  )
}

export default ProgressBar
