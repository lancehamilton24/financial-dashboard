import type { FastifyInstance } from "fastify";
import { symbolSearchRouteSchema } from "./symbol-search-route.schema.js";
import { getSymbolSearchResults } from "./symbol-search.service.js";
import type { SymbolSearchQuery } from "./symbol-search.types.js";

export async function symbolSearchRoutes(fastify: FastifyInstance) {
  fastify.get<{
    Querystring: SymbolSearchQuery;
  }>(
    "/symbols/search",
    { schema: symbolSearchRouteSchema },
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
        return reply
          .code(500)
          .send("An unexpected error occurred while searching for symbols.");
      }
    },
  );
}
