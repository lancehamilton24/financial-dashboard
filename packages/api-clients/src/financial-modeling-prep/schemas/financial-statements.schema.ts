import { z } from "zod";

export const financialModelingPrepFinancialReportSchema = z
  .object({
    symbol: z.string(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    reportedCurrency: z.string(),
  })
  .catchall(z.unknown());

export const financialModelingPrepFinancialStatementSchema = z.array(
  financialModelingPrepFinancialReportSchema,
);
export type FinancialModelingPrepFinancialReport = z.infer<
  typeof financialModelingPrepFinancialReportSchema
>;
