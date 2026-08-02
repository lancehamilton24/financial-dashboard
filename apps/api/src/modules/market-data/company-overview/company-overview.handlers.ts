import type { FastifyReply, FastifyRequest } from "fastify";
import { getCompanyOverview } from "./company-overview.service.js";
import type { SymbolParam } from "./company-overview.types.js";

export async function getCompanyOverviewHandler(
  request: FastifyRequest<{ Params: SymbolParam }>,
  reply: FastifyReply,
) {
  try {
    const overview = await getCompanyOverview(request.params.symbol);

    if (!overview) {
      return reply.code(404).send("Company overview not found");
    }

    return overview;
  } catch (error) {
    request.log.error(error);
    return reply
      .code(500)
      .send(
        "An unexpected error occurred while fetching company overview.",
      );
  }
}
