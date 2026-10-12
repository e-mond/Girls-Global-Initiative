/** Parse a fetch Response as JSON, with a clear error when HTML/error pages are returned. */
export async function readJsonResponse<T = unknown>(
  response: Response,
  fallbackMessage = "Unexpected server response.",
): Promise<T> {
  const text = await response.text();
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(fallbackMessage);
  }
}
