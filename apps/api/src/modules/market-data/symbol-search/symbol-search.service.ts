import type {
  SymbolSearchResult,
  SymbolSearchResults,
  MarketDataProvider,
} from "@financial-dashboard/api-contracts/market-data";
import { getMarketDataClient } from "../../../configured-api-clients.js";
import { normalizeSymbol } from "../shared/symbol.js";

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

export async function getExactSymbolMatch(
  symbol: string,
  provider: MarketDataProvider,
): Promise<SymbolSearchResult | null> {
  const normalizedSymbol = normalizeSymbol(symbol);

  const matches = await getSymbolSearchResults(normalizedSymbol, provider);

  const result =
    matches?.find(
      (result) => result.symbol.toUpperCase() === normalizedSymbol,
    ) ?? null;

  return result;
}
