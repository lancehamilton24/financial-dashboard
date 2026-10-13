import type { FastifyReply, FastifyRequest } from "fastify";
import { AlphaVantageResponseError } from "@financial-dashboard/api-clients/alpha-vantage";
import { getCompanyOverview } from "./company-overview.service.js";
import type {
  CompanyOverviewParams,
  CompanyOverviewQuery,
} from "./company-overview.types.js";

export async function getCompanyOverviewHandler(
  request: FastifyRequest<{
    Params: CompanyOverviewParams;
    Querystring: CompanyOverviewQuery;
  }>,
  reply: FastifyReply,
) {
  try {
    const overview = await getCompanyOverview(
      request.params.symbol,
      request.query.provider,
    );

    if (!overview) {
      return reply.code(404).send("Company overview not found");
    }

    return overview;
  } catch (error) {
    request.log.error(error);
    if (error instanceof AlphaVantageResponseError) {
      return reply.code(502).send(error.message);
    }
    return reply
      .code(500)
      .send("An unexpected error occurred while fetching company overview.");
  }
}
