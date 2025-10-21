import React from 'react'
import { Leaf, Heart, Shield } from 'lucide-react'

/**
 * Impact Feedback Component
 * Shows real-time impact of donations
 */
export const ImpactFeedback = ({ 
  donationAmount = 500,
  variant = 'control',
  campaignType = 'wildlife' 
}) => {
  if (variant === 'control') {
    return null
  }

  // Calculate impact based on donation amount
  const getImpactMessage = () => {
    const impactMap = {
      wildlife: {
        500: '2 nesting sites protected',
        1000: '5 nesting sites protected',
        2500: '15 acres of habitat restored',
        5000: '50 acres of habitat restored'
      },
      species: {
        500: '1 endangered species monitored for 1 month',
        1000: '3 endangered species monitored for 1 month',
        2500: '1 species conservation program funded',
        5000: '5 species conservation programs funded'
      },
      community: {
        500: '10 local families trained in conservation',
        1000: '25 local families trained in conservation',
        2500: '1 community conservation center established',
        5000: '5 community conservation centers established'
      }
    }

    const typeMap = impactMap[campaignType] || impactMap.wildlife
    
    // Find closest impact level
    const amounts = Object.keys(typeMap).map(Number).sort((a, b) => a - b)
    let closestAmount = amounts[0]
    
    for (const amt of amounts) {
      if (donationAmount >= amt) {
        closestAmount = amt
      }
    }

    return typeMap[closestAmount]
  }

  const getIcon = () => {
    switch (campaignType) {
      case 'wildlife':
        return <Leaf className="h-5 w-5 text-green-600" />
      case 'species':
        return <Heart className="h-5 w-5 text-red-600" />
      case 'community':
        return <Shield className="h-5 w-5 text-blue-600" />
      default:
        return <Leaf className="h-5 w-5 text-green-600" />
    }
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-4">
      <div className="flex items-start space-x-3">
        {getIcon()}
        <div>
          <h4 className="font-semibold text-gray-800 mb-1">Your Impact</h4>
          <p className="text-sm text-gray-700">
            Your donation of <span className="font-bold text-green-600">₹{donationAmount.toLocaleString()}</span> will:
          </p>
          <p className="text-sm font-medium text-blue-700 mt-2">
            ✓ {getImpactMessage()}
          </p>
        </div>
      </div>
    </div>
  )
}

export default ImpactFeedback
