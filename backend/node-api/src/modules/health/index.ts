import type { FastifyInstance } from "fastify";
import { healthRoutes } from "./health.routes.js";

export async function healthModule(fastify: FastifyInstance) {
  await fastify.register(healthRoutes);
}
