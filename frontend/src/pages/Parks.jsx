import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { MapPin, Calendar, Users } from 'lucide-react'

const Parks = () => {
  const [parks, setParks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchParks = async () => {
      try {
        const response = await axios.get('/api/parks')
        setParks(response.data)
      } catch (error) {
        console.error('Error fetching parks:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchParks()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading parks...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 text-center">
          National Parks
        </h1>
        <p className="text-xl text-gray-600 text-center mb-12">
          Explore India's incredible network of protected areas
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {parks.map((park) => (
            <div key={park.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{park.name}</h3>
                <div className="flex items-center text-green-600 mb-2">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span className="font-semibold">{park.state}</span>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {park.description}
                </p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-500 text-sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Est. {park.establishedYear}</span>
                  </div>
                  {park.area && (
                    <div className="flex items-center text-gray-500 text-sm">
                      <Users className="h-4 w-4 mr-2" />
                      <span>{park.area} km²</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    park.conservationStatus === 'Protected' 
                      ? 'bg-green-100 text-green-800'
                      : park.conservationStatus === 'Critical'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {park.conservationStatus}
                  </span>
                  
                  {park.bestTimeToVisit && (
                    <span className="text-gray-500 text-sm text-right">
                      Best: {park.bestTimeToVisit}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {parks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No parks found</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Parks