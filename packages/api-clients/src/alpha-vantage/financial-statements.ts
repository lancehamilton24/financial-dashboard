import { mapFinancialValues } from "../shared/financial-statements.js";
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

// Shared output metric -> provider field. Only these fields are returned.
const statementFields: Record<
  FinancialStatementType,
  Record<string, string>
> = {
  "income-statement": {
    totalRevenue: "totalRevenue",
    costOfRevenue: "costOfRevenue",
    grossProfit: "grossProfit",
    researchAndDevelopment: "researchAndDevelopment",
    sellingGeneralAndAdministrative: "sellingGeneralAndAdministrative",
    operatingExpenses: "operatingExpenses",
    operatingIncome: "operatingIncome",
    ebitda: "ebitda",
    interestExpense: "interestExpense",
    incomeBeforeTax: "incomeBeforeTax",
    incomeTaxExpense: "incomeTaxExpense",
    netIncome: "netIncome",
  },
  "balance-sheet": {
    cashAndCashEquivalentsAtCarryingValue:
      "cashAndCashEquivalentsAtCarryingValue",
    currentNetReceivables: "currentNetReceivables",
    inventory: "inventory",
    totalCurrentAssets: "totalCurrentAssets",
    propertyPlantEquipment: "propertyPlantEquipment",
    totalAssets: "totalAssets",
    currentAccountsPayable: "currentAccountsPayable",
    totalCurrentLiabilities: "totalCurrentLiabilities",
    shortLongTermDebtTotal: "shortLongTermDebtTotal",
    totalLiabilities: "totalLiabilities",
    retainedEarnings: "retainedEarnings",
    totalShareholderEquity: "totalShareholderEquity",
  },
  "cash-flow": {
    netIncome: "netIncome",
    depreciationDepletionAndAmortization:
      "depreciationDepletionAndAmortization",
    changeInReceivables: "changeInReceivables",
    changeInInventory: "changeInInventory",
    operatingCashflow: "operatingCashflow",
    capitalExpenditures: "capitalExpenditures",
    cashflowFromInvestment: "cashflowFromInvestment",
    cashflowFromFinancing: "cashflowFromFinancing",
    dividendPayout: "dividendPayout",
    paymentsForRepurchaseOfCommonStock: "paymentsForRepurchaseOfCommonStock",
    changeInCashAndCashEquivalents: "changeInCashAndCashEquivalents",
  },
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
      .map((report) => normalizeReport(report, type))
      .sort(newestFirst),
    quarterlyReports: result.data.quarterlyReports
      .map((report) => normalizeReport(report, type))
      .sort(newestFirst),
  };
}

function normalizeReport(
  report: AlphaVantageFinancialReport,
  type: FinancialStatementType,
): FinancialReport {
  return {
    fiscalDateEnding: report.fiscalDateEnding,
    reportedCurrency: report.reportedCurrency,
    values: mapFinancialValues(report, statementFields[type]),
  };
}

function newestFirst(a: FinancialReport, b: FinancialReport) {
  return b.fiscalDateEnding.localeCompare(a.fiscalDateEnding);
}
