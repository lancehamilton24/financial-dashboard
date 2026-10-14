import { z } from "zod";

export const financialModelingPrepRatiosResponseSchema = z.array(
  z.object({
    symbol: z.string(),
    priceToEarningsRatioTTM: z.number().nullish(),
    netIncomePerShareTTM: z.number().nullish(),
  }),
);

export const financialModelingPrepEstimatesResponseSchema = z.array(
  z.object({
    symbol: z.string(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    epsAvg: z.number().nullish(),
  }),
);
