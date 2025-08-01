import { useQuery } from "@tanstack/react-query";
import { WeatherData } from "@shared/schema";

export function useWeather(cityName: string) {
  return useQuery<WeatherData>({
    queryKey: ["/api/weather", cityName],
    enabled: !!cityName,
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    staleTime: 2 * 60 * 1000, // Consider data stale after 2 minutes
  });
}
