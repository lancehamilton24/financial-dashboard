import type { FastifyInstance } from "fastify";
import { getCompanyOverviewHandler } from "./company-overview.handlers.js";
import type { CompanyOverviewParams } from "./company-overview.types.js";

export async function companyOverviewRoutes(fastify: FastifyInstance) {
  fastify.get<{ Params: CompanyOverviewParams }>(
    "/companies/:symbol/overview",
    getCompanyOverviewHandler,
  );
}
