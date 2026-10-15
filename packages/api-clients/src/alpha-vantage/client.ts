import {
  type AlphaVantageCompanyOverview,
  type AlphaVantageSymbolSearchResponse,
  alphaVantageCompanyOverviewSchema,
  alphaVantageSymbolSearchResponseSchema,
} from "./schemas/index.js";
import type {
  CompanyOverview,
  SymbolSearchResult,
} from "@financial-dashboard/api-contracts/market-data";
import type { MarketDataClient } from "../market-data/index.js";
import { fetchFinancialStatement } from "./financial-statements.js";
import {
  createAlphaVantageRequest,
  type AlphaVantageRequest,
} from "./request.js";

export type AlphaVantageClientOptions = {
  apiKey: string;
};

export function createAlphaVantageClient(
  options: AlphaVantageClientOptions,
): MarketDataClient {
  const request = createAlphaVantageRequest(options.apiKey);
  return {
    fetchFinancialStatement: (symbol, type) =>
      fetchFinancialStatement(request, symbol, type),
    fetchCompanyOverview: (symbol: string) =>
      fetchCompanyOverview(request, symbol),
    searchSymbols: (keywords: string) => searchSymbols(request, keywords),
  };
}

async function fetchCompanyOverview(
  request: AlphaVantageRequest,
  symbol: string,
): Promise<CompanyOverview | null> {
  const body = await request("OVERVIEW", { symbol });

  if (isEmptyObject(body)) {
    return null;
  }

  const result = alphaVantageCompanyOverviewSchema.safeParse(body);

  if (!result.success) {
    throw new Error(
      `[fetchCompanyOverview] Company overview GET request to Alpha Vantage failed. Unexpected response shape for symbol '${symbol}'.`,
    );
  }

  return toCompanyOverview(result.data);
}

async function searchSymbols(
  request: AlphaVantageRequest,
  keywords: string,
): Promise<SymbolSearchResult[]> {
  const body = await request("SYMBOL_SEARCH", { keywords: keywords.trim() });

  if (isEmptyObject(body)) {
    return [];
  }

  const result = alphaVantageSymbolSearchResponseSchema.safeParse(body);

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
