export async function getHealthHandler() {
  return {
    status: "ok" as const,
  };
}
