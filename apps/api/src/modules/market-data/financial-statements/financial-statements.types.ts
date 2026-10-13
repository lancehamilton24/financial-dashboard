import type {
  FinancialStatementType,
  MarketDataProvider,
} from "@financial-dashboard/api-contracts/market-data";

export interface FinancialStatementParams {
  symbol: string;
  type: FinancialStatementType;
}

export interface FinancialStatementQuery {
  provider: MarketDataProvider;
}
