import { fetchOverviewMetrics } from "./overview-metrics.js";
import {
  createFinancialModelingPrepRequest,
  type FinancialModelingPrepRequest,
} from "./request.js";
import { fetchFinancialStatement } from "./financial-statements.js";
import type {
  CompanyOverview,
  SymbolSearchResult,
} from "@financial-dashboard/api-contracts/market-data";
import type { MarketDataClient } from "../market-data/index.js";
import {
  type FinancialModelingPrepCompanyProfile,
  type FinancialModelingPrepSymbolSearchResult,
  financialModelingPrepCompanyProfileResponseSchema,
  financialModelingPrepSymbolSearchResponseSchema,
} from "./schemas/index.js";

export type FinancialModelingPrepClientOptions = {
  apiKey: string;
};

export function createFinancialModelingPrepClient(
  options: FinancialModelingPrepClientOptions,
): MarketDataClient {
  const request = createFinancialModelingPrepRequest(options.apiKey);
  return {
    fetchFinancialStatement: (symbol, type) =>
      fetchFinancialStatement(request, symbol, type),
    fetchCompanyOverview: (symbol) => fetchCompanyOverview(request, symbol),
    searchSymbols: (keywords) => searchSymbols(request, keywords),
  };
}

async function fetchCompanyOverview(
  request: FinancialModelingPrepRequest,
  symbol: string,
): Promise<CompanyOverview | null> {
  const body = await request("profile", { symbol: symbol.trim() });
  const result =
    financialModelingPrepCompanyProfileResponseSchema.safeParse(body);

  if (!result.success) {
    throw new Error(
      `[fetchCompanyOverview] Company profile GET request to Financial Modeling Prep returned an unexpected response shape for symbol '${symbol}'.`,
    );
  }

  const profile = result.data[0];
  if (!profile) return null;
  const metrics = await fetchOverviewMetrics(
    request,
    profile.symbol,
    profile.price,
  );
  return { ...toCompanyOverview(profile), ...metrics };
}

async function searchSymbols(
  request: FinancialModelingPrepRequest,
  keywords: string,
): Promise<SymbolSearchResult[]> {
  const body = await request("search-symbol", { query: keywords.trim() });
  const result =
    financialModelingPrepSymbolSearchResponseSchema.safeParse(body);

  if (!result.success) {
    throw new Error(
      `[searchSymbols] Symbol search GET request to Financial Modeling Prep returned an unexpected response shape for keywords '${keywords}'.`,
    );
  }

  return result.data.map(toSymbolSearchResult);
}

function toCompanyOverview(
  profile: FinancialModelingPrepCompanyProfile,
): CompanyOverview {
  return {
    symbol: profile.symbol,
    assetType: getAssetType(profile),
    name: profile.companyName,
    description: profile.description ?? "",
    exchange:
      profile.exchangeFullName ??
      profile.exchange ??
      profile.exchangeShortName ??
      "",
    country: profile.country ?? "",
    sector: profile.sector ?? "",
    industry: profile.industry ?? "",
    peRatio: "",
    eps: "",
    forwardPE: "",
  };
}

function getAssetType(profile: FinancialModelingPrepCompanyProfile): string {
  if (profile.isEtf) return "ETF";
  if (profile.isFund) return "Fund";
  if (profile.isAdr) return "ADR";
  return "Stock";
}

function toSymbolSearchResult(
  result: FinancialModelingPrepSymbolSearchResult,
): SymbolSearchResult {
  return {
    symbol: result.symbol,
    name: result.name,
    type: "Stock",
    region:
      result.stockExchange ||
      result.exchangeFullName ||
      result.exchangeShortName ||
      result.exchange,
    currency: result.currency,
  };
}
