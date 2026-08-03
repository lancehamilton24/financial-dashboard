export type SymbolSearchQuery = {
  keywords: string;
};

export type SymbolSearchResult = {
  symbol: string;
  name: string;
  type: string;
  region: string;
  currency: string;
};

export type SymbolSearchResults = SymbolSearchResult[];
