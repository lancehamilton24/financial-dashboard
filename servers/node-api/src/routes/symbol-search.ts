import type { FastifyInstance } from "fastify";
import { symbolSearchQuerySchema } from "../schemas/symbol-search-query.schema.js";
import { getSymbolSearchResults } from "../services/symbol-search.js";
import type { SymbolSearchQuery } from "../types/symbol-search-query.type.js";

export async function symbolSearchRoutes(fastify: FastifyInstance) {
  fastify.get<{
    Querystring: SymbolSearchQuery;
  }>(
    "/symbols/search",
    {
      schema: {
        querystring: symbolSearchQuerySchema,
      },
    },
    async (request, reply) => {
      const { keywords } = request.query;

      try {
        const result = await getSymbolSearchResults(keywords);

        if (result === null) {
          return reply
            .code(404)
            .send("No symbols found matching the provided keywords.");
        }

        return result;
      } catch (err) {
        fastify.log.error(err);
        return reply.code(500).send({
          error:
            err instanceof Error
              ? err.message
              : "An unexpected error occurred while searching for symbols.",
        });
      }
    },
  );
}
