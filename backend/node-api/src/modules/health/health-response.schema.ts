export const healthResponseSchema = {
  description: "API health status.",
  type: "object",
  required: ["status"],
  properties: {
    status: { type: "string", enum: ["ok"] },
  },
} as const;
