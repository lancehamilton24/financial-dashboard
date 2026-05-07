export const symbolParamSchema = {
  type: "object",
  properties: {
    symbol: {
      type: "string",
      pattern: "^[A-Za-z0-9.-]+$",
    },
  },
} as const;
