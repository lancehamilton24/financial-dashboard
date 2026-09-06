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

const FINANCIAL_MODELING_PREP_BASE_URL =
  "https://financialmodelingprep.com/stable";

export type FinancialModelingPrepClientOptions = {
  apiKey: string;
};

export function createFinancialModelingPrepClient(
  options: FinancialModelingPrepClientOptions,
): MarketDataClient {
  return {
    fetchCompanyOverview: (symbol) => fetchCompanyOverview(options, symbol),
    searchSymbols: (keywords) => searchSymbols(options, keywords),
  };
}

async function fetchCompanyOverview(
  options: FinancialModelingPrepClientOptions,
  symbol: string,
): Promise<CompanyOverview | null> {
  const url = createUrl(options, "profile");
  url.searchParams.set("symbol", symbol.trim());

  const body = await request(url, "fetchCompanyOverview");
  const result =
    await financialModelingPrepCompanyProfileResponseSchema.safeParseAsync(
      body,
    );

  if (!result.success) {
    throw new Error(
      `[fetchCompanyOverview] Company profile GET request to Financial Modeling Prep returned an unexpected response shape for symbol '${symbol}'.`,
    );
  }

  const profile = result.data[0];
  return profile ? toCompanyOverview(profile) : null;
}

async function searchSymbols(
  options: FinancialModelingPrepClientOptions,
  keywords: string,
): Promise<SymbolSearchResult[]> {
  const url = createUrl(options, "search-symbol");
  url.searchParams.set("query", keywords.trim());

  const body = await request(url, "searchSymbols");
  const result =
    await financialModelingPrepSymbolSearchResponseSchema.safeParseAsync(body);

  if (!result.success) {
    throw new Error(
      `[searchSymbols] Symbol search GET request to Financial Modeling Prep returned an unexpected response shape for keywords '${keywords}'.`,
    );
  }

  return result.data.map(toSymbolSearchResult);
}

function createUrl(
  options: FinancialModelingPrepClientOptions,
  path: string,
): URL {
  const baseUrl = FINANCIAL_MODELING_PREP_BASE_URL;
  const url = new URL(`${baseUrl.replace(/\/$/, "")}/${path}`);
  url.searchParams.set("apikey", options.apiKey);
  return url;
}

async function request(url: URL, operation: string): Promise<unknown> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `[${operation}] GET request to Financial Modeling Prep failed with status ${response.status}.`,
    );
  }

  const body: unknown = await response.json();
  if (isErrorResponse(body)) {
    throw new Error(
      `[${operation}] GET request to Financial Modeling Prep failed: ${body.message}.`,
    );
  }
  return body;
}

function isErrorResponse(value: unknown): value is { message: string } {
  return (
    typeof value === "object" &&
    value !== null &&
    "message" in value &&
    typeof value.message === "string"
  );
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
