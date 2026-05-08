import { z } from "zod";

export const alphaVantageCompanyOverviewSchema = z
  .object({
    Symbol: z.string(),
    AssetType: z.string(),
    Name: z.string(),
    Description: z.string(),
    CIK: z.string(),
    Exchange: z.string(),
    Currency: z.string(),
    Country: z.string(),
    Sector: z.string(),
    Industry: z.string(),
    Address: z.string(),
    OfficialSite: z.string(),
    FiscalYearEnd: z.string(),
    LatestQuarter: z.string(),
    MarketCapitalization: z.string(),
    EBITDA: z.string(),
    PERatio: z.string(),
    PEGRatio: z.string(),
    BookValue: z.string(),
    DividendPerShare: z.string(),
    DividendYield: z.string(),
    EPS: z.string(),
    RevenuePerShareTTM: z.string(),
    ProfitMargin: z.string(),
    OperatingMarginTTM: z.string(),
    ReturnOnAssetsTTM: z.string(),
    ReturnOnEquityTTM: z.string(),
    RevenueTTM: z.string(),
    GrossProfitTTM: z.string(),
    DilutedEPSTTM: z.string(),
    QuarterlyEarningsGrowthYOY: z.string(),
    QuarterlyRevenueGrowthYOY: z.string(),
    AnalystTargetPrice: z.string(),
    AnalystRatingStrongBuy: z.string(),
    AnalystRatingBuy: z.string(),
    AnalystRatingHold: z.string(),
    AnalystRatingSell: z.string(),
    AnalystRatingStrongSell: z.string(),
    TrailingPE: z.string(),
    ForwardPE: z.string(),
    PriceToSalesRatioTTM: z.string(),
    PriceToBookRatio: z.string(),
    EVToRevenue: z.string(),
    EVToEBITDA: z.string(),
    Beta: z.string(),
    "52WeekHigh": z.string(),
    "52WeekLow": z.string(),
    "50DayMovingAverage": z.string(),
    "200DayMovingAverage": z.string(),
    SharesOutstanding: z.string(),
    SharesFloat: z.string(),
    PercentInsiders: z.string(),
    PercentInstitutions: z.string(),
    DividendDate: z.string(),
    ExDividendDate: z.string(),
  })
  .catchall(z.string());

export type AlphaVantageCompanyOverview = z.infer<
  typeof alphaVantageCompanyOverviewSchema
>;

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
