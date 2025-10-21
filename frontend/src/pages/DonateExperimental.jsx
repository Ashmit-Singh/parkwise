import React, { useState, useEffect } from 'react'
import { Heart, AlertCircle } from 'lucide-react'
import useExperiment from '../hooks/useExperiment'
import SocialProofNudge from '../components/BehavioralInterventions/SocialProofNudge'
import DefaultAmountNudge from '../components/BehavioralInterventions/DefaultAmountNudge'
import ImpactFeedback from '../components/BehavioralInterventions/ImpactFeedback'
import ProgressBar from '../components/BehavioralInterventions/ProgressBar'

/**
 * Experimental Donation Page with Behavioral Interventions
 * This page integrates A/B testing and behavioral nudges
 */
const DonateExperimental = () => {
  // Mock user ID (in real app, get from auth context)
  const userId = 123
  const experimentId = 1 // Default experiment ID
  const campaignId = 1 // Default campaign ID

  // Use experiment hook
  const { variant, loading, logEvent, logDonationEvent, completeDonation } = 
    useExperiment(userId, experimentId)

  const [donationAmount, setDonationAmount] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  // Log page view
  useEffect(() => {
    if (variant && !loading) {
      logEvent('donation_page_viewed', null, {
        variantName: variant.variantName,
        timestamp: new Date().toISOString()
      })
    }
  }, [variant, loading])

  const handleDonationAmountChange = (amount) => {
    setDonationAmount(amount)
    logEvent('donation_amount_changed', amount.toString())
  }

  const handleDonate = async () => {
    if (donationAmount <= 0) {
      setError('Please enter a valid donation amount')
      return
    }

    try {
      setIsProcessing(true)
      setError(null)

      // Log donation event
      const donationEventId = await logDonationEvent(
        campaignId,
        donationAmount,
        'PENDING'
      )

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Mark as completed
      if (donationEventId) {
        await completeDonation(donationEventId)
      }

      // Log success
      logEvent('donation_completed', donationAmount.toString(), {
        variantName: variant.variantName,
        campaignId: campaignId
      })

      setSuccess(true)
      setDonationAmount(0)

      // Reset success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000)
    } catch (err) {
      console.error('Donation error:', err)
      setError('Failed to process donation. Please try again.')
      logEvent('donation_failed', donationAmount.toString(), {
        error: err.message
      })
    } finally {
      setIsProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading donation experience...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-cyan-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Heart className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Support Conservation</h1>
          <p className="text-gray-600">Your donation directly funds biodiversity protection in India</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Variant Info (for testing) */}
          <div className="mb-6 p-3 bg-gray-50 rounded border border-gray-200">
            <p className="text-xs text-gray-600">
              <strong>Experiment:</strong> {variant?.experimentName} | 
              <strong className="ml-2">Variant:</strong> {variant?.variantName}
            </p>
          </div>

          {/* Social Proof Nudge */}
          <SocialProofNudge 
            variant={variant?.variantName}
            donorCount={1247}
            todayCount={47}
          />

          {/* Progress Bar */}
          <ProgressBar 
            variant={variant?.variantName}
            currentAmount={87000}
            targetAmount={100000}
            donorCount={234}
          />

          {/* Donation Amount Input */}
          <div className="mb-6">
            <DefaultAmountNudge
              variant={variant?.variantName}
              userAverage={500}
              campaignTarget={1000}
              onAmountChange={handleDonationAmountChange}
            />
          </div>

          {/* Impact Feedback */}
          <ImpactFeedback
            variant={variant?.variantName}
            donationAmount={donationAmount}
            campaignType="wildlife"
          />

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 text-sm font-medium">
                ✓ Thank you! Your donation of ₹{donationAmount} has been received.
              </p>
            </div>
          )}

          {/* Donate Button */}
          <button
            onClick={handleDonate}
            disabled={isProcessing || donationAmount <= 0}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition ${
              isProcessing || donationAmount <= 0
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700'
            }`}
          >
            {isProcessing ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </span>
            ) : (
              `Donate ₹${donationAmount.toLocaleString()}`
            )}
          </button>

          {/* Footer */}
          <p className="text-center text-xs text-gray-500 mt-6">
            Your donation is secure and encrypted. We never share your information.
          </p>
        </div>
      </div>
    </div>
  )
}

export default DonateExperimental
