import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { weatherDataSchema, citySearchResultSchema, lightningStrikeSchema } from "@shared/schema";
import axios from "axios";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Weather API endpoint
  app.get("/api/weather/:city", async (req, res) => {
    try {
      const { city } = req.params;
      const apiKey = process.env.VITE_OPENWEATHERMAP_API_KEY;
      
      if (!apiKey) {
        return res.status(500).json({ error: "OpenWeatherMap API key not configured" });
      }

      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`
      );

      const data = response.data;
      const weatherData = {
        location: `${data.name}, ${data.sys.country}`,
        coordinates: {
          lat: data.coord.lat,
          lon: data.coord.lon,
        },
        temperature: Math.round(data.main.temp),
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
        visibility: data.visibility ? Math.round(data.visibility / 1000) : undefined,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
      };

      const validated = weatherDataSchema.parse(weatherData);
      res.json(validated);
    } catch (error) {
      console.error("Weather API error:", error);
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        res.status(404).json({ error: "City not found" });
      } else {
        res.status(500).json({ error: "Failed to fetch weather data" });
      }
    }
  });

  // City search autocomplete endpoint
  app.get("/api/cities/search", async (req, res) => {
    try {
      const { q } = req.query;
      
      if (!q || typeof q !== 'string' || q.length < 2) {
        return res.json([]);
      }

      const apiKey = process.env.VITE_MAPBOX_API_KEY;
      
      if (!apiKey) {
        return res.status(500).json({ error: "Mapbox API key not configured" });
      }

      const response = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(q)}.json?access_token=${apiKey}&types=place&limit=5`
      );

      const suggestions = response.data.features.map((feature: any) => ({
        placeName: feature.place_name,
        coordinates: {
          lat: feature.center[1],
          lon: feature.center[0],
        },
        context: feature.context?.map((ctx: any) => ctx.text) || [],
      }));

      const validated = suggestions.map((s: any) => citySearchResultSchema.parse(s));
      res.json(validated);
    } catch (error) {
      console.error("City search error:", error);
      res.status(500).json({ error: "Failed to search cities" });
    }
  });

  // Reverse geocoding proxy endpoint
  app.get("/api/reverse-geocode", async (req, res) => {
    try {
      const { lat, lon } = req.query;
      
      if (!lat || !lon) {
        return res.status(400).json({ error: "Latitude and longitude are required" });
      }

      const apiKey = process.env.VITE_MAPBOX_API_KEY;
      
      if (!apiKey) {
        return res.status(500).json({ error: "Mapbox API key not configured" });
      }

      const response = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lon},${lat}.json?access_token=${apiKey}&types=place`
      );

      const place = response.data.features[0];
      if (place) {
        res.json({ location: place.place_name });
      } else {
        res.json({ location: `${lat}, ${lon}` });
      }
    } catch (error) {
      console.error("Reverse geocoding error:", error);
      res.status(500).json({ error: "Failed to reverse geocode" });
    }
  });

  // Lightning strikes endpoints
  app.get("/api/lightning", async (req, res) => {
    try {
      const strikes = await storage.getRecentLightningStrikes(20);
      res.json(strikes);
    } catch (error) {
      console.error("Get lightning strikes error:", error);
      res.status(500).json({ error: "Failed to get lightning strikes" });
    }
  });

  app.post("/api/lightning", async (req, res) => {
    try {
      const strikeData = lightningStrikeSchema.omit({ id: true }).parse(req.body);
      const strike = await storage.addLightningStrike(strikeData);
      res.json(strike);
    } catch (error) {
      console.error("Add lightning strike error:", error);
      res.status(500).json({ error: "Failed to add lightning strike" });
    }
  });

  // Simulate lightning strikes
  const simulateLightningStrikes = () => {
    setInterval(async () => {
      try {
        // Generate random lightning strike
        const lat = 37.7749 + (Math.random() - 0.5) * 2; // Around San Francisco
        const lon = -122.4194 + (Math.random() - 0.5) * 2;
        
        // Get location name using reverse geocoding
        let location: string | undefined;
        try {
          const response = await axios.get(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${lon},${lat}.json?access_token=${process.env.VITE_MAPBOX_API_KEY}&types=place`
          );
          const place = response.data.features[0];
          location = place ? place.place_name : undefined;
        } catch (error) {
          console.error("Failed to get location for lightning strike:", error);
        }
        
        const strike = {
          coordinates: { lat, lon },
          location,
          intensity: Math.floor(Math.random() * 10) + 1,
          timestamp: new Date(),
        };

        await storage.addLightningStrike(strike);
        
        // Clean up old strikes (older than 1 hour)
        await storage.clearOldLightningStrikes(60);
      } catch (error) {
        console.error("Lightning simulation error:", error);
      }
    }, 15000); // Every 15 seconds
  };

  // Start lightning simulation
  simulateLightningStrikes();

  const httpServer = createServer(app);
  return httpServer;
}
