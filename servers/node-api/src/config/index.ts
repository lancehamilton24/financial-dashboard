function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export default {
  port: Number(process.env.PORT) || 3001,
  env: process.env.NODE_ENV ?? "development",

  alphaVantageApiKey: requireEnv("ALPHA_VANTAGE_API_KEY"),
  alphaVantageBaseUrl: requireEnv("ALPHA_VANTAGE_BASE_URL"),
};
