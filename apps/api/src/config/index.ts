function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function getMarketDataProvider(): string {
  const provider = process.env.MARKET_DATA_PROVIDER ?? "alpha-vantage";

  if (provider !== "alpha-vantage") {
    throw new Error(`Unsupported market data provider: ${provider}`);
  }

  return provider;
}

export default {
  port: Number(process.env.PORT) || 3001,
  env: process.env.NODE_ENV ?? "development",
  marketDataProvider: getMarketDataProvider(),

  alphaVantageApiKey: requireEnv("ALPHA_VANTAGE_API_KEY"),
};
