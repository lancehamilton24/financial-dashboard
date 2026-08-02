export type CompanyOverview = {
  symbol: string;
  assetType: string;
  name: string;
  description: string;
  exchange: string;
  country: string;
  sector: string;
  industry: string;
  peRatio: string;
  eps: string;
  forwardPE: string;
};

export type SymbolSearchResult = {
  symbol: string;
  name: string;
  type: string;
  region: string;
  currency: string;
};

export type MarketDataClient = {
  fetchCompanyOverview(symbol: string): Promise<CompanyOverview | null>;
  searchSymbols(keywords: string): Promise<SymbolSearchResult[]>;
};
