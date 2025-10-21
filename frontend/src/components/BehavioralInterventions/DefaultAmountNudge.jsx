import React, { useState } from 'react'
import { IndianRupee } from 'lucide-react'

/**
 * Default Amount Nudge Component
 * Pre-fills donation amount based on variant
 */
export const DefaultAmountNudge = ({ 
  variant = 'control',
  userAverage = 500,
  campaignTarget = 1000,
  onAmountChange
}) => {
  // Determine default amount based on variant
  const getDefaultAmount = () => {
    switch (variant) {
      case 'personalized':
        return Math.round(userAverage * 1.1) // 10% more than user average
      case 'high_default':
        return 1000
      case 'low_default':
        return 250
      case 'control':
      default:
        return 0
    }
  }

  const [amount, setAmount] = useState(getDefaultAmount())

  const handleAmountChange = (e) => {
    const value = e.target.value ? parseInt(e.target.value) : 0
    setAmount(value)
    if (onAmountChange) {
      onAmountChange(value)
    }
  }

  const quickAmounts = [250, 500, 1000, 2500]

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Donation Amount (₹)
        </label>
        <div className="relative">
          <IndianRupee className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="number"
            value={amount}
            onChange={handleAmountChange}
            placeholder="Enter amount"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            min="0"
            step="10"
          />
        </div>
        {variant === 'personalized' && (
          <p className="text-xs text-gray-500 mt-1">
            Suggested based on your giving history
          </p>
        )}
      </div>

      {/* Quick amount buttons */}
      <div>
        <p className="text-xs text-gray-600 mb-2">Quick amounts:</p>
        <div className="grid grid-cols-4 gap-2">
          {quickAmounts.map((quickAmount) => (
            <button
              key={quickAmount}
              onClick={() => handleAmountChange({ target: { value: quickAmount } })}
              className={`py-2 px-3 rounded text-sm font-medium transition ${
                amount === quickAmount
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              ₹{quickAmount}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DefaultAmountNudge
