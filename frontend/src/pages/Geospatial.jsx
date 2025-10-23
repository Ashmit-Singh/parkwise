import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import { geoAPI } from '../services/apiEnhanced';
import { 
  MapPin, 
  Navigation, 
  Layers, 
  Search,
  Filter,
  Target,
  CheckCircle,
  XCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const LocationMarker = ({ position, onLocationFound }) => {
  const map = useMap();

  useEffect(() => {
    map.locate().on('locationfound', (e) => {
      onLocationFound(e.latlng);
      map.flyTo(e.latlng, 13);
    });
  }, [map, onLocationFound]);

  return position ? (
    <Marker position={position}>
      <Popup>You are here</Popup>
    </Marker>
  ) : null;
};

const Geospatial = () => {
  const [projects, setProjects] = useState([]);
  const [nearbyProjects, setNearbyProjects] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [searchRadius, setSearchRadius] = useState(50); // km
  const [loading, setLoading] = useState(true);
  const [checkingLocation, setCheckingLocation] = useState(false);
  const [locationCheckResult, setLocationCheckResult] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    fetchAllProjects();
  }, []);

  const fetchAllProjects = async () => {
    try {
      setLoading(true);
      const response = await geoAPI.getAllProjects();
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleLocationFound = async (latlng) => {
    setUserLocation(latlng);
    await findNearbyProjects(latlng.lat, latlng.lng);
  };

  const findNearbyProjects = async (lat, lng) => {
    try {
      const response = await geoAPI.findNearbyProjects({
        latitude: lat,
        longitude: lng,
        radiusKm: searchRadius
      });
      setNearbyProjects(response.data);
      toast.success(`Found ${response.data.length} projects within ${searchRadius}km`);
    } catch (error) {
      console.error('Error finding nearby projects:', error);
      toast.error('Failed to find nearby projects');
    }
  };

  const checkLocationInGeofence = async (projectId, lat, lng) => {
    try {
      setCheckingLocation(true);
      const response = await geoAPI.checkLocation(projectId, lat, lng);
      setLocationCheckResult(response.data);
      
      if (response.data.inGeofence) {
        toast.success('Location is within project geofence!');
      } else {
        toast.error('Location is outside project geofence');
      }
    } catch (error) {
      console.error('Error checking location:', error);
      toast.error('Failed to verify location');
    } finally {
      setCheckingLocation(false);
    }
  };

  const handleUseMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latlng = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(latlng);
          findNearbyProjects(latlng.lat, latlng.lng);
        },
        (error) => {
          toast.error('Unable to get your location');
        }
      );
    } else {
      toast.error('Geolocation is not supported by your browser');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="w-10 h-10" />
            <h1 className="text-4xl font-bold">Geospatial Explorer</h1>
          </div>
          <p className="text-xl text-green-50">
            Discover conservation projects near you with geofencing technology
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Location Controls */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Navigation className="w-5 h-5 text-blue-600" />
                Your Location
              </h2>
              
              <button
                onClick={handleUseMyLocation}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <Target className="w-5 h-5" />
                Use My Location
              </button>

              {userLocation && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Lat:</span> {userLocation.lat.toFixed(6)}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Lng:</span> {userLocation.lng.toFixed(6)}
                  </p>
                </div>
              )}
            </div>

            {/* Search Radius */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Filter className="w-5 h-5 text-green-600" />
                Search Radius
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {searchRadius} km
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="200"
                    step="5"
                    value={searchRadius}
                    onChange={(e) => setSearchRadius(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>5 km</span>
                    <span>200 km</span>
                  </div>
                </div>

                {userLocation && (
                  <button
                    onClick={() => findNearbyProjects(userLocation.lat, userLocation.lng)}
                    className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Search className="w-4 h-4" />
                    Search Nearby
                  </button>
                )}
              </div>
            </div>

            {/* Nearby Projects List */}
            {nearbyProjects.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Nearby Projects ({nearbyProjects.length})
                </h2>
                
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {nearbyProjects.map((project) => (
                    <div
                      key={project.id}
                      onClick={() => setSelectedProject(project)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedProject?.id === project.id
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-green-300'
                      }`}
                    >
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {project.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {project.description}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{project.distance?.toFixed(1)} km away</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (userLocation) {
                              checkLocationInGeofence(
                                project.id,
                                userLocation.lat,
                                userLocation.lng
                              );
                            }
                          }}
                          className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Check Geofence
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Location Check Result */}
            {locationCheckResult && (
              <div className={`rounded-xl shadow-md p-6 ${
                locationCheckResult.inGeofence ? 'bg-green-50' : 'bg-red-50'
              }`}>
                <div className="flex items-center gap-3 mb-3">
                  {locationCheckResult.inGeofence ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-600" />
                  )}
                  <h3 className={`font-semibold ${
                    locationCheckResult.inGeofence ? 'text-green-900' : 'text-red-900'
                  }`}>
                    {locationCheckResult.inGeofence ? 'Inside Geofence' : 'Outside Geofence'}
                  </h3>
                </div>
                <p className={`text-sm ${
                  locationCheckResult.inGeofence ? 'text-green-700' : 'text-red-700'
                }`}>
                  {locationCheckResult.inGeofence
                    ? 'Your location is within the project boundary. You can contribute to this project!'
                    : 'Your location is outside the project boundary. This project may not be accessible from your location.'}
                </p>
              </div>
            )}
          </div>

          {/* Map */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md overflow-hidden" style={{ height: '800px' }}>
              <MapContainer
                center={[20.5937, 78.9629]} // Center of India
                zoom={5}
                style={{ height: '100%', width: '100%' }}
                ref={mapRef}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                {/* User Location */}
                {userLocation && (
                  <>
                    <Marker position={[userLocation.lat, userLocation.lng]}>
                      <Popup>
                        <div className="text-center">
                          <p className="font-semibold">Your Location</p>
                        </div>
                      </Popup>
                    </Marker>
                    <Circle
                      center={[userLocation.lat, userLocation.lng]}
                      radius={searchRadius * 1000}
                      pathOptions={{ color: 'blue', fillColor: 'blue', fillOpacity: 0.1 }}
                    />
                  </>
                )}

                {/* All Projects */}
                {projects.map((project) => (
                  <Marker
                    key={project.id}
                    position={[project.latitude, project.longitude]}
                  >
                    <Popup>
                      <div className="p-2">
                        <h3 className="font-semibold text-gray-900 mb-2">
                          {project.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {project.description}
                        </p>
                        {project.geofenceRadius && (
                          <p className="text-xs text-gray-500">
                            Geofence: {project.geofenceRadius}m radius
                          </p>
                        )}
                      </div>
                    </Popup>
                    {project.geofenceRadius && (
                      <Circle
                        center={[project.latitude, project.longitude]}
                        radius={project.geofenceRadius}
                        pathOptions={{ color: 'green', fillColor: 'green', fillOpacity: 0.2 }}
                      />
                    )}
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Geospatial;
