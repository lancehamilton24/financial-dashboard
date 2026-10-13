import type {
  FinancialStatement,
  FinancialStatementType,
  MarketDataProvider,
} from "@financial-dashboard/api-contracts/market-data";
import { getMarketDataClient } from "../../../configured-api-clients.js";
import { normalizeSymbol } from "../shared/symbol.js";

export async function getFinancialStatement(
  symbol: string,
  type: FinancialStatementType,
  provider: MarketDataProvider,
): Promise<FinancialStatement | null> {
  const client = getMarketDataClient(provider);
  if (!client.fetchFinancialStatement)
    throw new Error("This provider does not support financial statements.");
  return client.fetchFinancialStatement(normalizeSymbol(symbol), type);
}
