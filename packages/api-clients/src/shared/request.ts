export type ProviderRequest = (
  operation: string,
  params: Record<string, string>,
) => Promise<unknown>;

export async function requestJson(
  url: URL,
  operation: string,
): Promise<unknown> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `${operation} request failed with status ${response.status}.`,
    );
  }
  const body: unknown = await response.json();
  return body;
}
