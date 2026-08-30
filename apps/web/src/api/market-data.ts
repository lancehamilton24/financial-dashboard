import type { CompanyOverview, MarketDataProvider, SymbolSearchResults } from "@financial-dashboard/api-contracts/market-data";

export class ApiError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
    this.name = "ApiError";
  }
}

async function readResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const message = (await response.text()) || "The request could not be completed.";
    throw new ApiError(message, response.status);
  }
  return response.json() as Promise<T>;
}

export async function searchSymbols(keywords: string, provider: MarketDataProvider, signal?: AbortSignal): Promise<SymbolSearchResults> {
  const query = new URLSearchParams({ keywords, provider });
  return readResponse<SymbolSearchResults>(await fetch(`/api/symbols/search?${query}`, { signal }));
}

export async function fetchCompanyOverview(symbol: string, provider: MarketDataProvider, signal?: AbortSignal): Promise<CompanyOverview> {
  const query = new URLSearchParams({ provider });
  return readResponse<CompanyOverview>(await fetch(`/api/companies/${encodeURIComponent(symbol)}/overview?${query}`, { signal }));
}
