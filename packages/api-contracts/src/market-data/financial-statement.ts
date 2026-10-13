export type FinancialStatementType =
  "income-statement" | "balance-sheet" | "cash-flow";

export type FinancialReport = {
  fiscalDateEnding: string;
  reportedCurrency: string;
  values: Record<string, number | null>;
};

export type FinancialStatement = {
  symbol: string;
  annualReports: FinancialReport[];
  quarterlyReports: FinancialReport[];
};
