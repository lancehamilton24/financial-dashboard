import { fetchSymbolSearchResults } from "../clients/alpha-vantage/client.js";
import type { AlphaVantageSymbolSearchMatch } from "../clients/alpha-vantage/schema.js";
import type {
  SymbolSearchResults,
  SymbolSearchResultItem,
} from "../types/symbol-search-result.type.js";
import { normalizeSymbol } from "../utils/symbol.js";

export async function getSymbolSearchResults(
  keywords: string,
): Promise<SymbolSearchResults | null> {
  const matches = await fetchSymbolSearchResults(keywords);

  if (matches.bestMatches.length === 0) {
    return null;
  }

  const results = matches.bestMatches.map(toSymbolSearchResult);

  return results;
}

export async function getExactSymbolMatch(
  symbol: string,
): Promise<SymbolSearchResultItem | null> {
  const normalizedSymbol = normalizeSymbol(symbol);

  const results = await getSymbolSearchResults(normalizedSymbol);

  const exactMatch =
    results?.find(
      (result) => result.symbol.toUpperCase() === normalizedSymbol,
    ) ?? null;

  return exactMatch;
}

function toSymbolSearchResult(
  symbol: AlphaVantageSymbolSearchMatch,
): SymbolSearchResultItem {
  return {
    symbol: symbol["1. symbol"],
    name: symbol["2. name"],
    type: symbol["3. type"],
    region: symbol["4. region"],
    currency: symbol["8. currency"],
  };
}
