import cors from "@fastify/cors";
import Fastify from "fastify";
import { healthModule } from "./modules/health/index.js";
import { marketDataModule } from "./modules/market-data/index.js";

export async function buildApp() {
  const app = Fastify({ logger: true });

  await app.register(cors, { origin: true });
  await app.register(healthModule, { prefix: "/api" });
  await app.register(marketDataModule, { prefix: "/api" });

  return app;
}
