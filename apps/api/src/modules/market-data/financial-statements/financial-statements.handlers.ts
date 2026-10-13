import type { FastifyReply, FastifyRequest } from "fastify";
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
  if (request.query.provider !== "alpha-vantage") {
    return reply
      .code(501)
      .send(
        "Financial statements are currently available through Alpha Vantage only.",
      );
  }

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
    return reply
      .code(502)
      .send(
        "Unable to load the statement from Alpha Vantage. The provider may be unavailable or its API limit may have been reached. Please try again later.",
      );
  }
}
