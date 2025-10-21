import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Project {
  id: number;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  radiusMeters?: number;
  category: string;
}

export default function InteractiveMap() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error('Geolocation error:', error);
          // Default to world view
          setUserLocation([0, 0]);
        }
      );
    }

    // Fetch projects
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/geo/projects');
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const findNearbyProjects = async () => {
    if (!userLocation) return;

    try {
      const response = await fetch('/api/geo/projects/nearby', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          latitude: userLocation[0],
          longitude: userLocation[1],
          radiusKm: 50,
        }),
      });
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Failed to find nearby projects:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen">
      <div className="absolute top-4 right-4 z-[1000] bg-white p-4 rounded-lg shadow-lg">
        <button
          onClick={findNearbyProjects}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          🎯 Find Nearby Projects
        </button>
        <div className="mt-2 text-sm text-gray-600">
          {projects.length} project{projects.length !== 1 ? 's' : ''} found
        </div>
      </div>

      <MapContainer
        center={userLocation || [0, 0]}
        zoom={userLocation ? 10 : 2}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User location marker */}
        {userLocation && (
          <Marker position={userLocation}>
            <Popup>
              <strong>Your Location</strong>
            </Popup>
          </Marker>
        )}

        {/* Project markers */}
        {projects.map((project) => (
          <React.Fragment key={project.id}>
            <Marker position={[project.latitude, project.longitude]}>
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold text-green-800">{project.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                  <div className="mt-2">
                    <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                      {project.category}
                    </span>
                  </div>
                </div>
              </Popup>
            </Marker>

            {/* Geofence circle */}
            {project.radiusMeters && (
              <Circle
                center={[project.latitude, project.longitude]}
                radius={project.radiusMeters}
                pathOptions={{ color: 'green', fillColor: 'green', fillOpacity: 0.1 }}
              />
            )}
          </React.Fragment>
        ))}
      </MapContainer>
    </div>
  );
}
