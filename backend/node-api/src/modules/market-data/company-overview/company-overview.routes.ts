import type { FastifyInstance } from "fastify";
import { companyOverviewRouteSchema } from "./company-overview-route.schema.js";
import { getCompanyOverview } from "./company-overview.service.js";
import type { SymbolParam } from "./company-overview.types.js";

export async function companyOverviewRoutes(fastify: FastifyInstance) {
  fastify.get<{
    Params: SymbolParam;
  }>(
    "/companies/:symbol/overview",
    { schema: companyOverviewRouteSchema },
    async (request, reply) => {
      const { symbol } = request.params;

      try {
        const result = await getCompanyOverview(symbol);

        if (!result) {
          return reply.code(404).send("Company overview not found");
        }

        return result;
      } catch (err) {
        fastify.log.error(err);
        return reply
          .code(500)
          .send(
            "An unexpected error occurred while fetching company overview.",
          );
      }
    },
  );
}
