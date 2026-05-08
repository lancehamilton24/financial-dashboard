import Fastify from "fastify";
import cors from "@fastify/cors";
import config from "./config/index.js";
import { companyOverviewRoutes } from "./routes/company-overview.js";
import { healthRoutes } from "./routes/health.js";
import { symbolSearchRoutes } from "./routes/symbol-search.js";

const app = Fastify({ logger: true });

await app.register(cors, { origin: true });
await app.register(companyOverviewRoutes, { prefix: "/api" });
await app.register(healthRoutes, { prefix: "/api" });
await app.register(symbolSearchRoutes, { prefix: "/api" });

try {
  await app.listen({ port: config.port, host: "0.0.0.0" });
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
