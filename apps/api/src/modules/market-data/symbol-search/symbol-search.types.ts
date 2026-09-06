import type { MarketDataProvider } from "@financial-dashboard/api-contracts/market-data";

export interface SymbolSearchQuery {
  keywords: string;
  provider: MarketDataProvider;
}
