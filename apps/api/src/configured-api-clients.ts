import { createAlphaVantageClient } from "@financial-dashboard/api-clients/alpha-vantage";
import { createFinancialModelingPrepClient } from "@financial-dashboard/api-clients/financial-modeling-prep";
import type { MarketDataClient } from "@financial-dashboard/api-clients/market-data";
import type { MarketDataProvider } from "@financial-dashboard/api-contracts/market-data";
import config from "./config/index.js";

const marketDataClients: Partial<Record<MarketDataProvider, MarketDataClient>> = {
  "alpha-vantage": config.alphaVantageApiKey
    ? createAlphaVantageClient({ apiKey: config.alphaVantageApiKey })
    : undefined,
  "financial-modeling-prep": config.financialModelingPrepApiKey
    ? createFinancialModelingPrepClient({ apiKey: config.financialModelingPrepApiKey })
    : undefined,
};

export function getMarketDataClient(
  provider: MarketDataProvider,
): MarketDataClient {
  const client = marketDataClients[provider];

  if (!client) {
    throw new Error(`Market data provider '${provider}' is not configured.`);
  }

  return client;
}
