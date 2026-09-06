import { z } from "zod";

export const financialModelingPrepSymbolSearchResultSchema = z.object({
  symbol: z.string(),
  name: z.string(),
  currency: z.string().optional().default(""),
  stockExchange: z.string().optional().default(""),
  exchangeFullName: z.string().optional().default(""),
  exchangeShortName: z.string().optional().default(""),
  exchange: z.string().optional().default(""),
});

export const financialModelingPrepSymbolSearchResponseSchema = z.array(
  financialModelingPrepSymbolSearchResultSchema,
);

export type FinancialModelingPrepSymbolSearchResult = z.infer<
  typeof financialModelingPrepSymbolSearchResultSchema
>;
