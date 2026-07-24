import {
  errorResponseSchema,
  notFoundResponseSchema,
} from "../http/error-response.schema.js";
import { symbolSearchQuerySchema } from "./symbol-search-query.schema.js";
import { symbolSearchResultsSchema } from "./symbol-search-result.schema.js";

export const symbolSearchRouteSchema = {
  tags: ["Symbols"],
  operationId: "searchSymbols",
  summary: "Search ticker symbols",
  description:
    "Searches ticker symbols by keyword and returns matching securities.",
  querystring: symbolSearchQuerySchema,
  response: {
    200: symbolSearchResultsSchema,
    404: notFoundResponseSchema,
    500: errorResponseSchema,
  },
} as const;
