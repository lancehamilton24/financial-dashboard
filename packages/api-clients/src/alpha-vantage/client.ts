import {
  type AlphaVantageCompanyOverview,
  type AlphaVantageSymbolSearchResponse,
  alphaVantageCompanyOverviewSchema,
  alphaVantageSymbolSearchResponseSchema,
} from "./schemas/index.js";

export type AlphaVantageClientOptions = {
  apiKey: string;
  baseUrl: string;
};

export function createAlphaVantageClient(options: AlphaVantageClientOptions) {
  return {
    fetchCompanyOverview: (symbol: string) =>
      fetchCompanyOverview(options, symbol),
    fetchSymbolSearchResponse: (keywords: string) =>
      fetchSymbolSearchResponse(options, keywords),
  };
}

async function fetchCompanyOverview(
  options: AlphaVantageClientOptions,
  symbol: string,
): Promise<AlphaVantageCompanyOverview | null> {
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

  return result.data;
}

async function fetchSymbolSearchResponse(
  options: AlphaVantageClientOptions,
  keywords: string,
): Promise<AlphaVantageSymbolSearchResponse> {
  const url = new URL(options.baseUrl);
  url.searchParams.set("function", "SYMBOL_SEARCH");
  url.searchParams.set("keywords", keywords.trim());
  url.searchParams.set("apikey", options.apiKey);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `[fetchSymbolSearchResponse] Symbol search GET request to Alpha Vantage failed with status ${response.status}.`,
    );
  }

  const body = await response.json();

  if (isEmptyObject(body)) {
    return { bestMatches: [] };
  }
  
  const errorMessage = body["Error Message"] ?? body.Information;

  if (errorMessage) {
    throw new Error(
      `[fetchSymbolSearchResponse] Symbol search GET request to Alpha Vantage failed: ${errorMessage}`,
    );
  }

  const result =
    await alphaVantageSymbolSearchResponseSchema.safeParseAsync(body);

  if (!result.success) {
    throw new Error(
      `[fetchSymbolSearchResponse] Unexpected response shape for keywords '${keywords}'.`,
    );
  }

  return result.data;
}

function isEmptyObject(value: unknown): boolean {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    Object.keys(value).length === 0
  );
}
