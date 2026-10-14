import {
  financialModelingPrepFinancialStatementSchema,
  type FinancialModelingPrepFinancialReport,
} from "./schemas/index.js";
import type { FinancialModelingPrepRequest } from "./request.js";
import type {
  FinancialReport,
  FinancialStatement,
  FinancialStatementType,
} from "@financial-dashboard/api-contracts/market-data";

const paths: Record<FinancialStatementType, string> = {
  "income-statement": "income-statement",
  "balance-sheet": "balance-sheet-statement",
  "cash-flow": "cash-flow-statement",
};

// Translate provider field names to the shared dashboard metrics.
const aliases: Record<string, string> = {
  revenue: "totalRevenue",
  researchAndDevelopmentExpenses: "researchAndDevelopment",
  sellingGeneralAndAdministrativeExpenses: "sellingGeneralAndAdministrative",
  cashAndCashEquivalents: "cashAndCashEquivalentsAtCarryingValue",
  netReceivables: "currentNetReceivables",
  propertyPlantEquipmentNet: "propertyPlantEquipment",
  accountPayables: "currentAccountsPayable",
  totalDebt: "shortLongTermDebtTotal",
  totalStockholdersEquity: "totalShareholderEquity",
  depreciationAndAmortization: "depreciationDepletionAndAmortization",
  accountsReceivables: "changeInReceivables",
  operatingCashFlow: "operatingCashflow",
  capitalExpenditure: "capitalExpenditures",
  netCashProvidedByInvestingActivities: "cashflowFromInvestment",
  netCashProvidedByFinancingActivities: "cashflowFromFinancing",
  netDividendsPaid: "dividendPayout",
  commonStockRepurchased: "paymentsForRepurchaseOfCommonStock",
  netChangeInCash: "changeInCashAndCashEquivalents",
};
const metadata = new Set([
  "symbol",
  "date",
  "reportedCurrency",
  "cik",
  "filingDate",
  "fillingDate",
  "acceptedDate",
  "fiscalYear",
  "calendarYear",
  "period",
  "link",
  "finalLink",
]);

export async function fetchFinancialStatement(
  request: FinancialModelingPrepRequest,
  symbol: string,
  type: FinancialStatementType,
): Promise<FinancialStatement | null> {
  const normalizedSymbol = symbol.trim().toUpperCase();
  async function reports(period: string): Promise<FinancialReport[]> {
    const body = await request(paths[type], {
      symbol: normalizedSymbol,
      period,
      limit: "5",
    });
    const parsed =
      financialModelingPrepFinancialStatementSchema.safeParse(body);
    if (!parsed.success)
      throw new Error("Unexpected Financial Modeling Prep statement response.");
    return parsed.data
      .filter((row) => row.symbol.toUpperCase() === normalizedSymbol)
      .map((report) => normalizeReport(report, type))
      .sort(newestFirst);
  }
  const [annualReports, quarterlyReports] = await Promise.all([
    reports("annual"),
    reports("quarter"),
  ]);
  if (!annualReports.length && !quarterlyReports.length) return null;
  return { symbol: normalizedSymbol, annualReports, quarterlyReports };
}

function normalizeReport(
  report: FinancialModelingPrepFinancialReport,
  type: FinancialStatementType,
): FinancialReport {
  const values: Record<string, number | null> = {};
  for (const [key, value] of Object.entries(report)) {
    if (metadata.has(key)) continue;
    const metric =
      type === "cash-flow" && key === "inventory"
        ? "changeInInventory"
        : (aliases[key] ?? key);
    const number =
      typeof value === "number"
        ? value
        : typeof value === "string" && value.trim()
          ? Number(value)
          : NaN;
    values[metric] = Number.isFinite(number) ? number : null;
  }
  return {
    fiscalDateEnding: report.date,
    reportedCurrency: report.reportedCurrency,
    values,
  };
}

function newestFirst(a: FinancialReport, b: FinancialReport) {
  return b.fiscalDateEnding.localeCompare(a.fiscalDateEnding);
}
