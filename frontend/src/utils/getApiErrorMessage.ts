import axios from "axios";

function collectMessages(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(collectMessages);
  if (!value || typeof value !== "object") return [];

  return Object.entries(value).flatMap(([key, nested]) => {
    const messages = collectMessages(nested);
    if (!messages.length || key === "non_field_errors") return messages;
    return messages.map((message) => `${key}: ${message}`);
  });
}

/** Converts the API's field and general errors into a form-friendly message. */
export function getApiErrorMessage(
  error: unknown,
  fallback: string,
): string {
  if (!axios.isAxiosError(error)) return fallback;

  const data: unknown = error.response?.data;
  if (!data || typeof data !== "object") return fallback;

  const response = data as Record<string, unknown>;
  const fieldErrors = collectMessages(response.errors);
  if (fieldErrors.length) return fieldErrors.join(" ");

  const detail = collectMessages(response.detail)[0];
  if (detail) return detail;

  const message = collectMessages(response.message)[0];
  return message && message !== "Erro na requisição." ? message : fallback;
}
