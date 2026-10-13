import { AlphaVantageResponseError } from "./errors.js";

export type AlphaVantageRequest = (
  functionName: string,
  params: Record<string, string>,
) => Promise<unknown>;

export function createAlphaVantageRequest(apiKey: string): AlphaVantageRequest {
  return async (functionName, params) => {
    const query = new URLSearchParams({
      function: functionName,
      ...params,
      apikey: apiKey,
    });
    const response = await fetch(
      new URL(`https://www.alphavantage.co/query?${query}`),
    );
    if (!response.ok) {
      throw new Error(
        `Alpha Vantage ${functionName} request failed with status ${response.status}.`,
      );
    }

    const body: unknown = await response.json();
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
