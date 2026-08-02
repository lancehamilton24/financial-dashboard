import type { SymbolSearchResult } from "@financial-dashboard/api-clients/market-data";
import { marketDataClient } from "../../../configured-api-clients.js";
import type { SymbolSearchResults } from "./symbol-search.types.js";
import { normalizeSymbol } from "../shared/symbol.js";

export async function getSymbolSearchResults(
  keywords: string,
): Promise<SymbolSearchResults | null> {
  const matches = await marketDataClient.searchSymbols(keywords);

  if (matches.length === 0) {
    return null;
  }

  return matches;
}

export async function getExactSymbolMatch(
  symbol: string,
): Promise<SymbolSearchResult | null> {
  const normalizedSymbol = normalizeSymbol(symbol);

  const matches = await getSymbolSearchResults(normalizedSymbol);

  const result =
    matches?.find(
      (result) => result.symbol.toUpperCase() === normalizedSymbol,
    ) ?? null;

  return result;
}
