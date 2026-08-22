import type { CompanyOverview } from "@financial-dashboard/api-contracts/market-data";
import { marketDataClient } from "../../../configured-api-clients.js";
import { normalizeSymbol } from "../shared/symbol.js";

export async function getCompanyOverview(
  symbol: string,
): Promise<CompanyOverview | null> {
  const normalizedSymbol = normalizeSymbol(symbol);

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
