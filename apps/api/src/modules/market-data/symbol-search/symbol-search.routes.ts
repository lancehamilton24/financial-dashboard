import type { FastifyInstance } from "fastify";
import { searchSymbolsHandler } from "./symbol-search.handlers.js";
import type { SymbolSearchQuery } from "./symbol-search.types.js";

export async function symbolSearchRoutes(fastify: FastifyInstance) {
  fastify.get<{ Querystring: SymbolSearchQuery }>(
    "/symbols/search",
    searchSymbolsHandler,
  );
}
