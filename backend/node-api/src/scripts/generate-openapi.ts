import { writeFile } from "node:fs/promises";

process.env.ALPHA_VANTAGE_API_KEY ??= "openapi-generation";
process.env.ALPHA_VANTAGE_BASE_URL ??= "https://www.alphavantage.co/query";

const { buildApp } = await import("../app.js");

const app = await buildApp();

try {
  await app.ready();

  const contractPath = new URL("../../openapi.json", import.meta.url);
  await writeFile(contractPath, `${JSON.stringify(app.swagger(), null, 2)}\n`);
} finally {
  await app.close();
}
