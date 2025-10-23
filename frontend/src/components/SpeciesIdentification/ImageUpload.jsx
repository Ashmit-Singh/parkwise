import React, { useState } from 'react'
import { Upload, AlertCircle, CheckCircle, Loader } from 'lucide-react'
import axios from 'axios'

const API_BASE_URL = 'http://localhost:8080/api'

/**
 * Image Upload Component for Species Identification
 */
export const ImageUpload = ({ userId, campaignId, onSubmissionSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  const [locationName, setLocationName] = useState('')
  const [notes, setNotes] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [submissionId, setSubmissionId] = useState(null)

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
      setError(null)

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude.toFixed(8))
          setLongitude(position.coords.longitude.toFixed(8))
        },
        (error) => {
          setError('Could not get location: ' + error.message)
        }
      )
    } else {
      setError('Geolocation not supported by your browser')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!selectedFile) {
      setError('Please select an image')
      return
    }

    if (!latitude || !longitude) {
      setError('Please provide location coordinates')
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const formData = new FormData()
      formData.append('userId', userId)
      formData.append('campaignId', campaignId)
      formData.append('image', selectedFile)
      formData.append('latitude', latitude)
      formData.append('longitude', longitude)
      formData.append('locationName', locationName)
      formData.append('notes', notes)

      const response = await axios.post(`${API_BASE_URL}/species/submit`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      setSuccess(true)
      setSubmissionId(response.data.submissionId)
      setSelectedFile(null)
      setPreview(null)
      setNotes('')

      if (onSubmissionSuccess) {
        onSubmissionSuccess(response.data)
      }

      setTimeout(() => setSuccess(false), 5000)
    } catch (err) {
      setError('Failed to submit: ' + (err.response?.data?.message || err.message))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <Upload className="h-6 w-6 mr-2 text-green-600" />
        Report a Species Sighting
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Photo *
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id="image-input"
            />
            <label htmlFor="image-input" className="cursor-pointer">
              {preview ? (
                <div>
                  <img src={preview} alt="Preview" className="h-48 w-full object-cover rounded mb-2" />
                  <p className="text-sm text-gray-600">{selectedFile?.name}</p>
                </div>
              ) : (
                <div>
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              )}
            </label>
          </div>
        </div>

        {/* Location */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Latitude *
            </label>
            <input
              type="number"
              step="0.00000001"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              placeholder="e.g., 26.8124"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Longitude *
            </label>
            <input
              type="number"
              step="0.00000001"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              placeholder="e.g., 91.7362"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {/* Get Current Location Button */}
        <button
          type="button"
          onClick={handleGetLocation}
          className="w-full px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition text-sm font-medium"
        >
          📍 Use Current Location
        </button>

        {/* Location Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location Name (e.g., Manas National Park)
          </label>
          <input
            type="text"
            value={locationName}
            onChange={(e) => setLocationName(e.target.value)}
            placeholder="Where did you see this species?"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Observation Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any additional details about the sighting? (behavior, group size, etc.)"
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start space-x-3">
            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-green-700 text-sm font-medium">Submission received!</p>
              <p className="text-green-600 text-xs">AI is analyzing your photo. Check back soon for results.</p>
              {submissionId && (
                <p className="text-green-600 text-xs mt-1">Submission ID: {submissionId}</p>
              )}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !selectedFile}
          className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition ${
            isLoading || !selectedFile
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700'
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <Loader className="animate-spin h-5 w-5 mr-2" />
              Processing...
            </span>
          ) : (
            'Submit Sighting'
          )}
        </button>
      </form>

      {/* Info Box */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-700">
          <strong>💡 Tip:</strong> Clear photos with good lighting help our AI identify species more accurately.
          Include the entire animal if possible, and avoid blurry images.
        </p>
      </div>
    </div>
  )
}

export default ImageUpload
