import { createAlphaVantageClient } from "@financial-dashboard/api-clients/alpha-vantage";
import type { MarketDataClient } from "@financial-dashboard/api-clients/market-data";
import config from "./config/index.js";

function configureMarketDataClient(): MarketDataClient {
  switch (config.marketDataProvider) {
    case "alpha-vantage":
      return createAlphaVantageClient({
        apiKey: config.alphaVantageApiKey,
        baseUrl: config.alphaVantageBaseUrl,
      });
  }
}

export const marketDataClient = configureMarketDataClient();
