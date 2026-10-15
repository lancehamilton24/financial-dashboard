/** Map only explicitly supported fields, preserving provider values and signs. */
export function mapFinancialValues(
  report: Record<string, unknown>,
  fields: Record<string, string>,
): Record<string, number | null> {
  return Object.fromEntries(
    Object.entries(fields).map(([metric, field]) => {
      const value = report[field];
      const number =
        typeof value === "number"
          ? value
          : typeof value === "string" && value.trim()
            ? Number(value)
            : NaN;
      return [metric, Number.isFinite(number) ? number : null];
    }),
  );
}
