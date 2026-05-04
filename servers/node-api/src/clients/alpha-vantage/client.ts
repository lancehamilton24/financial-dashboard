import config from "../../config/index.js";
import {
  type AlphaVantageCompanyOverview,
  alphaVantageCompanyOverviewSchema,
} from "./schema.js";

export async function getCompanyOverview(
  symbol: string,
): Promise<AlphaVantageCompanyOverview> {
  const normalizedSymbol = symbol.trim().toUpperCase();

  if (!normalizedSymbol) {
    throw new Error("Company symbol is required.");
  }

  const url = new URL(config.alphaVantageBaseUrl);
  url.searchParams.set("function", "OVERVIEW");
  url.searchParams.set("symbol", normalizedSymbol);
  url.searchParams.set("apikey", config.alphaVantageApiKey);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Alpha Vantage request failed with status ${response.status}.`);
  }

  const body = await response.json();

  const errorMessage = body["Error Message"] ?? body.Information;

  if (errorMessage) {
    throw new Error(`Alpha Vantage error: ${errorMessage}`);
  }

  const result = await alphaVantageCompanyOverviewSchema.safeParseAsync(body);

  if (!result.success) {
    throw new Error("Alpha Vantage returned an unexpected response.");
  }

  return result.data;
}
