import type { FastifyInstance } from "fastify";
import type { SymbolSearchQuery } from "@financial-dashboard/api-contracts/market-data";
import { searchSymbolsHandler } from "./symbol-search.handlers.js";

export async function symbolSearchRoutes(fastify: FastifyInstance) {
  fastify.get<{ Querystring: SymbolSearchQuery }>(
    "/symbols/search",
    searchSymbolsHandler,
  );
}
