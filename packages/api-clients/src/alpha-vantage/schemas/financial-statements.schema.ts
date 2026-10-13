import { z } from "zod";

export const alphaVantageFinancialReportSchema = z
  .object({
    fiscalDateEnding: z.iso.date(),
    reportedCurrency: z.string().min(1),
  })
  .catchall(z.string().nullable());

export type AlphaVantageFinancialReport = z.infer<
  typeof alphaVantageFinancialReportSchema
>;

export const alphaVantageFinancialStatementSchema = z.object({
  symbol: z.string().min(1),
  annualReports: z.array(alphaVantageFinancialReportSchema),
  quarterlyReports: z.array(alphaVantageFinancialReportSchema),
});

export type AlphaVantageFinancialStatement = z.infer<
  typeof alphaVantageFinancialStatementSchema
>;
