import type { FastifyInstance } from "fastify";
import { searchSymbolsHandler } from "./symbol-search.handlers.js";
import type { SymbolSearchQuery } from "./symbol-search.types.js";

export async function symbolSearchRoutes(fastify: FastifyInstance) {
  fastify.get<{ Querystring: SymbolSearchQuery }>(
    "/symbols/search",
    {
      schema: {
        querystring: {
          type: "object",
          required: ["keywords", "provider"],
          properties: {
            keywords: { type: "string", minLength: 1 },
            provider: {
              type: "string",
              enum: ["alpha-vantage", "financial-modeling-prep"],
            },
          },
        },
      },
    },
    searchSymbolsHandler,
  );
}
