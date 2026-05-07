import { fetchCompanyOverview } from "../clients/alpha-vantage/client.js";
import type { AlphaVantageCompanyOverview } from "../clients/alpha-vantage/schema.js";
import type { CompanyOverview } from "../types/company-overview.type.js";

export async function getCompanyOverview(
  symbol: string,
): Promise<CompanyOverview | null> {
  const overview = await fetchCompanyOverview(symbol);

  if (overview === null) {
    return null;
  }

  return toCompanyOverview(overview);
}

function toCompanyOverview(
  overview: AlphaVantageCompanyOverview,
): CompanyOverview {
  return {
    symbol: overview.Symbol,
    assetType: overview.AssetType,
    name: overview.Name,
    description: overview.Description,
    exchange: overview.Exchange,
    country: overview.Country,
    sector: overview.Sector,
    industry: overview.Industry,
    peRatio: overview.PERatio,
    eps: overview.EPS,
    forwardPE: overview.ForwardPE,
  };
}
