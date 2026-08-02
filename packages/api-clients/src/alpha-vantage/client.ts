import {
  type AlphaVantageCompanyOverview,
  type AlphaVantageSymbolSearchResponse,
  alphaVantageCompanyOverviewSchema,
  alphaVantageSymbolSearchResponseSchema,
} from "./schemas/index.js";
import type {
  CompanyOverview,
  MarketDataClient,
  SymbolSearchResult,
} from "../market-data/index.js";

export type AlphaVantageClientOptions = {
  apiKey: string;
  baseUrl: string;
};

export function createAlphaVantageClient(
  options: AlphaVantageClientOptions,
): MarketDataClient {
  return {
    fetchCompanyOverview: (symbol: string) =>
      fetchCompanyOverview(options, symbol),
    searchSymbols: (keywords: string) => searchSymbols(options, keywords),
  };
}

async function fetchCompanyOverview(
  options: AlphaVantageClientOptions,
  symbol: string,
): Promise<CompanyOverview | null> {
  const url = new URL(options.baseUrl);
  url.searchParams.set("function", "OVERVIEW");
  url.searchParams.set("symbol", symbol);
  url.searchParams.set("apikey", options.apiKey);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `[fetchCompanyOverview] Company overview GET request to Alpha Vantage failed with status ${response.status}.`,
    );
  }

  const body = await response.json();

  if (isEmptyObject(body)) {
    return null;
  }

  const errorMessage = body["Error Message"] ?? body.Information;

  if (errorMessage) {
    throw new Error(
      `[fetchCompanyOverview] Company overview GET request to Alpha Vantage failed: ${errorMessage}`,
    );
  }

  const result = await alphaVantageCompanyOverviewSchema.safeParseAsync(body);

  if (!result.success) {
    throw new Error(
      `[fetchCompanyOverview] Company overview GET request to Alpha Vantage failed. Unexpected response shape for symbol '${symbol}'.`,
    );
  }

  return toCompanyOverview(result.data);
}

async function searchSymbols(
  options: AlphaVantageClientOptions,
  keywords: string,
): Promise<SymbolSearchResult[]> {
  const url = new URL(options.baseUrl);
  url.searchParams.set("function", "SYMBOL_SEARCH");
  url.searchParams.set("keywords", keywords.trim());
  url.searchParams.set("apikey", options.apiKey);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `[searchSymbols] Symbol search GET request to Alpha Vantage failed with status ${response.status}.`,
    );
  }

  const body = await response.json();

  if (isEmptyObject(body)) {
    return [];
  }

  const errorMessage = body["Error Message"] ?? body.Information;

  if (errorMessage) {
    throw new Error(
      `[searchSymbols] Symbol search GET request to Alpha Vantage failed: ${errorMessage}`,
    );
  }

  const result =
    await alphaVantageSymbolSearchResponseSchema.safeParseAsync(body);

  if (!result.success) {
    throw new Error(
      `[searchSymbols] Unexpected response shape for keywords '${keywords}'.`,
    );
  }

  return result.data.bestMatches.map(toSymbolSearchResult);
}

function toCompanyOverview(
  overview: AlphaVantageCompanyOverview,
): CompanyOverview {
  return {
    symbol: overview.Symbol,
    assetType: overview.AssetType,
    name: overview.Name,
    description: overview.Description,
    exchange: overview.Exchange,
    country: overview.Country,
    sector: overview.Sector,
    industry: overview.Industry,
    peRatio: overview.PERatio,
    eps: overview.EPS,
    forwardPE: overview.ForwardPE,
  };
}

function toSymbolSearchResult(
  match: AlphaVantageSymbolSearchResponse["bestMatches"][number],
): SymbolSearchResult {
  return {
    symbol: match["1. symbol"],
    name: match["2. name"],
    type: match["3. type"],
    region: match["4. region"],
    currency: match["8. currency"],
  };
}

function isEmptyObject(value: unknown): boolean {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    Object.keys(value).length === 0
  );
}
