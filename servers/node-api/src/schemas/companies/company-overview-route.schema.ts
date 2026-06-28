import { companyOverviewSchema } from "./company-overview.schema.js";
import {
  errorResponseSchema,
  notFoundResponseSchema,
} from "../http/error-response.schema.js";
import { symbolParamSchema } from "../symbols/symbol-param.schema.js";

export const companyOverviewRouteSchema = {
  tags: ["Companies"],
  operationId: "getCompanyOverview",
  summary: "Get company overview",
  description:
    "Returns company fundamentals and overview data for a ticker symbol.",
  params: symbolParamSchema,
  response: {
    200: companyOverviewSchema,
    404: notFoundResponseSchema,
    500: errorResponseSchema,
  },
} as const;
