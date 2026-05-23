export const errorResponseSchema = {
  type: "object",
  required: ["error"],
  properties: {
    error: { type: "string" },
  },
} as const;

export const notFoundResponseSchema = {
  type: "string",
} as const;
