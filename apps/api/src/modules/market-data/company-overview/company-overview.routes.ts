import type { FastifyInstance } from "fastify";
import { getCompanyOverviewHandler } from "./company-overview.handlers.js";
import type {
  CompanyOverviewParams,
  CompanyOverviewQuery,
} from "./company-overview.types.js";

export async function companyOverviewRoutes(fastify: FastifyInstance) {
  fastify.get<{
    Params: CompanyOverviewParams;
    Querystring: CompanyOverviewQuery;
  }>(
    "/companies/:symbol/overview",
    {
      schema: {
        querystring: {
          type: "object",
          required: ["provider"],
          properties: {
            provider: {
              type: "string",
              enum: ["alpha-vantage", "financial-modeling-prep"],
            },
          },
        },
      },
    },
    getCompanyOverviewHandler,
  );
}
