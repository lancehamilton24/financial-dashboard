import { healthResponseSchema } from "./health-response.schema.js";

export const healthRouteSchema = {
  tags: ["Health"],
  operationId: "getHealth",
  summary: "Check API health",
  description: "Returns the current availability status for the API.",
  response: {
    200: healthResponseSchema,
  },
} as const;
