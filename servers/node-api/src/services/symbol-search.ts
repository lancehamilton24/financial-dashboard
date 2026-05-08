import { searchSymbols } from "../clients/alpha-vantage/client.js";
import type { AlphaVantageSymbolSearchMatch } from "../clients/alpha-vantage/schema.js";
import type {
  SymbolSearchResult,
  SymbolSearchResultItem,
} from "../types/symbol-search-result.type.js";

export async function getSymbolSearchResults(
  keywords: string,
): Promise<SymbolSearchResult | null> {
  const matches = await searchSymbols(keywords);

  if (matches.bestMatches.length === 0) {
    return null;
  }

  const results = matches.bestMatches.map(toSymbolSearchResult);

  return results;
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
