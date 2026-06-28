export const symbolSearchResultItemSchema = {
  description: "Ticker symbol search result.",
  type: "object",
  required: ["symbol", "name", "type", "region", "currency"],
  properties: {
    symbol: { type: "string" },
    name: { type: "string" },
    type: { type: "string" },
    region: { type: "string" },
    currency: { type: "string" },
  },
} as const;

export const symbolSearchResultsSchema = {
  description: "Matching ticker symbol search results.",
  type: "array",
  items: symbolSearchResultItemSchema,
} as const;
