import type { FastifyInstance } from "fastify";
import { healthResponseSchema } from "../schemas/health-response.schema.js";

export async function healthRoutes(fastify: FastifyInstance) {
  fastify.get(
    "/health",
    {
      schema: {
        tags: ["Health"],
        operationId: "getHealth",
        summary: "Check API health",
        description: "Returns the current availability status for the API.",
        response: {
          200: healthResponseSchema,
        },
      },
    },
    async () => ({ status: "ok" }),
  );
}
