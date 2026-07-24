import { z } from "zod";

export const alphaVantageSymbolSearchMatchSchema = z.object({
  "1. symbol": z.string(),
  "2. name": z.string(),
  "3. type": z.string(),
  "4. region": z.string(),
  "5. marketOpen": z.string(),
  "6. marketClose": z.string(),
  "7. timezone": z.string(),
  "8. currency": z.string(),
  "9. matchScore": z.string(),
});

export type AlphaVantageSymbolSearchMatch = z.infer<
  typeof alphaVantageSymbolSearchMatchSchema
>;

export const alphaVantageSymbolSearchResponseSchema = z.object({
  bestMatches: z.array(alphaVantageSymbolSearchMatchSchema),
});

export type AlphaVantageSymbolSearchResponse = z.infer<
  typeof alphaVantageSymbolSearchResponseSchema
>;
