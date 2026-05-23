export const symbolSearchResultItemSchema = {
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
  type: "array",
  items: symbolSearchResultItemSchema,
} as const;
