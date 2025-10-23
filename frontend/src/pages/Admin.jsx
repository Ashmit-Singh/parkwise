import React, { useState } from 'react'
import axios from 'axios'

const Admin = () => {
  const [park, setPark] = useState({
    name: '',
    state: '',
    description: '',
    conservationStatus: 'Protected',
    establishedYear: '',
    area: '',
    bestTimeToVisit: '',
    keyAttractions: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('/parks', park)
      alert('Park added successfully!')
      setPark({
        name: '',
        state: '',
        description: '',
        conservationStatus: 'Protected',
        establishedYear: '',
        area: '',
        bestTimeToVisit: '',
        keyAttractions: ''
      })
    } catch (error) {
      alert('Error adding park: ' + error.response.data.error)
    }
  }

  const handleChange = (e) => {
    setPark({
      ...park,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Add New Park</h1>
        
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Park Name
              </label>
              <input
                type="text"
                name="name"
                value={park.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State
              </label>
              <input
                type="text"
                name="state"
                value={park.state}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={park.description}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Established Year
              </label>
              <input
                type="number"
                name="establishedYear"
                value={park.establishedYear}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Area (km²)
              </label>
              <input
                type="number"
                step="0.1"
                name="area"
                value={park.area}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Conservation Status
              </label>
              <select
                name="conservationStatus"
                value={park.conservationStatus}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="Protected">Protected</option>
                <option value="Critical">Critical</option>
                <option value="Endangered">Endangered</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Key Attractions
            </label>
            <input
              type="text"
              name="keyAttractions"
              value={park.keyAttractions}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Add Park
          </button>
        </form>
      </div>
    </div>
  )
}

export default Admin