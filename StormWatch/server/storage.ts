import { type WeatherData, type LightningStrike } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  addLightningStrike(strike: Omit<LightningStrike, 'id'>): Promise<LightningStrike>;
  getRecentLightningStrikes(limit?: number): Promise<LightningStrike[]>;
  clearOldLightningStrikes(olderThanMinutes: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private lightningStrikes: Map<string, LightningStrike>;

  constructor() {
    this.lightningStrikes = new Map();
  }

  async addLightningStrike(strikeData: Omit<LightningStrike, 'id'>): Promise<LightningStrike> {
    const id = randomUUID();
    const strike: LightningStrike = { ...strikeData, id };
    this.lightningStrikes.set(id, strike);
    return strike;
  }

  async getRecentLightningStrikes(limit: number = 50): Promise<LightningStrike[]> {
    const strikes = Array.from(this.lightningStrikes.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
    return strikes;
  }

  async clearOldLightningStrikes(olderThanMinutes: number): Promise<void> {
    const cutoffTime = new Date(Date.now() - olderThanMinutes * 60 * 1000);
    const entries = Array.from(this.lightningStrikes.entries());
    for (const [id, strike] of entries) {
      if (strike.timestamp < cutoffTime) {
        this.lightningStrikes.delete(id);
      }
    }
  }
}

export const storage = new MemStorage();
