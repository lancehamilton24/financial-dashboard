import type { FastifyReply, FastifyRequest } from "fastify";
import { getCompanyOverview } from "./company-overview.service.js";
import type { CompanyOverviewParams } from "./company-overview.types.js";

export async function getCompanyOverviewHandler(
  request: FastifyRequest<{ Params: CompanyOverviewParams }>,
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
      .send("An unexpected error occurred while fetching company overview.");
  }
}
