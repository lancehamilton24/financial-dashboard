import { requestJson, type ProviderRequest } from "../shared/request.js";

export type FinancialModelingPrepRequest = ProviderRequest;

export function createFinancialModelingPrepRequest(
  apiKey: string,
): FinancialModelingPrepRequest {
  return async (path, params) => {
    const query = new URLSearchParams({ ...params, apikey: apiKey });
    const body = await requestJson(
      new URL(`https://financialmodelingprep.com/stable/${path}?${query}`),
      `Financial Modeling Prep ${path}`,
    );
    if (body && typeof body === "object" && !Array.isArray(body)) {
      for (const field of ["message", "Error Message"] as const) {
        if (field in body) {
          throw new Error(
            "Financial Modeling Prep could not provide this data. Please check the provider configuration and try again.",
          );
        }
      }
    }
    return body;
  };
}
