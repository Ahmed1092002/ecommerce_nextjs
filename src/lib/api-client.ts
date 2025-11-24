import { ApiError, ApiResponse } from "@/types/api";
import Cookies from "js-cookie";
import { STORAGE_KEYS } from "./constants";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export function createApiError(
  message: string,
  statusCode: number,
  errorCode: string
) {
  const err = new Error(message) as Error & {
    statusCode: number;
    code: string;
  };
  err.statusCode = statusCode;
  err.code = errorCode;
  return err;
}

export async function apiClient<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const token =
    typeof window !== "undefined" ? Cookies.get(STORAGE_KEYS.TOKEN) : null;

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options?.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      const error = data as ApiError;
      throw createApiError(
        error.message || "An error occurred",
        error.statusCode || response.status,
        error.error || "Unknown error"
      );
    }

    return data;
  } catch (error) {
    // detect our shaped error by checking for statusCode or code
    if (error && typeof (error as any).statusCode === "number") {
      throw error;
    }
    throw createApiError("Network error", 500, "NETWORK_ERROR");
  }
}

// Convenience methods
export const api = {
  get: <T>(endpoint: string) => apiClient<T>(endpoint),

  post: <T>(endpoint: string, body: unknown) =>
    apiClient<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  put: <T>(endpoint: string, body: unknown) =>
    apiClient<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  patch: <T>(endpoint: string, body: unknown) =>
    apiClient<T>(endpoint, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  delete: <T>(endpoint: string) =>
    apiClient<T>(endpoint, {
      method: "DELETE",
    }),
};
