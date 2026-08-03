import type { FastifyReply, FastifyRequest } from "fastify";
import { getCompanyOverview } from "./company-overview.service.js";

export async function getCompanyOverviewHandler(
  request: FastifyRequest<{ Params: string }>,
  reply: FastifyReply,
) {
  try {
    const overview = await getCompanyOverview(request.params);

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
