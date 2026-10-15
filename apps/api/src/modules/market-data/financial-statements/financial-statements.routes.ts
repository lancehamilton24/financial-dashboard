import type { FastifyInstance } from "fastify";
import type {
  FinancialStatementParams,
  FinancialStatementQuery,
} from "./financial-statements.types.js";
import { getFinancialStatementHandler } from "./financial-statements.handlers.js";

export async function financialStatementRoutes(app: FastifyInstance) {
  app.get<{
    Params: FinancialStatementParams;
    Querystring: FinancialStatementQuery;
  }>(
    "/companies/:symbol/statements/:type",
    {
      schema: {
        params: {
          type: "object",
          required: ["symbol", "type"],
          properties: {
            symbol: { type: "string", minLength: 1, pattern: "\\S" },
            type: {
              type: "string",
              enum: ["income-statement", "balance-sheet", "cash-flow"],
            },
          },
        },
        querystring: {
          type: "object",

          properties: {
            provider: {
              type: "string",
              enum: ["alpha-vantage", "financial-modeling-prep"],
              default: "financial-modeling-prep",
            },
          },
        },
      },
    },
    getFinancialStatementHandler,
  );
}
