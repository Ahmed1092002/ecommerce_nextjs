import { ApiErrorWithField } from "@/lib/api-client";
import { SearchParams } from "../types/hook-types";

/**
 * Builds query string from params object
 * @param params - Object containing query parameters
 * @returns Query string with leading '?' or empty string
 */
export function buildQueryString(params?: SearchParams  ): string {
  if (!params) return "";

  const entries = Object.entries(params).filter(([, v]) => v !== undefined);
  if (entries.length === 0) return "";

  const searchParams = new URLSearchParams();
  for (const [k, v] of entries) {
    searchParams.append(k, String(v));
  }
  return `?${searchParams.toString()}`;
}

/**
 * Standard error handler for hooks
 * Extracts error message from various error types
 * @param error - Error object of unknown type
 * @returns Formatted error message string
 */
export function handleHookError(error: unknown): string {
  let errorMessage = "An error occurred";
  if (error instanceof ApiErrorWithField) {
    errorMessage = error.message;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }
  return errorMessage;
}
