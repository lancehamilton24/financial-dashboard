import type { FastifyInstance } from "fastify";
import { healthRouteSchema } from "../schemas/health/health-route.schema.js";

export async function healthRoutes(fastify: FastifyInstance) {
  fastify.get("/health", { schema: healthRouteSchema }, async () => ({
    status: "ok",
  }));
}
