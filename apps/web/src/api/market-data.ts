import { getSelectedProvider } from "./selected-provider";
import type { CompanyOverview, SymbolSearchResults } from "@financial-dashboard/api-contracts/market-data";

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

export async function searchSymbols(keywords: string, signal?: AbortSignal): Promise<SymbolSearchResults> {
  return request<SymbolSearchResults>("/api/symbols/search", { keywords }, signal);
}

export async function fetchCompanyOverview(symbol: string, signal?: AbortSignal): Promise<CompanyOverview> {
  return request<CompanyOverview>(`/api/companies/${encodeURIComponent(symbol)}/overview`, {}, signal);
}

async function request<T>(path: string, params: Record<string, string>, signal?: AbortSignal): Promise<T> {
  const query = new URLSearchParams({ ...params, provider: getSelectedProvider() });
  return readResponse<T>(await fetch(`${path}?${query}`, { signal }));
}
