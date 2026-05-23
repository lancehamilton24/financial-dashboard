import cors from "@fastify/cors";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import Fastify from "fastify";
import config from "./config/index.js";
import { companyOverviewRoutes } from "./routes/company-overview.js";
import { healthRoutes } from "./routes/health.js";
import { symbolSearchRoutes } from "./routes/symbol-search.js";

export async function buildApp() {
  const app = Fastify({ logger: true });

  await app.register(cors, { origin: true });
  await app.register(swagger, {
    openapi: {
      openapi: "3.0.3",
      info: {
        title: "Financial Dashboard API",
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
  await app.register(healthRoutes, { prefix: "/api" });
  await app.register(companyOverviewRoutes, { prefix: "/api" });
  await app.register(symbolSearchRoutes, { prefix: "/api" });

  return app;
}
