import { useQuery } from "@tanstack/react-query";
import { useLightning } from "@/hooks/use-lightning";
import { LightningStrike } from "@shared/schema";
import { Zap, CheckCircle, Clock } from "lucide-react";

interface LightningAlertsProps {
  enabled: boolean;
  isConnected: boolean;
}

export default function LightningAlerts({ enabled, isConnected }: LightningAlertsProps) {
  const { data: strikes = [], isLoading } = useQuery<LightningStrike[]>({
    queryKey: ["/api/lightning"],
    queryFn: async () => {
      const response = await fetch('/api/lightning');
      if (!response.ok) {
        throw new Error('Failed to fetch lightning data');
      }
      const data = await response.json();
      // Convert timestamp strings back to Date objects
      return data.map((strike: any) => ({
        ...strike,
        timestamp: new Date(strike.timestamp)
      }));
    },
    refetchInterval: enabled && isConnected ? 10000 : false, // Refetch every 10 seconds if enabled and connected
  });

  const { formatTimeAgo, getIntensityBars } = useLightning();

  if (!isConnected) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 py-8">
        <p className="text-sm">Connect to view lightning alerts</p>
      </div>
    );
  }

  if (!enabled) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 py-8">
        <p className="text-sm">Lightning alerts are disabled</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Lightning Alerts</h3>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-gray-500 dark:text-gray-400">Live</span>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-lg p-4 animate-pulse">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                <div className="flex-1">
                  <div className="w-32 h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="w-48 h-3 bg-gray-300 rounded mb-2"></div>
                  <div className="w-24 h-3 bg-gray-300 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : strikes.length > 0 ? (
        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
          {strikes.slice(0, 20).map((strike) => (
            <div
              key={strike.id}
              className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 animate-slide-in"
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <Zap className="w-5 h-5 text-yellow-600 dark:text-yellow-400 lightning-pulse" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">Lightning Strike Detected</p>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                    <span>
                      {strike.coordinates.lat.toFixed(2)}°N, {Math.abs(strike.coordinates.lon).toFixed(2)}°W
                    </span>
                    {strike.location && (
                      <>
                        {" • "}
                        <span>{strike.location}</span>
                      </>
                    )}
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400">Intensity:</span>
                      <div className="flex space-x-1">
                        {getIntensityBars(strike.intensity).map((bar) => (
                          <div
                            key={bar.key}
                            className={bar.className}
                          />
                        ))}
                      </div>
                      <span className="text-xs font-medium text-warning">
                        {strike.intensity}/10
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400">Time:</span>
                      <div className="text-xs text-gray-600 dark:text-gray-300 font-mono">
                        {formatTimeAgo(strike.timestamp)} ago
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-success/10 border border-success/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <CheckCircle className="w-5 h-5 text-success" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium text-gray-800">All Clear</p>
                <span className="text-xs text-gray-500">
                  <Clock className="w-3 h-3 inline mr-1" />
                  Now
                </span>
              </div>
              <p className="text-xs text-gray-600">
                No lightning activity detected in the area
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
