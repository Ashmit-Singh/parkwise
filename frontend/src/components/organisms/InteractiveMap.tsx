import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';
import MapMarker from '../molecules/MapMarker';
import Button from '../atoms/Button';
import Badge from '../atoms/Badge';
import { Layers, Maximize2, Minimize2, Navigation, Filter } from 'lucide-react';

interface Park {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  area: number;
}

interface SpeciesSighting {
  id: string;
  species: string;
  latitude: number;
  longitude: number;
  count: number;
  conservationStatus: 'endangered' | 'vulnerable' | 'near-threatened' | 'least-concern' | 'data-deficient';
  timestamp: Date;
}

interface InteractiveMapProps {
  parks?: Park[];
  sightings?: SpeciesSighting[];
  center?: [number, number];
  zoom?: number;
  show3DTerrain?: boolean;
  showGeofencing?: boolean;
  onMarkerClick?: (sighting: SpeciesSighting) => void;
  className?: string;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({
  parks = [],
  sightings = [],
  center = [20.5937, 78.9629], // Center of India
  zoom = 5,
  show3DTerrain = true,
  showGeofencing = true,
  onMarkerClick,
  className,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeLayer, setActiveLayer] = useState<'satellite' | 'terrain' | 'streets'>('satellite');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSighting, setSelectedSighting] = useState<SpeciesSighting | null>(null);

  // Mock Mapbox initialization
  useEffect(() => {
    if (!mapContainer.current) return;

    // In production, initialize Mapbox GL here:
    // const map = new mapboxgl.Map({
    //   container: mapContainer.current,
    //   style: 'mapbox://styles/mapbox/satellite-v9',
    //   center: center,
    //   zoom: zoom,
    //   pitch: show3DTerrain ? 60 : 0,
    //   bearing: 0
    // });

    console.log('Map initialized with center:', center, 'zoom:', zoom);
  }, [center, zoom, show3DTerrain]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      mapContainer.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleMarkerClick = (sighting: SpeciesSighting) => {
    setSelectedSighting(sighting);
    onMarkerClick?.(sighting);
  };

  return (
    <div className={cn('relative w-full h-full', className)}>
      <div
        ref={mapContainer}
        className="relative w-full h-full rounded-3xl overflow-hidden bg-gradient-to-br from-green-900 to-blue-900"
      >
        {/* Mock Map Background */}
        <div className="absolute inset-0 opacity-50">
          <div className="w-full h-full bg-[url('https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/78.9629,20.5937,5/1200x800?access_token=pk.mock')] bg-cover bg-center" />
        </div>

        {/* Map Controls */}
        <div className="absolute top-4 right-4 space-y-2 z-10">
          {/* Layer Selector */}
          <motion.div
            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-2 shadow-xl dark:bg-black/30"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Button
              variant="glass"
              size="sm"
              leftIcon={<Layers className="w-4 h-4" />}
              onClick={() => setShowFilters(!showFilters)}
            >
              Layers
            </Button>
          </motion.div>

          {/* Fullscreen Toggle */}
          <motion.div
            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-2 shadow-xl dark:bg-black/30"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              {isFullscreen ? (
                <Minimize2 className="w-5 h-5 text-white" />
              ) : (
                <Maximize2 className="w-5 h-5 text-white" />
              )}
            </button>
          </motion.div>

          {/* Navigation */}
          <motion.div
            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-2 shadow-xl dark:bg-black/30"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
              <Navigation className="w-5 h-5 text-white" />
            </button>
          </motion.div>
        </div>

        {/* Layer Filter Panel */}
        {showFilters && (
          <motion.div
            className="absolute top-4 left-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-xl dark:bg-black/30 z-10"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Map Layers
            </h3>
            <div className="space-y-2">
              {['satellite', 'terrain', 'streets'].map((layer) => (
                <button
                  key={layer}
                  onClick={() => setActiveLayer(layer as typeof activeLayer)}
                  className={cn(
                    'w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left',
                    activeLayer === layer
                      ? 'bg-primary-500 text-white'
                      : 'bg-white/5 text-white/70 hover:bg-white/10'
                  )}
                >
                  {layer.charAt(0).toUpperCase() + layer.slice(1)}
                </button>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
              <label className="flex items-center gap-2 text-white text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={show3DTerrain}
                  className="rounded"
                  readOnly
                />
                <span>3D Terrain</span>
              </label>
              <label className="flex items-center gap-2 text-white text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={showGeofencing}
                  className="rounded"
                  readOnly
                />
                <span>Park Boundaries</span>
              </label>
            </div>
          </motion.div>
        )}

        {/* Species Markers */}
        <div className="absolute inset-0 pointer-events-none">
          {sightings.map((sighting, index) => (
            <motion.div
              key={sighting.id}
              className="absolute pointer-events-auto"
              style={{
                left: `${((sighting.longitude + 180) / 360) * 100}%`,
                top: `${((90 - sighting.latitude) / 180) * 100}%`,
                transform: 'translate(-50%, -100%)',
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <MapMarker
                species={sighting.species}
                count={sighting.count}
                conservationStatus={sighting.conservationStatus}
                isActive={selectedSighting?.id === sighting.id}
                onClick={() => handleMarkerClick(sighting)}
              />
            </motion.div>
          ))}
        </div>

        {/* Selected Sighting Info Panel */}
        {selectedSighting && (
          <motion.div
            className="absolute bottom-4 left-4 right-4 md:left-auto md:w-96 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl dark:bg-black/30 z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">
                  {selectedSighting.species}
                </h3>
                <p className="text-sm text-white/70">
                  {selectedSighting.count} sighting{selectedSighting.count > 1 ? 's' : ''}
                </p>
              </div>
              <Badge variant={selectedSighting.conservationStatus} glow>
                {selectedSighting.conservationStatus.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
              </Badge>
            </div>
            <div className="space-y-2 text-sm text-white/80">
              <p>
                <strong>Location:</strong> {selectedSighting.latitude.toFixed(4)}°N, {selectedSighting.longitude.toFixed(4)}°E
              </p>
              <p>
                <strong>Last Seen:</strong> {new Date(selectedSighting.timestamp).toLocaleString()}
              </p>
            </div>
            <div className="mt-4 flex gap-2">
              <Button variant="primary" size="sm" className="flex-1">
                View Details
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedSighting(null)}
              >
                Close
              </Button>
            </div>
          </motion.div>
        )}

        {/* Stats Overlay */}
        <motion.div
          className="absolute top-4 left-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-xl dark:bg-black/30"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{parks.length}</div>
              <div className="text-xs text-white/70">Parks</div>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{sightings.length}</div>
              <div className="text-xs text-white/70">Sightings</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default InteractiveMap;
