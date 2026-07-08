export function normalizeSymbol(symbol: string): string {
  const normalizedSymbol = symbol.trim().toUpperCase();

  if (!normalizedSymbol) {
    throw new Error("Company symbol is required.");
  }

  return normalizedSymbol;
}
