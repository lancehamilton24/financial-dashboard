import type { FastifyReply, FastifyRequest } from "fastify";
import { AlphaVantageResponseError } from "@financial-dashboard/api-clients/alpha-vantage";
import { getFinancialStatement } from "./financial-statements.service.js";
import type {
  FinancialStatementParams,
  FinancialStatementQuery,
} from "./financial-statements.types.js";

export async function getFinancialStatementHandler(
  request: FastifyRequest<{
    Params: FinancialStatementParams;
    Querystring: FinancialStatementQuery;
  }>,
  reply: FastifyReply,
) {
  try {
    const statement = await getFinancialStatement(
      request.params.symbol,
      request.params.type,
      request.query.provider,
    );

    if (!statement) {
      return reply.code(404).send("Financial statement not found.");
    }

    return statement;
  } catch (error) {
    request.log.error(error);
    if (error instanceof AlphaVantageResponseError) {
      return reply.code(502).send(error.message);
    }
    return reply
      .code(502)
      .send(
        "Unable to load the statement from the selected provider. The provider may be unavailable or its API limit may have been reached. Please try again later.",
      );
  }
}
