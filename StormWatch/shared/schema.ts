import { z } from "zod";

export const weatherDataSchema = z.object({
  location: z.string(),
  coordinates: z.object({
    lat: z.number(),
    lon: z.number(),
  }),
  temperature: z.number(),
  humidity: z.number(),
  windSpeed: z.number(),
  visibility: z.number().optional(),
  description: z.string(),
  icon: z.string(),
});

export const lightningStrikeSchema = z.object({
  id: z.string(),
  coordinates: z.object({
    lat: z.number(),
    lon: z.number(),
  }),
  location: z.string().optional(),
  intensity: z.number().min(1).max(10),
  timestamp: z.date(),
});

export const citySearchResultSchema = z.object({
  placeName: z.string(),
  coordinates: z.object({
    lat: z.number(),
    lon: z.number(),
  }),
  context: z.array(z.string()).optional(),
});

export type WeatherData = z.infer<typeof weatherDataSchema>;
export type LightningStrike = z.infer<typeof lightningStrikeSchema>;
export type CitySearchResult = z.infer<typeof citySearchResultSchema>;
