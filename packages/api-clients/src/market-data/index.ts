import type {
  CompanyOverview,
  SymbolSearchResult,
} from "@financial-dashboard/api-contracts/market-data";

export type MarketDataClient = {
  fetchCompanyOverview(symbol: string): Promise<CompanyOverview | null>;
  searchSymbols(keywords: string): Promise<SymbolSearchResult[]>;
};
