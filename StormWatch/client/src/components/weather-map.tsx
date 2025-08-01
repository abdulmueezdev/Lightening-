import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { LightningStrike } from "@shared/schema";
import { initializeMap } from "@/lib/mapbox";
import { 
  ZoomIn, 
  ZoomOut, 
  Home, 
  Maximize, 
  Zap, 
  Cloud, 
  Satellite,
  Database,
  Clock,
  Thermometer
} from "lucide-react";

interface WeatherMapProps {
  selectedLocation: { lat: number; lon: number; name: string } | null;
  isConnected: boolean;
}

export default function WeatherMap({ selectedLocation, isConnected }: WeatherMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [activeLayer, setActiveLayer] = useState<'lightning' | 'weather' | 'radar'>('lightning');
  const [coordinates, setCoordinates] = useState({ lat: 37.7749, lon: -122.4194 });
  const [lightningMarkers, setLightningMarkers] = useState<any[]>([]);

  const { data: lightningStrikes = [] } = useQuery<LightningStrike[]>({
    queryKey: ["/api/lightning"],
    queryFn: async () => {
      const response = await fetch('/api/lightning');
      if (!response.ok) {
        throw new Error('Failed to fetch lightning data');
      }
      const data = await response.json();
      return data.map((strike: any) => ({
        ...strike,
        timestamp: new Date(strike.timestamp)
      }));
    },
    refetchInterval: isConnected ? 10000 : false,
    enabled: isConnected,
  });

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    const mapInstance = initializeMap(mapContainer.current);
    
    if (mapInstance) {
      map.current = mapInstance;
      
      mapInstance.on('load', () => {
        setMapLoaded(true);
      });

      mapInstance.on('mousemove', (e: any) => {
        setCoordinates({
          lat: e.lngLat.lat,
          lon: e.lngLat.lng
        });
      });
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Update map center when location changes
  useEffect(() => {
    if (map.current && selectedLocation && mapLoaded) {
      map.current.flyTo({
        center: [selectedLocation.lon, selectedLocation.lat],
        zoom: 10,
        duration: 2000
      });
    }
  }, [selectedLocation, mapLoaded]);

  // Update lightning strikes on map
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Clear existing markers
    lightningMarkers.forEach(marker => marker.remove());
    setLightningMarkers([]);

    // Only add lightning markers if lightning layer is active
    if (activeLayer === 'lightning' && lightningStrikes.length > 0) {
      const newMarkers: any[] = [];

      lightningStrikes.forEach((strike) => {
        // Determine size and color based on intensity
        const intensity = strike.intensity;
        let size, color, pulseColor;
        
        if (intensity >= 8) {
          size = '24px';
          color = '#ef4444'; // red-500
          pulseColor = '#fca5a5'; // red-300
        } else if (intensity >= 5) {
          size = '20px';
          color = '#f59e0b'; // amber-500
          pulseColor = '#fcd34d'; // amber-300
        } else {
          size = '16px';
          color = '#eab308'; // yellow-500
          pulseColor = '#fde047'; // yellow-300
        }
        
        const markerEl = document.createElement('div');
        markerEl.className = 'lightning-marker';
        markerEl.style.cursor = 'pointer';
        
        markerEl.innerHTML = `
          <div style="
            position: relative; 
            width: ${size}; 
            height: ${size};
            z-index: 1000;
          ">
            <div style="
              width: ${size}; 
              height: ${size}; 
              background-color: ${pulseColor}; 
              border-radius: 50%; 
              animation: lightning-pulse 1s ease-in-out infinite;
              position: absolute;
              z-index: 999;
            "></div>
            <div style="
              width: ${size}; 
              height: ${size}; 
              background-color: ${color}; 
              border-radius: 50%; 
              display: flex; 
              align-items: center; 
              justify-content: center;
              position: absolute;
              z-index: 1000;
              color: white;
              font-size: 12px;
              font-weight: bold;
              border: 2px solid white;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            ">
              ⚡
            </div>
          </div>
        `;

        // Create marker with Mapbox
        if (window.mapboxgl && map.current) {
          const marker = new window.mapboxgl.Marker(markerEl)
            .setLngLat([strike.coordinates.lon, strike.coordinates.lat])
            .addTo(map.current);
          
          newMarkers.push(marker);
        }
      });

      setLightningMarkers(newMarkers);
    }
  }, [lightningStrikes, mapLoaded, activeLayer]);

  // Add weather layer functionality
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    const mapInstance = map.current as any;

    if (activeLayer === 'weather') {
      // Add temperature overlay layer
      if (!mapInstance.getSource('temperature-data')) {
        // Add a simple temperature visualization
        mapInstance.addSource('temperature-data', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: [-122.4194, 37.7749] // San Francisco
                },
                properties: {
                  temperature: 22,
                  city: 'San Francisco'
                }
              },
              {
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: [-118.2437, 34.0522] // Los Angeles
                },
                properties: {
                  temperature: 28,
                  city: 'Los Angeles'
                }
              },
              {
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: [-87.6298, 41.8781] // Chicago
                },
                properties: {
                  temperature: 15,
                  city: 'Chicago'
                }
              }
            ]
          }
        });

        mapInstance.addLayer({
          id: 'temperature-layer',
          type: 'circle',
          source: 'temperature-data',
          paint: {
            'circle-radius': 30,
            'circle-color': [
              'interpolate',
              ['linear'],
              ['get', 'temperature'],
              0, '#0000ff',  // Blue for cold
              15, '#00ff00', // Green for mild
              25, '#ffff00', // Yellow for warm
              35, '#ff0000'  // Red for hot
            ],
            'circle-opacity': 0.6
          }
        });

        mapInstance.addLayer({
          id: 'temperature-labels',
          type: 'symbol',
          source: 'temperature-data',
          layout: {
            'text-field': ['format', ['get', 'temperature'], '°C'],
            'text-font': ['Open Sans Regular'],
            'text-size': 12
          },
          paint: {
            'text-color': '#ffffff'
          }
        });
      }
    } else {
      // Remove weather layers when switching away
      if (mapInstance.getLayer('temperature-layer')) {
        mapInstance.removeLayer('temperature-layer');
        mapInstance.removeLayer('temperature-labels');
        mapInstance.removeSource('temperature-data');
      }
    }
  }, [activeLayer, mapLoaded]);

  // Add radar layer functionality
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    const mapInstance = map.current as any;

    if (activeLayer === 'radar') {
      // Add precipitation radar simulation
      if (!mapInstance.getSource('radar-data')) {
        mapInstance.addSource('radar-data', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                geometry: {
                  type: 'Polygon',
                  coordinates: [[
                    [-123, 38],
                    [-121, 38],
                    [-121, 36],
                    [-123, 36],
                    [-123, 38]
                  ]]
                },
                properties: {
                  intensity: 'heavy',
                  type: 'rain'
                }
              },
              {
                type: 'Feature',
                geometry: {
                  type: 'Polygon',
                  coordinates: [[
                    [-119, 35],
                    [-117, 35],
                    [-117, 33],
                    [-119, 33],
                    [-119, 35]
                  ]]
                },
                properties: {
                  intensity: 'light',
                  type: 'rain'
                }
              }
            ]
          }
        });

        mapInstance.addLayer({
          id: 'radar-layer',
          type: 'fill',
          source: 'radar-data',
          paint: {
            'fill-color': [
              'match',
              ['get', 'intensity'],
              'light', '#90EE90',  // Light green
              'moderate', '#32CD32', // Green
              'heavy', '#228B22',   // Dark green
              '#90EE90'
            ],
            'fill-opacity': 0.5
          }
        });
      }
    } else {
      // Remove radar layers when switching away
      if (mapInstance.getLayer('radar-layer')) {
        mapInstance.removeLayer('radar-layer');
        mapInstance.removeSource('radar-data');
      }
    }
  }, [activeLayer, mapLoaded]);

  const handleZoomIn = () => {
    if (map.current) {
      map.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (map.current) {
      map.current.zoomOut();
    }
  };

  const handleResetView = () => {
    if (map.current) {
      map.current.flyTo({
        center: [-122.4194, 37.7749], // San Francisco
        zoom: 9,
        duration: 2000
      });
    }
  };

  const handleFullscreen = () => {
    if (mapContainer.current) {
      if (mapContainer.current.requestFullscreen) {
        mapContainer.current.requestFullscreen();
      }
    }
  };

  return (
    <main className="flex-1 flex flex-col">
      {/* Map Controls */}
      <div className="bg-surface dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Interactive Map</h2>
            <div className="flex items-center space-x-2">
              <Button
                variant={activeLayer === 'lightning' ? 'default' : 'secondary'}
                size="sm"
                onClick={() => setActiveLayer('lightning')}
                title="Show live lightning strikes on the map"
              >
                <Zap className="mr-1 h-4 w-4" />
                Lightning
              </Button>
              <Button
                variant={activeLayer === 'weather' ? 'default' : 'secondary'}
                size="sm"
                onClick={() => setActiveLayer('weather')}
                title="Show weather overlays and temperature data"
              >
                <Cloud className="mr-1 h-4 w-4" />
                Weather
              </Button>
              <Button
                variant={activeLayer === 'radar' ? 'default' : 'secondary'}
                size="sm"
                onClick={() => setActiveLayer('radar')}
                title="Show weather radar and precipitation data"
              >
                <Satellite className="mr-1 h-4 w-4" />
                Radar
              </Button>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={handleZoomIn}>
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleZoomOut}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleResetView}>
              <Home className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleFullscreen}>
              <Maximize className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative">
        <div ref={mapContainer} className="w-full h-full" />

        {/* Map Legend and Layer Info */}
        <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 max-w-xs">
          <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">
            {activeLayer === 'lightning' ? 'Lightning Activity' : 
             activeLayer === 'weather' ? 'Weather Data' : 'Radar View'}
          </h4>
          
          {activeLayer === 'lightning' && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                  ⚡
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300">High Intensity (8+)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center">
                  ⚡
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300">Medium Intensity (5-7)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                  ⚡
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300">Low Intensity (1-4)</span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                Live lightning strikes updated every 10 seconds
              </p>
            </div>
          )}
          
          {activeLayer === 'weather' && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-700 dark:text-gray-300">Cold (0-15°C)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700 dark:text-gray-300">Mild (15-25°C)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-gray-700 dark:text-gray-300">Warm (25-35°C)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-700 dark:text-gray-300">Hot (35°C+)</span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                Temperature zones for major cities
              </p>
            </div>
          )}
          
          {activeLayer === 'radar' && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-300 rounded"></div>
                <span className="text-sm text-gray-700 dark:text-gray-300">Light Precipitation</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-600 rounded"></div>
                <span className="text-sm text-gray-700 dark:text-gray-300">Heavy Precipitation</span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                Simulated weather radar showing precipitation areas
              </p>
            </div>
          )}
        </div>

        {/* Coordinates Display */}
        <div className="absolute top-4 right-4 bg-black/75 text-white px-3 py-2 rounded-lg text-sm font-mono">
          {coordinates.lat.toFixed(4)}°N, {Math.abs(coordinates.lon).toFixed(4)}°W
        </div>
      </div>

      {/* Status Bar */}
      <div className="bg-surface border-t border-gray-200 px-4 py-2">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Database className="w-3 h-3" />
              <span>API Status: </span>
              <span className="text-success font-medium">Connected</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>Last Update: </span>
              <span>2 seconds ago</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Zap className="w-3 h-3" />
              <span>Lightning Strikes: </span>
              <span className="font-medium text-warning">{lightningStrikes.length}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Thermometer className="w-3 h-3" />
              <span>Temp Range: </span>
              <span className="font-medium">18°C - 24°C</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
