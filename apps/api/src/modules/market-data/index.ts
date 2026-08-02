import type { FastifyInstance } from "fastify";
import { companyOverviewRoutes } from "./company-overview/company-overview.routes.js";
import { symbolSearchRoutes } from "./symbol-search/symbol-search.routes.js";

export async function marketDataModule(fastify: FastifyInstance) {
  await fastify.register(companyOverviewRoutes);
  await fastify.register(symbolSearchRoutes);
}
