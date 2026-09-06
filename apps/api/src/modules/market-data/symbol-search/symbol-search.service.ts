import type {
  SymbolSearchResults,
  MarketDataProvider,
} from "@financial-dashboard/api-contracts/market-data";
import { getMarketDataClient } from "../../../configured-api-clients.js";

export async function getSymbolSearchResults(
  keywords: string,
  provider: MarketDataProvider,
): Promise<SymbolSearchResults | null> {
  const marketDataClient = getMarketDataClient(provider);
  const matches = await marketDataClient.searchSymbols(keywords);

  if (matches.length === 0) {
    return null;
  }

  return matches;
}
