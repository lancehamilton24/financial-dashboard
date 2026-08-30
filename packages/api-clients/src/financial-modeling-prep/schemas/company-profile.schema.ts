import { z } from "zod";

export const financialModelingPrepCompanyProfileSchema = z.object({
  symbol: z.string(),
  companyName: z.string(),
  description: z.string().nullish().default(""),
  exchange: z.string().nullish().default(""),
  exchangeShortName: z.string().nullish().default(""),
  exchangeFullName: z.string().nullish().default(""),
  country: z.string().nullish().default(""),
  sector: z.string().nullish().default(""),
  industry: z.string().nullish().default(""),
  isEtf: z.boolean().nullish().default(false),
  isFund: z.boolean().nullish().default(false),
  isAdr: z.boolean().nullish().default(false),
});

export const financialModelingPrepCompanyProfileResponseSchema = z.array(
  financialModelingPrepCompanyProfileSchema,
);

export type FinancialModelingPrepCompanyProfile = z.infer<
  typeof financialModelingPrepCompanyProfileSchema
>;
