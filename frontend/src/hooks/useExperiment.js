import { useState, useEffect } from 'react'
import axios from 'axios'

const API_BASE_URL = 'http://localhost:8081/api'

/**
 * Hook to manage experiment assignment and event logging
 * Usage: const { variant, loading, logEvent } = useExperiment(userId, experimentId)
 */
export const useExperiment = (userId, experimentId) => {
  const [variant, setVariant] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch experiment assignment on mount
  useEffect(() => {
    if (!userId || !experimentId) {
      setLoading(false)
      return
    }

    const fetchAssignment = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`${API_BASE_URL}/experiments/assign`, {
          params: { userId, experimentId }
        })
        setVariant(response.data)
        setError(null)
      } catch (err) {
        console.error('Error fetching experiment assignment:', err)
        setError(err.message)
        setVariant(null)
      } finally {
        setLoading(false)
      }
    }

    fetchAssignment()
  }, [userId, experimentId])

  /**
   * Log an event
   */
  const logEvent = async (eventType, eventValue = null, metadata = null) => {
    if (!variant) {
      console.warn('Variant not loaded, skipping event logging')
      return
    }

    try {
      await axios.post(`${API_BASE_URL}/analytics/events`, {
        userId,
        experimentId: variant.experimentId,
        variantId: variant.variantId,
        eventType,
        eventValue,
        metadata
      })
      console.log(`Event logged: ${eventType}`)
    } catch (err) {
      console.error('Error logging event:', err)
    }
  }

  /**
   * Log a donation event
   */
  const logDonationEvent = async (campaignId, donationAmount, donationStatus = 'PENDING') => {
    if (!variant) {
      console.warn('Variant not loaded, skipping donation logging')
      return null
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/analytics/donations`, {
        userId,
        campaignId,
        experimentId: variant.experimentId,
        variantId: variant.variantId,
        donationAmount,
        donationStatus
      })
      console.log('Donation event logged')
      return response.data
    } catch (err) {
      console.error('Error logging donation event:', err)
      return null
    }
  }

  /**
   * Mark donation as completed
   */
  const completeDonation = async (donationEventId) => {
    try {
      await axios.put(`${API_BASE_URL}/analytics/donations/${donationEventId}/complete`)
      console.log('Donation marked as completed')
    } catch (err) {
      console.error('Error completing donation:', err)
    }
  }

  /**
   * Mark donation as failed
   */
  const failDonation = async (donationEventId) => {
    try {
      await axios.put(`${API_BASE_URL}/analytics/donations/${donationEventId}/fail`)
      console.log('Donation marked as failed')
    } catch (err) {
      console.error('Error failing donation:', err)
    }
  }

  return {
    variant,
    loading,
    error,
    logEvent,
    logDonationEvent,
    completeDonation,
    failDonation
  }
}

export default useExperiment
