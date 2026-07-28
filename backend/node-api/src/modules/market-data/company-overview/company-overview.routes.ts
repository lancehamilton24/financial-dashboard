import type { FastifyInstance } from "fastify";
import { getCompanyOverviewHandler } from "./company-overview.handlers.js";
import { companyOverviewRouteSchema } from "./company-overview-route.schema.js";
import type { SymbolParam } from "./company-overview.types.js";

export async function companyOverviewRoutes(fastify: FastifyInstance) {
  fastify.get<{
    Params: SymbolParam;
  }>(
    "/companies/:symbol/overview",
    {
      schema: companyOverviewRouteSchema,
      handler: getCompanyOverviewHandler,
    },
  );
}
