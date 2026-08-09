import type { FastifyInstance } from "fastify";
import { searchSymbolsHandler } from "./symbol-search.handlers.js";

export async function symbolSearchRoutes(fastify: FastifyInstance) {
  fastify.get<{ Querystring: string }>(
    "/symbols/search",
    searchSymbolsHandler,
  );
}
