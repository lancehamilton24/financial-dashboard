import type {
  CompanyOverview,
  FinancialStatement,
  FinancialStatementType,
  SymbolSearchResult,
} from "@financial-dashboard/api-contracts/market-data";

export type MarketDataClient = {
  fetchFinancialStatement?(
    symbol: string,
    type: FinancialStatementType,
  ): Promise<FinancialStatement | null>;
  fetchCompanyOverview(symbol: string): Promise<CompanyOverview | null>;
  searchSymbols(keywords: string): Promise<SymbolSearchResult[]>;
};
