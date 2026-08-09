import type { FastifyReply, FastifyRequest } from "fastify";
import { getSymbolSearchResults } from "./symbol-search.service.js";

export async function searchSymbolsHandler(
  request: FastifyRequest<{ Querystring: string }>,
  reply: FastifyReply,
) {
  try {
    const results = await getSymbolSearchResults(request.query.keywords);

    if (!results) {
      return reply
        .code(404)
        .send("No symbols found matching the provided keywords.");
    }

    return results;
  } catch (error) {
    request.log.error(error);
    return reply
      .code(500)
      .send("An unexpected error occurred while searching for symbols.");
  }
}
