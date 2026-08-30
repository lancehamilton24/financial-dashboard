import type { MarketDataProvider } from "@financial-dashboard/api-contracts/market-data";

export interface CompanyOverviewParams {
  symbol: string;
}

export interface CompanyOverviewQuery {
  provider: MarketDataProvider;
}
