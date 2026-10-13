import {
  alphaVantageFinancialStatementSchema,
  type AlphaVantageFinancialReport,
} from "./schemas/index.js";
import type {
  FinancialReport,
  FinancialStatement,
  FinancialStatementType,
} from "@financial-dashboard/api-contracts/market-data";
import type { AlphaVantageRequest } from "./request.js";

const functions: Record<FinancialStatementType, string> = {
  "income-statement": "INCOME_STATEMENT",
  "balance-sheet": "BALANCE_SHEET",
  "cash-flow": "CASH_FLOW",
};

export async function fetchFinancialStatement(
  request: AlphaVantageRequest,
  symbol: string,
  type: FinancialStatementType,
): Promise<FinancialStatement | null> {
  const body = await request(functions[type], { symbol });
  if (body && typeof body === "object" && !Array.isArray(body)) {
    if (Object.keys(body).length === 0) return null;
  }
  const result = alphaVantageFinancialStatementSchema.safeParse(body);
  if (!result.success)
    throw new Error("Unexpected Alpha Vantage statement response.");
  if (result.data.symbol.toUpperCase() !== symbol.toUpperCase()) return null;
  return {
    symbol: result.data.symbol,
    annualReports: result.data.annualReports
      .map(normalizeReport)
      .sort(newestFirst),
    quarterlyReports: result.data.quarterlyReports
      .map(normalizeReport)
      .sort(newestFirst),
  };
}

function normalizeReport(
  report: AlphaVantageFinancialReport,
): FinancialReport {
  const { fiscalDateEnding, reportedCurrency, ...fields } = report;
  const values = Object.fromEntries(
    Object.entries(fields).map(([key, value]) => {
      const number =
        value === null || value.trim() === "" ? NaN : Number(value);
      return [key, Number.isFinite(number) ? number : null];
    }),
  );
  return { fiscalDateEnding, reportedCurrency, values };
}

function newestFirst(a: FinancialReport, b: FinancialReport) {
  return b.fiscalDateEnding.localeCompare(a.fiscalDateEnding);
}
