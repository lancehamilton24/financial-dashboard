import type { FastifyInstance } from "fastify";
import { healthResponseSchema } from "../schemas/health-response.schema.js";

export async function healthRoutes(fastify: FastifyInstance) {
  fastify.get(
    "/health",
    {
      schema: {
        tags: ["Health"],
        summary: "Check API health",
        response: {
          200: healthResponseSchema,
        },
      },
    },
    async () => ({ status: "ok" }),
  );
}
