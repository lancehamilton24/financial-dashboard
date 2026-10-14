import type { CompanyOverview } from "@financial-dashboard/api-contracts/market-data";
import type { FinancialModelingPrepRequest } from "./request.js";
import {
  financialModelingPrepRatiosResponseSchema,
  financialModelingPrepEstimatesResponseSchema,
} from "./schemas/index.js";

export async function fetchOverviewMetrics(
  request: FinancialModelingPrepRequest,
  symbol: string,
  price: number | null | undefined,
  today = new Date().toISOString().slice(0, 10),
): Promise<Pick<CompanyOverview, "peRatio" | "eps" | "forwardPE">> {
  // Supplemental data may be unavailable for a symbol or subscription tier.
  const [ratiosResponse, estimatesResponse] = await Promise.allSettled([
    request("ratios-ttm", { symbol }),
    request("analyst-estimates", {
      symbol,
      period: "annual",
      limit: "100",
      page: "0",
    }),
  ]);
  const ratios = financialModelingPrepRatiosResponseSchema.safeParse(
    ratiosResponse.status === "fulfilled" ? ratiosResponse.value : null,
  );
  const estimates = financialModelingPrepEstimatesResponseSchema.safeParse(
    estimatesResponse.status === "fulfilled" ? estimatesResponse.value : null,
  );
  const ratio = ratios.success
    ? ratios.data.find(
        (row) => row.symbol.toUpperCase() === symbol.toUpperCase(),
      )
    : undefined;
  // Forward P/E uses the nearest upcoming fiscal year's consensus EPS.
  // Select the period before checking EPS; do not substitute a later year's estimate.
  const estimate = estimates.success
    ? estimates.data
        .filter(
          (row) =>
            row.symbol.toUpperCase() === symbol.toUpperCase() &&
            row.date > today,
        )
        .sort((a, b) => a.date.localeCompare(b.date))[0]
    : undefined;
  const forwardPE =
    price != null &&
    price > 0 &&
    estimate?.epsAvg != null &&
    estimate.epsAvg > 0
      ? price / estimate.epsAvg
      : undefined;
  return {
    peRatio: metric(ratio?.priceToEarningsRatioTTM),
    eps: metric(ratio?.netIncomePerShareTTM),
    forwardPE: metric(forwardPE),
  };
}

function metric(value: number | null | undefined): string {
  return value != null && Number.isFinite(value)
    ? String(Number(value.toFixed(2)))
    : "";
}
