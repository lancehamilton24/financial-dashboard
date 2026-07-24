export const errorResponseSchema = {
  description: "Unexpected server error.",
  type: "string",
} as const;

export const notFoundResponseSchema = {
  description: "Requested resource was not found.",
  type: "string",
} as const;
