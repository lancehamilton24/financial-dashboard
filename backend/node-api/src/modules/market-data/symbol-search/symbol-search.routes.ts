import type { FastifyInstance } from "fastify";
import { searchSymbolsHandler } from "./symbol-search.handlers.js";
import { symbolSearchRouteSchema } from "./symbol-search-route.schema.js";
import type { SymbolSearchQuery } from "./symbol-search.types.js";

export async function symbolSearchRoutes(fastify: FastifyInstance) {
  fastify.get<{
    Querystring: SymbolSearchQuery;
  }>(
    "/symbols/search",
    {
      schema: symbolSearchRouteSchema,
      handler: searchSymbolsHandler,
    },
  );
}
