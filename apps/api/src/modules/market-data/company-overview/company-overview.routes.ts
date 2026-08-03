import type { FastifyInstance } from "fastify";
import type { SymbolParam } from "@financial-dashboard/api-contracts/market-data";
import { getCompanyOverviewHandler } from "./company-overview.handlers.js";

export async function companyOverviewRoutes(fastify: FastifyInstance) {
  fastify.get<{ Params: SymbolParam }>(
    "/companies/:symbol/overview",
    getCompanyOverviewHandler,
  );
}
