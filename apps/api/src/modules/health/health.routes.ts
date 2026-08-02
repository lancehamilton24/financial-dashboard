import type { FastifyInstance } from "fastify";
import { getHealthHandler } from "./health.handlers.js";
import { healthRouteSchema } from "./health-route.schema.js";

export async function healthRoutes(fastify: FastifyInstance) {
  fastify.get("/health", {
    schema: healthRouteSchema,
    handler: getHealthHandler,
  });
}
