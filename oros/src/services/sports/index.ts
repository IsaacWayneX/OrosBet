import { env } from "../../config/env.js";
import { SportsProvider } from "./provider.interface.js";
import { SportmonksService } from "./sportmonks.service.js";
import { MockSportsService } from "./mock-sports.service.js";

/**
 * Sports provider factory
 * Returns appropriate provider based on SPORTS_MODE
 */
export function getSportsProvider(): SportsProvider {
  const mode = env.sportsMode;

  console.log(`[Sports] Initializing provider: ${mode}`);

  if (mode === "real") {
    if (!env.sportsApiKey) {
      console.error("[Sports] SPORTS_API_KEY is not configured");
      throw new Error("SPORTS_API_KEY is required for real mode");
    }
    return new SportmonksService();
  }

  // Default to mock
  return new MockSportsService();
}

export * from "./provider.interface.js";
export { SportmonksService } from "./sportmonks.service.js";
export { MockSportsService } from "./mock-sports.service.js";
