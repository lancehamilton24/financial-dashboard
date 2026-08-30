import type {
  CompanyOverview,
  MarketDataProvider,
} from "@financial-dashboard/api-contracts/market-data";
import { getMarketDataClient } from "../../../configured-api-clients.js";
import { normalizeSymbol } from "../shared/symbol.js";

export async function getCompanyOverview(
  symbol: string,
  provider: MarketDataProvider,
): Promise<CompanyOverview | null> {
  const normalizedSymbol = normalizeSymbol(symbol);
  const marketDataClient = getMarketDataClient(provider);

  const overview =
    await marketDataClient.fetchCompanyOverview(normalizedSymbol);

  if (!overview) {
    return null;
  }

  if (overview.symbol.toUpperCase() !== normalizedSymbol) {
    return null;
  }

  return overview;
}
