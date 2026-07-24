export const symbolParamSchema = {
  type: "object",
  required: ["symbol"],
  properties: {
    symbol: {
      type: "string",
      minLength: 1,
      pattern: "^[A-Za-z0-9.-]+$",
    },
  },
} as const;
