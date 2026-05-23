export const symbolSearchQuerySchema = {
  type: "object",
  required: ["keywords"],
  properties: {
    keywords: {
      type: "string",
      minLength: 1,
    },
  },
} as const;
