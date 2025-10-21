import React, { useState, useEffect } from 'react'
import { MapPin, Loader, AlertCircle } from 'lucide-react'
import axios from 'axios'

const API_BASE_URL = 'http://localhost:8081/api'

/**
 * Sightings Map Component - Display species sightings on interactive map
 */
export const SightingsMap = ({ speciesId = null, days = 30 }) => {
  const [sightings, setSightings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedSighting, setSelectedSighting] = useState(null)
  const [mapCenter, setMapCenter] = useState({ lat: 20, lng: 78 }) // India center

  useEffect(() => {
    fetchSightings()
  }, [speciesId, days])

  const fetchSightings = async () => {
    try {
      setLoading(true)
      setError(null)

      let url
      if (speciesId) {
        url = `${API_BASE_URL}/species/${speciesId}/sightings`
      } else {
        url = `${API_BASE_URL}/species/sightings/recent?days=${days}`
      }

      const response = await axios.get(url)
      setSightings(response.data)
    } catch (err) {
      setError('Failed to load sightings: ' + err.message)
    } finally {
      setLoading(false)
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
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
        <MapPin className="h-6 w-6 mr-2 text-green-600" />
        Species Sightings Map
      </h2>

      {sightings.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No sightings recorded yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Placeholder (would use Leaflet/Mapbox in production) */}
          <div className="lg:col-span-2 bg-gray-100 rounded-lg h-96 flex items-center justify-center border-2 border-dashed border-gray-300">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600 text-sm">
                Interactive map would display {sightings.length} sightings
              </p>
              <p className="text-gray-500 text-xs mt-1">
                (Integrate Leaflet.js or Mapbox for production)
              </p>
            </div>
          </div>

          {/* Sightings List */}
          <div className="space-y-3 overflow-y-auto max-h-96">
            <h3 className="font-semibold text-gray-800 mb-3">
              Recent Sightings ({sightings.length})
            </h3>
            {sightings.map((sighting) => (
              <div
                key={sighting.id}
                onClick={() => setSelectedSighting(sighting)}
                className={`p-3 rounded-lg cursor-pointer transition ${
                  selectedSighting?.id === sighting.id
                    ? 'bg-green-100 border-2 border-green-500'
                    : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                <p className="font-medium text-gray-800 text-sm">
                  {sighting.commonName || 'Unknown Species'}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  📍 {sighting.latitude.toFixed(4)}, {sighting.longitude.toFixed(4)}
                </p>
                <p className="text-xs text-gray-600">
                  📅 {new Date(sighting.sightingDate).toLocaleDateString()}
                </p>
                {sighting.sightingCount > 1 && (
                  <p className="text-xs text-green-600 font-medium mt-1">
                    {sighting.sightingCount} sightings at this location
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Selected Sighting Details */}
      {selectedSighting && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-2">Sighting Details</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Species</p>
              <p className="font-medium text-gray-800">{selectedSighting.commonName}</p>
              <p className="text-xs text-gray-600">{selectedSighting.scientificName}</p>
            </div>
            <div>
              <p className="text-gray-600">Conservation Status</p>
              <p className="font-medium text-gray-800">{selectedSighting.conservationStatus}</p>
            </div>
            <div>
              <p className="text-gray-600">Location</p>
              <p className="font-medium text-gray-800">
                {selectedSighting.latitude.toFixed(4)}, {selectedSighting.longitude.toFixed(4)}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Date</p>
              <p className="font-medium text-gray-800">
                {new Date(selectedSighting.sightingDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Confidence</p>
              <p className="font-medium text-gray-800">
                {(selectedSighting.confidenceScore * 100).toFixed(0)}%
              </p>
            </div>
            <div>
              <p className="text-gray-600">Sightings at Location</p>
              <p className="font-medium text-gray-800">{selectedSighting.sightingCount}</p>
            </div>
          </div>
        </div>
      )}

      {/* Statistics */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="bg-green-50 p-4 rounded-lg text-center">
          <p className="text-2xl font-bold text-green-600">{sightings.length}</p>
          <p className="text-sm text-gray-600">Total Sightings</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <p className="text-2xl font-bold text-blue-600">
            {new Set(sightings.map(s => s.speciesId)).size}
          </p>
          <p className="text-sm text-gray-600">Species Identified</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg text-center">
          <p className="text-2xl font-bold text-purple-600">
            {(sightings.reduce((sum, s) => sum + (s.confidenceScore || 0), 0) / sightings.length * 100).toFixed(0)}%
          </p>
          <p className="text-sm text-gray-600">Avg. Confidence</p>
        </div>
      </div>
    </div>
  )
}

export default SightingsMap
