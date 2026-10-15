import { requestJson, type ProviderRequest } from "../shared/request.js";
import { AlphaVantageResponseError } from "./errors.js";

export type AlphaVantageRequest = ProviderRequest;

export function createAlphaVantageRequest(apiKey: string): AlphaVantageRequest {
  return async (functionName, params) => {
    const query = new URLSearchParams({
      function: functionName,
      ...params,
      apikey: apiKey,
    });
    const body = await requestJson(
      new URL(`https://www.alphavantage.co/query?${query}`),
      `Alpha Vantage ${functionName}`,
    );
    if (body && typeof body === "object" && !Array.isArray(body)) {
      for (const field of ["Note", "Information", "Error Message"] as const) {
        if (field in body) {
          throw new AlphaVantageResponseError(
            String((body as Record<string, unknown>)[field]),
          );
        }
      }
    }
    return body;
  };
}
