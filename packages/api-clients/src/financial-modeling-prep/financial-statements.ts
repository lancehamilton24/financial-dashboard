import { mapFinancialValues } from "../shared/financial-statements.js";
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

// Shared output metric -> provider field. Only these fields are returned.
const statementFields: Record<
  FinancialStatementType,
  Record<string, string>
> = {
  "income-statement": {
    totalRevenue: "revenue",
    costOfRevenue: "costOfRevenue",
    grossProfit: "grossProfit",
    researchAndDevelopment: "researchAndDevelopmentExpenses",
    sellingGeneralAndAdministrative: "sellingGeneralAndAdministrativeExpenses",
    operatingExpenses: "operatingExpenses",
    operatingIncome: "operatingIncome",
    ebitda: "ebitda",
    interestExpense: "interestExpense",
    incomeBeforeTax: "incomeBeforeTax",
    incomeTaxExpense: "incomeTaxExpense",
    netIncome: "netIncome",
  },
  "balance-sheet": {
    cashAndCashEquivalentsAtCarryingValue: "cashAndCashEquivalents",
    currentNetReceivables: "netReceivables",
    inventory: "inventory",
    totalCurrentAssets: "totalCurrentAssets",
    propertyPlantEquipment: "propertyPlantEquipmentNet",
    totalAssets: "totalAssets",
    currentAccountsPayable: "accountPayables",
    totalCurrentLiabilities: "totalCurrentLiabilities",
    shortLongTermDebtTotal: "totalDebt",
    totalLiabilities: "totalLiabilities",
    retainedEarnings: "retainedEarnings",
    totalShareholderEquity: "totalStockholdersEquity",
  },
  "cash-flow": {
    netIncome: "netIncome",
    depreciationDepletionAndAmortization: "depreciationAndAmortization",
    changeInReceivables: "accountsReceivables",
    changeInInventory: "inventory",
    operatingCashflow: "operatingCashFlow",
    capitalExpenditures: "capitalExpenditure",
    cashflowFromInvestment: "netCashProvidedByInvestingActivities",
    cashflowFromFinancing: "netCashProvidedByFinancingActivities",
    dividendPayout: "netDividendsPaid",
    paymentsForRepurchaseOfCommonStock: "commonStockRepurchased",
    changeInCashAndCashEquivalents: "netChangeInCash",
  },
};

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
  return {
    fiscalDateEnding: report.date,
    reportedCurrency: report.reportedCurrency,
    values: mapFinancialValues(report, statementFields[type]),
  };
}

function newestFirst(a: FinancialReport, b: FinancialReport) {
  return b.fiscalDateEnding.localeCompare(a.fiscalDateEnding);
}
