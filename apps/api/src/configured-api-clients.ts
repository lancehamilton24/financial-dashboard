import { createAlphaVantageClient } from "@financial-dashboard/api-clients/alpha-vantage";
import config from "./config/index.js";

export const alphaVantageClient = createAlphaVantageClient({
  apiKey: config.alphaVantageApiKey,
  baseUrl: config.alphaVantageBaseUrl,
});
