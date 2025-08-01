import { useQuery } from "@tanstack/react-query";
import { LightningStrike } from "@shared/schema";

export function useLightning() {
  const query = useQuery<LightningStrike[]>({
    queryKey: ["/api/lightning"],
    refetchInterval: 10000, // Refetch every 10 seconds
  });

  const formatTimeAgo = (timestamp: Date | string) => {
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return `00:00:${diffInSeconds.toString().padStart(2, '0')}`;
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      const seconds = diffInSeconds % 60;
      return `00:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      const minutes = Math.floor((diffInSeconds % 3600) / 60);
      const seconds = diffInSeconds % 60;
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } else {
      const options: Intl.DateTimeFormatOptions = {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
      return date.toLocaleDateString('en-US', options);
    }
  };

  const getIntensityBars = (intensity: number) => {
    return Array.from({ length: 10 }, (_, i) => ({
      key: i,
      isActive: i < intensity,
      className: `w-2 h-1 rounded ${i < intensity ? 'bg-warning' : 'bg-gray-300'}`
    }));
  };

  return {
    ...query,
    formatTimeAgo,
    getIntensityBars,
  };
}
