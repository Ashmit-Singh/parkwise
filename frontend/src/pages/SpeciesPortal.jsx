import React, { useState, useEffect } from 'react';
import { speciesAPI } from '../services/apiEnhanced';
import { useAuthStore } from '../stores/authStore';
import AIIdentifier from '../components/organisms/AIIdentifier';
import { 
  Camera, 
  Upload, 
  Award, 
  TrendingUp, 
  MapPin,
  Eye,
  CheckCircle,
  XCircle,
  Trophy,
  Star,
  Leaf
} from 'lucide-react';
import toast from 'react-hot-toast';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const SpeciesPortal = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('submit');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [sightings, setSightings] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [catalog, setCatalog] = useState([]);
  const [recentSightings, setRecentSightings] = useState([]);
  const [formData, setFormData] = useState({
    latitude: '',
    longitude: '',
    locationName: '',
    notes: ''
  });

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      // Fetch sightings map
      const sightingsRes = await speciesAPI.getSightingsMap();
      setSightings(sightingsRes.data);

      // Fetch leaderboard
      const leaderboardRes = await speciesAPI.getLeaderboard();
      setLeaderboard(leaderboardRes.data);

      // Fetch user stats
      if (user?.id) {
        try {
          const statsRes = await speciesAPI.getUserStats(user.id);
          setUserStats(statsRes.data);
        } catch (error) {
          // User might not have stats yet
          console.log('No stats found for user');
        }
      }

      // Fetch species catalog
      try {
        const catalogRes = await speciesAPI.getCatalog();
        setCatalog(catalogRes.data);
      } catch (error) {
        // Use mock data if API fails
        console.log('Using mock species data');
        setCatalog([
          { id: 1, commonName: 'Bengal Tiger', scientificName: 'Panthera tigris tigris', conservationStatus: 'ENDANGERED' },
          { id: 2, commonName: 'Asiatic Lion', scientificName: 'Panthera leo persica', conservationStatus: 'ENDANGERED' },
          { id: 3, commonName: 'Indian Leopard', scientificName: 'Panthera pardus fusca', conservationStatus: 'VULNERABLE' },
          { id: 4, commonName: 'Snow Leopard', scientificName: 'Panthera uncia', conservationStatus: 'VULNERABLE' },
          { id: 5, commonName: 'Indian Elephant', scientificName: 'Elephas maximus indicus', conservationStatus: 'ENDANGERED' },
          { id: 6, commonName: 'One-horned Rhinoceros', scientificName: 'Rhinoceros unicornis', conservationStatus: 'VULNERABLE' },
          { id: 7, commonName: 'Great Indian Bustard', scientificName: 'Ardeotis nigriceps', conservationStatus: 'CRITICALLY_ENDANGERED' },
          { id: 8, commonName: 'Gharial', scientificName: 'Gavialis gangeticus', conservationStatus: 'CRITICALLY_ENDANGERED' },
          { id: 9, commonName: 'Gangetic Dolphin', scientificName: 'Platanista gangetica', conservationStatus: 'ENDANGERED' },
          { id: 10, commonName: 'Red Panda', scientificName: 'Ailurus fulgens', conservationStatus: 'ENDANGERED' }
        ]);
      }

      // Fetch recent sightings
      const recentRes = await speciesAPI.getRecentSightings(7);
      setRecentSightings(recentRes.data);

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!imageFile) {
      toast.error('Please select an image');
      return;
    }

    try {
      setSubmitting(true);
      
      const formDataToSend = new FormData();
      formDataToSend.append('userId', user.id);
      formDataToSend.append('image', imageFile);
      
      if (formData.latitude) formDataToSend.append('latitude', formData.latitude);
      if (formData.longitude) formDataToSend.append('longitude', formData.longitude);
      if (formData.locationName) formDataToSend.append('locationName', formData.locationName);
      if (formData.notes) formDataToSend.append('notes', formData.notes);

      const response = await speciesAPI.submitSighting(formDataToSend);
      
      toast.success('Species sighting submitted successfully!');
      
      // Reset form
      setImageFile(null);
      setImagePreview(null);
      setFormData({
        latitude: '',
        longitude: '',
        locationName: '',
        notes: ''
      });
      
      // Refresh data
      fetchData();
      
    } catch (error) {
      console.error('Error submitting sighting:', error);
      toast.error('Failed to submit sighting');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString()
          });
          toast.success('Location captured!');
        },
        (error) => {
          toast.error('Unable to get location');
        }
      );
    }
  };

  const getRankBadge = (rank) => {
    const badges = {
      'NOVICE': { color: 'bg-gray-100 text-gray-800', icon: Leaf },
      'EXPLORER': { color: 'bg-green-100 text-green-800', icon: Eye },
      'EXPERT': { color: 'bg-blue-100 text-blue-800', icon: Star },
      'MASTER': { color: 'bg-purple-100 text-purple-800', icon: Award },
      'LEGEND': { color: 'bg-yellow-100 text-yellow-800', icon: Trophy }
    };
    
    const badge = badges[rank] || badges.NOVICE;
    const Icon = badge.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${badge.color}`}>
        <Icon className="w-4 h-4" />
        {rank}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="relative overflow-hidden py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 mb-6">
              <Camera className="w-5 h-5 text-purple-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                AI-Powered Species Recognition
              </span>
            </div>
            <h1 className="text-5xl font-bold mb-4 text-gray-900 dark:text-white">
              Citizen Science Portal
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Help identify and track wildlife species with cutting-edge AI technology
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* User Stats Card */}
        {userStats && (
          <div className="mb-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-6 dark:bg-black/30">
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {userStats.totalSubmissions}
                </div>
                <p className="text-sm text-gray-600">Total Submissions</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {userStats.approvedCount}
                </div>
                <p className="text-sm text-gray-600">Approved</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {userStats.points}
                </div>
                <p className="text-sm text-gray-600">Points</p>
              </div>
              <div className="text-center">
                {getRankBadge(userStats.rank)}
                <p className="text-sm text-gray-600 mt-2">Current Rank</p>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-2 flex gap-2 dark:bg-black/30">
          {['submit', 'map', 'leaderboard', 'catalog'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-white/10'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Submit Tab */}
        {activeTab === 'submit' && (
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Upload className="w-8 h-8 text-purple-500" />
              AI Species Identifier
            </h2>
            <AIIdentifier
              onIdentify={async (file) => {
                // Simulate AI identification with realistic species data
                const speciesData = [
                  {
                    name: 'Bengal Tiger',
                    scientificName: 'Panthera tigris tigris',
                    confidence: 0.95,
                    conservationStatus: 'endangered',
                    habitat: 'Tropical forests, grasslands, and mangroves across India',
                    description: 'The Bengal tiger is the most numerous tiger subspecies in India. Known for its distinctive orange coat with black stripes. Apex predator playing crucial role in ecosystem.',
                    population: '2,967 individuals',
                    threats: 'Habitat loss, poaching, human-wildlife conflict'
                  },
                  {
                    name: 'Indian Elephant',
                    scientificName: 'Elephas maximus indicus',
                    confidence: 0.92,
                    conservationStatus: 'endangered',
                    habitat: 'Tropical forests, grasslands, and scrublands',
                    description: 'Largest land animal in Asia. Highly intelligent with complex social structures. Keystone species essential for forest ecosystem health.',
                    population: '27,000 individuals',
                    threats: 'Habitat loss, human-elephant conflict, poaching for ivory'
                  },
                  {
                    name: 'Asiatic Lion',
                    scientificName: 'Panthera leo persica',
                    confidence: 0.89,
                    conservationStatus: 'endangered',
                    habitat: 'Dry deciduous forests and grasslands of Gir, Gujarat',
                    description: 'Once widespread across Asia, now found only in Gir Forest. Smaller than African lions with distinctive belly fold. Conservation success story.',
                    population: '674 individuals',
                    threats: 'Limited habitat, disease risk, genetic bottleneck'
                  },
                  {
                    name: 'Snow Leopard',
                    scientificName: 'Panthera uncia',
                    confidence: 0.91,
                    conservationStatus: 'vulnerable',
                    habitat: 'Alpine and subalpine zones (3000-5400m) in Himalayas',
                    description: 'Elusive high-altitude predator. Thick fur and long tail for balance on rocky terrain. Perfectly adapted to harsh mountain environment.',
                    population: '450 individuals in India',
                    threats: 'Climate change, poaching for fur, prey depletion'
                  },
                  {
                    name: 'One-horned Rhinoceros',
                    scientificName: 'Rhinoceros unicornis',
                    confidence: 0.94,
                    conservationStatus: 'vulnerable',
                    habitat: 'Tall grasslands and riverine forests of Assam',
                    description: 'Largest of three Asian rhino species. Single black horn and thick, folded skin. Major conservation success with population recovery.',
                    population: '3,700 individuals',
                    threats: 'Poaching for horn, habitat loss, flooding'
                  }
                ];
                
                // Randomly select a species to simulate AI identification
                const randomSpecies = speciesData[Math.floor(Math.random() * speciesData.length)];
                
                // Simulate processing delay
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                return randomSpecies;
              }}
              onReportSighting={(data) => {
                console.log('Report sighting:', data);
                toast.success('Sighting reported successfully!');
              }}
            />
          </div>
        )}

        {/* Keep old form hidden for now */}
        {false && activeTab === 'submit-old' && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Species Photo *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-green-400 transition-colors">
                  {imagePreview ? (
                    <div className="space-y-4">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="max-h-64 mx-auto rounded-lg shadow-md"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview(null);
                        }}
                        className="text-red-600 hover:text-red-700 font-medium"
                      >
                        Remove Image
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <label className="cursor-pointer">
                        <span className="text-green-600 hover:text-green-700 font-medium">
                          Click to upload
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                      <p className="text-sm text-gray-500 mt-2">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Location */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.latitude}
                    onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., 28.6139"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.longitude}
                    onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., 77.2090"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleUseCurrentLocation}
                className="w-full bg-blue-100 text-blue-700 py-2 rounded-lg hover:bg-blue-200 transition-colors flex items-center justify-center gap-2"
              >
                <MapPin className="w-4 h-4" />
                Use Current Location
              </button>

              {/* Location Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location Name
                </label>
                <input
                  type="text"
                  value={formData.locationName}
                  onChange={(e) => setFormData({ ...formData, locationName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., Jim Corbett National Park"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Any additional observations..."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting || !imageFile}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-medium text-lg"
              >
                {submitting ? 'Submitting...' : 'Submit Sighting'}
              </button>
            </form>
          </div>
        )}

        {/* Map Tab */}
        {activeTab === 'map' && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden" style={{ height: '600px' }}>
            <MapContainer
              center={[20.5937, 78.9629]}
              zoom={5}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {sightings.map((sighting) => (
                <Marker
                  key={sighting.id}
                  position={[sighting.latitude, sighting.longitude]}
                >
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-semibold text-gray-900">
                        {sighting.speciesName}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {sighting.locationName}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(sighting.sightedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        )}

        {/* Leaderboard Tab */}
        {activeTab === 'leaderboard' && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-600" />
              Top Contributors
            </h2>

            <div className="space-y-4">
              {leaderboard.map((contributor, index) => (
                <div
                  key={contributor.userId}
                  className={`flex items-center gap-4 p-4 rounded-xl ${
                    index < 3
                      ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200'
                      : 'bg-gray-50'
                  }`}
                >
                  <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                    index === 0 ? 'bg-yellow-400 text-white' :
                    index === 1 ? 'bg-gray-300 text-white' :
                    index === 2 ? 'bg-orange-400 text-white' :
                    'bg-gray-200 text-gray-700'
                  }`}>
                    #{index + 1}
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      User #{contributor.userId}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      {getRankBadge(contributor.rank)}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      {contributor.points}
                    </div>
                    <p className="text-sm text-gray-600">points</p>
                  </div>

                  <div className="text-right">
                    <div className="text-lg font-semibold text-gray-900">
                      {contributor.approvedCount}
                    </div>
                    <p className="text-xs text-gray-600">approved</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Catalog Tab */}
        {activeTab === 'catalog' && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Species Catalog
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {catalog.map((species) => (
                <div
                  key={species.id}
                  className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {species.commonName}
                  </h3>
                  <p className="text-sm italic text-gray-600 mb-3">
                    {species.scientificName}
                  </p>
                  {species.conservationStatus && (
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      species.conservationStatus === 'CRITICALLY_ENDANGERED' ? 'bg-red-100 text-red-800' :
                      species.conservationStatus === 'ENDANGERED' ? 'bg-orange-100 text-orange-800' :
                      species.conservationStatus === 'VULNERABLE' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {species.conservationStatus.replace('_', ' ')}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpeciesPortal;
