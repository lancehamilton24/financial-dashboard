import type { FastifyInstance } from "fastify";
import { getHealthHandler } from "./health.handlers.js";

export async function healthRoutes(fastify: FastifyInstance) {
  fastify.get("/health", getHealthHandler);
}
