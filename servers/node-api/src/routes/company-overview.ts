import type { FastifyInstance } from "fastify";
import { getCompanyOverview } from "../services/company-overview.js";
import { symbolParamSchema } from "../shared/schemas/symbol-param.schema.js";
import type { SymbolParam } from "../shared/types/symbol-param.type.js";

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
        const data = await getCompanyOverview(symbol);

        if (data === null) {
          return reply.code(404).send("Company overview not found");
        }

        return data;
      } catch (err) {
        fastify.log.error(err);
        return reply
          .code(500)
          .send({ error: "Failed to fetch company overview" });
      }
    },
  );
}
