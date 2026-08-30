export default {
  port: Number(process.env.PORT) || 3001,
  env: process.env.NODE_ENV ?? "development",
  alphaVantageApiKey: process.env.ALPHA_VANTAGE_API_KEY,
  financialModelingPrepApiKey: process.env.FINANCIAL_MODELING_PREP_API_KEY,
};
