import { useState } from "react";
import Sidebar from "@/components/sidebar";
import WeatherMap from "@/components/weather-map";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Wifi, WifiOff, Zap } from "lucide-react";

export default function Dashboard() {
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lon: number;
    name: string;
  } | null>(null);
  
  const [isConnected, setIsConnected] = useState(true);

  const toggleConnection = () => {
    setIsConnected(!isConnected);
  };

  return (
    <div className="min-h-screen bg-background dark:bg-gray-950 text-foreground">
      {/* Header */}
      <header className="bg-primary dark:bg-gray-900 text-white shadow-lg border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Zap className="text-yellow-400 h-7 w-7" />
              <h1 className="text-2xl font-bold">Storm Watch Sky</h1>
              <span className="text-sm bg-blue-600 px-2 py-1 rounded text-white">Web App</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm">
                {isConnected ? (
                  <Wifi className="text-green-400 h-4 w-4" />
                ) : (
                  <WifiOff className="text-red-400 h-4 w-4" />
                )}
                <span className={isConnected ? "text-green-400" : "text-red-400"}>
                  {isConnected ? "Connected" : "Disconnected"}
                </span>
              </div>
              <ThemeToggle />
              <Button
                variant={isConnected ? "destructive" : "default"}
                size="sm"
                onClick={toggleConnection}
                className="text-xs"
              >
                {isConnected ? "Disconnect" : "Connect"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex min-h-screen">
        <Sidebar 
          selectedLocation={selectedLocation}
          onLocationSelect={setSelectedLocation}
          isConnected={isConnected}
        />
        <WeatherMap 
          selectedLocation={selectedLocation} 
          isConnected={isConnected}
        />
      </div>
    </div>
  );
}
