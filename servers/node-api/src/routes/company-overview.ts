import type { FastifyInstance } from "fastify";
import { getCompanyOverview } from "../services/company-overview.js";
import { symbolParamSchema } from "../schemas/symbol-param.schema.js";
import type { SymbolParam } from "../types/symbol-param.type.js";

export async function companyOverviewRoutes(fastify: FastifyInstance) {
  fastify.get<{
    Params: SymbolParam;
  }>(
    "/companies/:symbol/overview",
    {
      schema: {
        params: symbolParamSchema,
      },
    },
    async (request, reply) => {
      const { symbol } = request.params;

      try {
        const result = await getCompanyOverview(symbol);

        if (result === null) {
          return reply.code(404).send("Company overview not found");
        }

        return result;
      } catch (err) {
        fastify.log.error(err);
        return reply
          .code(500)
          .send({
            error:
              err instanceof Error
                ? err.message
                : "An unexpected error occurred while fetching company overview.",
          });
      }
    },
  );
}
