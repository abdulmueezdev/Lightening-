import { WeatherData, CitySearchResult } from "@shared/schema";

export async function searchCities(query: string): Promise<CitySearchResult[]> {
  if (query.length < 2) return [];
  
  const response = await fetch(`/api/cities/search?q=${encodeURIComponent(query)}`);
  
  if (!response.ok) {
    throw new Error('Failed to search cities');
  }
  
  return response.json();
}

export async function getWeatherData(cityName: string): Promise<WeatherData> {
  const response = await fetch(`/api/weather/${encodeURIComponent(cityName)}`);
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('City not found');
    }
    throw new Error('Failed to fetch weather data');
  }
  
  return response.json();
}

export async function reverseGeocode(lat: number, lon: number): Promise<{ location: string }> {
  const response = await fetch(`/api/reverse-geocode?lat=${lat}&lon=${lon}`);
  
  if (!response.ok) {
    throw new Error('Failed to reverse geocode');
  }
  
  return response.json();
}
