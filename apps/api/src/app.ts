import cors from "@fastify/cors";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import Fastify from "fastify";
import config from "./config/index.js";
import { healthModule } from "./modules/health/index.js";
import { marketDataModule } from "./modules/market-data/index.js";

export async function buildApp() {
  const app = Fastify({ logger: true });

  await app.register(cors, { origin: true });
  await app.register(swagger, {
    openapi: {
      openapi: "3.0.3",
      info: {
        title: "Financial Dashboard API",
        description:
          "REST API for health checks, ticker symbol search, and company overview data.",
        version: "1.0.0",
      },
      tags: [
        {
          name: "Health",
          description: "API availability checks.",
        },
        {
          name: "Companies",
          description: "Company fundamentals and overview data.",
        },
        {
          name: "Symbols",
          description: "Ticker symbol search and validation.",
        },
      ],
      servers: [
        {
          url: `http://localhost:${config.port}`,
          description: "Local development",
        },
      ],
    },
  });
  await app.register(swaggerUi, {
    routePrefix: "/docs",
  });
  await app.register(healthModule, { prefix: "/api" });
  await app.register(marketDataModule, { prefix: "/api" });

  return app;
}
