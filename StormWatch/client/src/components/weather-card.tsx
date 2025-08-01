import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { RefreshCw, Thermometer, Droplets, Wind, Eye } from "lucide-react";
import { WeatherData } from "@shared/schema";

interface WeatherCardProps {
  selectedLocation: { lat: number; lon: number; name: string } | null;
  isConnected: boolean;
}

export default function WeatherCard({ selectedLocation, isConnected }: WeatherCardProps) {
  // Extract city name properly, handling coordinates vs city names
  const getCityName = () => {
    if (!selectedLocation) return "San Francisco";
    
    const name = selectedLocation.name;
    // Check if it's coordinates format like "37.7749, -122.4194"
    if (name.match(/^-?\d+\.\d+,\s*-?\d+\.\d+$/)) {
      // It's coordinates, return null to disable the query
      return null;
    }
    
    // It's a city name, extract the first part before any comma
    return name.split(',')[0].trim();
  };
  
  const cityName = getCityName();
  
  const { data: weather, isLoading, error, refetch } = useQuery<WeatherData>({
    queryKey: ["/api/weather", cityName],
    queryFn: async () => {
      if (!cityName) throw new Error('No city name provided');
      const response = await fetch(`/api/weather/${encodeURIComponent(cityName)}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('City not found');
        }
        throw new Error('Failed to fetch weather data');
      }
      return response.json();
    },
    enabled: !!cityName && isConnected,
    refetchInterval: isConnected ? 5 * 60 * 1000 : false, // Refetch every 5 minutes if connected
  });

  const handleRefresh = () => {
    refetch();
  };

  if (error) {
    return (
      <div className="bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-red-800 dark:text-red-200">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">Weather Error</h3>
          <Button variant="ghost" size="sm" onClick={handleRefresh} className="hover:bg-red-200 dark:hover:bg-red-800/20">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm">Failed to load weather data</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="weather-gradient rounded-xl p-6 text-white">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Current Weather</h3>
            <div className="w-6 h-6 bg-white/20 rounded"></div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="w-16 h-4 bg-white/20 rounded mb-2"></div>
                <div className="w-24 h-5 bg-white/20 rounded"></div>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded"></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white/10 rounded-lg p-3">
                  <div className="w-16 h-8 bg-white/20 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="weather-gradient rounded-xl p-6 text-white">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Current Weather</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleRefresh}
          className="text-white/80 hover:text-white hover:bg-white/10"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90">Location</p>
            <p className="font-semibold">{weather?.location || cityName}</p>
          </div>
          <i className="fas fa-cloud-sun text-3xl opacity-90"></i>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <Thermometer className="h-4 w-4 text-orange-300" />
              <div>
                <p className="text-xs opacity-80">Temperature</p>
                <p className="text-lg font-bold">{weather?.temperature}°C</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <Droplets className="h-4 w-4 text-blue-300" />
              <div>
                <p className="text-xs opacity-80">Humidity</p>
                <p className="text-lg font-bold">{weather?.humidity}%</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <Wind className="h-4 w-4 text-gray-300" />
              <div>
                <p className="text-xs opacity-80">Wind Speed</p>
                <p className="text-lg font-bold">{weather?.windSpeed} km/h</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <Eye className="h-4 w-4 text-gray-300" />
              <div>
                <p className="text-xs opacity-80">Visibility</p>
                <p className="text-lg font-bold">{weather?.visibility || 'N/A'} km</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
