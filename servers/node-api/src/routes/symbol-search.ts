import type { FastifyInstance } from "fastify";
import {
  errorResponseSchema,
  notFoundResponseSchema,
} from "../schemas/error-response.schema.js";
import { symbolSearchResultsSchema } from "../schemas/symbol-search-result.schema.js";
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
        tags: ["Symbols"],
        summary: "Search ticker symbols",
        querystring: symbolSearchQuerySchema,
        response: {
          200: symbolSearchResultsSchema,
          404: notFoundResponseSchema,
          500: errorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { keywords } = request.query;

      try {
        const result = await getSymbolSearchResults(keywords);

        if (!result) {
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
